import { Knex } from 'knex';
import { ApolloError } from 'apollo-server';
import {
  dbUtils, context, UUID, createLogger,
} from '../shared';
import {
  convertCart, convertCartItem,
  convertProductCategory,
} from '../shared/converters/webshopConverters';
import { addMinutes } from '../shared/utils';
import * as gql from '../types/graphql';
import * as sql from '../types/webshop';
import { TABLE } from '../types/webshop';

let transactions = 0;

/** used for debugging purposes */
const generateTransactionId = () => {
  transactions += 1;
  return transactions;
};

const CART_EXPIRATION_MINUTES = 15;
export const TRANSACTION_COST = 2;
export const TRANSACTION_ITEM: gql.CartItem = {
  id: '8ed3a794-2b6b-4f5f-8486-09a649477847',
  name: 'Transaktionsavgift',
  description: 'Hur mycket pengar swish tar från oss',
  price: TRANSACTION_COST,
  maxPerUser: 1,
  imageUrl: 'https://play-lh.googleusercontent.com/NiU9oukn_XtdpjyODVezYIxeZ3Obs04bH9VZa0MAhZN4s9x5mG9O1lO_ZF37CDKck_8K',
  inventory: [],
};

const logger = createLogger('WebshopAPI');

let cartsChecked = false;

export default class CartAPI extends dbUtils.KnexDataSource {
  constructor(_knex: Knex) {
    super(_knex);
    if (!cartsChecked && process.env.NODE_ENV !== 'test') {
      this.removeCartsIfExpired(); // not tested
      cartsChecked = true;
    }
  }

  private async removeCartsIfExpired() {
    logger.info('Startup. Checking for expired carts...');
    const carts = await this.knex<sql.Cart>(TABLE.CART);
    await Promise.all(carts.map((c) => this.removeCartIfExpired(c)));
    logger.info('Finished checking for expired carts.');
  }

  private async createMyCart(ctx: context.UserContext): Promise<sql.Cart> {
    if (!ctx?.user?.student_id) throw new Error('You are not logged in');
    const cart = (await this.knex<sql.Cart>(TABLE.CART).insert({
      student_id: ctx?.user?.student_id,
      expires_at: addMinutes(new Date(), CART_EXPIRATION_MINUTES),
      total_price: TRANSACTION_COST,
      total_quantity: 0,
    }).returning('*'))[0];
    if (!cart) throw new Error('Failed to create cart');
    setTimeout(() => {
      this.removeCartIfExpired(cart); // how does one even test this???
    }, CART_EXPIRATION_MINUTES * 60 * 1000 + 250);
    return cart;
  }

  private async removeCart(cart: sql.Cart): Promise<boolean> {
    const cartItems = await this.knex<sql.CartItem>(TABLE.CART_ITEM).where({ cart_id: cart.id });
    const removePromises: Promise<gql.Cart>[] = [];
    for (let i = 0; i < cartItems.length; i += 1) {
      const cartItem = cartItems[i];
      removePromises.push(
        this.removeFromCart(cart.id, cartItem.product_inventory_id, cartItem.quantity),
      );
    }
    await Promise.all(removePromises);
    await this.knex(TABLE.CART).where({ id: cart.id }).delete();
    logger.info(`Finished removing ${cart.student_id}'s cart.`);
    return true;
  }

  private async removeCartIfExpired(cart: sql.Cart) {
    const cartToRemove = await this.knex<sql.Cart>(TABLE.CART).where({ id: cart.id }).first();
    if (!cartToRemove) return;
    const now = new Date();
    if (cart.expires_at < now) {
      logger.info(`${cart.student_id}'s cart has expired, removing...`);
      await this.removeCart(cart);
      logger.info(`Finished removing ${cart.student_id}'s cart.`);
    }
  }

  removeMyCart(ctx: context.UserContext): Promise<boolean> {
    return this.withAccess('webshop:use', ctx, async () => {
      if (!ctx?.user?.student_id) throw new Error('You are not logged in');
      const cart = await this.knex<sql.Cart>(TABLE.CART)
        .where({ student_id: ctx.user.student_id })
        .first();
      if (!cart) throw new ApolloError('Cart not found');
      return this.removeCart(cart);
    });
  }

  getMyCart(ctx: context.UserContext): Promise<gql.Maybe<gql.Cart>> {
    return this.withAccess('webshop:read', ctx, async () => {
      if (!ctx?.user?.student_id) throw new Error('You are not logged in');
      const cart = await this.knex<sql.Cart>(TABLE.CART).where({
        student_id: ctx?.user?.student_id,
      }).first();
      if (!cart) return undefined;
      return convertCart(cart);
    });
  }

  getCartsItemInMyCart(ctx: context.UserContext, cart: gql.Cart): Promise<gql.CartItem[]> {
    return this.withAccess('webshop:use', ctx, async () => {
      if (!ctx?.user?.student_id) throw new Error('You are not logged in');
      const cartItems = await this.knex<sql.CartItem>(TABLE.CART_ITEM).where({
        cart_id: cart.id,
      });
      const inventories = await this.knex<sql.ProductInventory>(TABLE.PRODUCT_INVENTORY)
        .whereIn('id', cartItems.map((i) => i.product_inventory_id));
      const sqlProducts = await this.knex<sql.Product>(TABLE.PRODUCT)
        .whereIn('id', inventories.map((i) => i.product_id));
      const categories = await this.knex<sql.ProductCategory>(TABLE.PRODUCT_CATEGORY)
        .whereIn('id', sqlProducts.map((p) => p.category_id));
      /*       const discounts = await this.knex<sql.ProductDiscount>(TABLE.PRODUCT_DISCOUNT)
        .whereIn('id', inventories.filter((i) => i.discount_id).map((i) => i.discount_id!)); */
      const result = sqlProducts.map((product) => {
        const category = convertProductCategory(categories
          .find((c) => c.id === product.category_id));
        const inventory: gql.CartInventory[] = inventories
          .filter((i) => i.product_id === product.id)
          .map((inv) => {
            const cartItem = cartItems.find((ci) => ci.product_inventory_id === inv.id);
            if (!cartItem) throw new Error('Failed to find cart item');
            return {
              id: cartItem.id,
              inventoryId: inv.id,
              quantity: cartItem.quantity,
              // discount: discount || undefined,
              variant: inv.variant,
            };
          });
        return convertCartItem({
          product, category, inventory,
        });
      });
      return [...result, TRANSACTION_ITEM];
    });
  }

  private async inventoryToCartTransaction(
    cart: sql.Cart,
    inventoryId: UUID,
    quantity: number = 1,
  ) {
    const transactionId = generateTransactionId();
    logger.info(`Transaction ${transactionId}: ${cart.student_id} adding ${quantity} of ${inventoryId} to cart ${cart.id}`);
    return this.knex.transaction(async (trx) => {
      const inventory = (await trx<sql.ProductInventory>(TABLE.PRODUCT_INVENTORY)
        .where({ id: inventoryId })
        .andWhere('quantity', '>=', quantity)
        .decrement('quantity', quantity)
        .returning('*'))[0];
      if (!inventory) throw new Error('Not enough items in stock');
      const product = await trx<sql.Product>(TABLE.PRODUCT)
        .where({ id: inventory.product_id }).first();
      if (!product) throw new Error(`Product with id ${inventory.product_id} not found`);
      const cartItem = await trx<sql.CartItem>(TABLE.CART_ITEM)
        .where({ cart_id: cart.id, product_inventory_id: inventory.id })
        .first();
      const userInventoryQuantity = parseInt((await trx<sql.UserInventoryItem>('user_inventory_item').where({
        student_id: cart.student_id,
        product_inventory_id: inventory.id,
      }).count('product_inventory_id', { as: 'count' }).first())?.count.toString() || '0', 10);
      if (cartItem) {
        if (userInventoryQuantity + cartItem.quantity + quantity > product.max_per_user) throw new Error('You already have the maximum amount of this product.');
        await trx<sql.CartItem>(TABLE.CART_ITEM).where({ id: cartItem.id }).update({
          quantity: cartItem.quantity + quantity,
        });
      } else {
        if (userInventoryQuantity + quantity > product.max_per_user) throw new Error('You already have the maximum amount of this product.');
        await trx<sql.CartItem>(TABLE.CART_ITEM).insert({
          cart_id: cart.id,
          product_inventory_id: inventory.id,
          quantity,
        });
      }
      await trx<sql.Cart>(TABLE.CART).where({ id: cart.id }).update({
        total_price: cart.total_price + (product.price * quantity),
        total_quantity: cart.total_quantity + quantity,
      });
      logger.info(`Transaction ${transactionId}: ${cart.student_id} added ${quantity} ${product.name} to cart.`);
    });
  }

  addToMyCart(
    ctx: context.UserContext,
    inventoryId: UUID,
    quantity: number = 1,
  ): Promise<gql.Cart> {
    return this.withAccess('webshop:use', ctx, async () => {
      if (!ctx?.user?.student_id) throw new Error('You are not logged in');
      let myCart = await this
        .knex<sql.Cart>(TABLE.CART)
        .where({ student_id: ctx?.user?.student_id })
        .first();
      if (!myCart) {
        myCart = await this.createMyCart(ctx);
        try {
          await this.inventoryToCartTransaction(myCart, inventoryId, quantity);
        } catch (e: any) {
          await this.removeMyCart(ctx);
          throw e;
        }
      } else {
        await this.inventoryToCartTransaction(myCart, inventoryId, quantity);
      }
      const updatedCart = await this.knex<sql.Cart>(TABLE.CART).where({ id: myCart.id }).first();
      if (!updatedCart) throw new Error('Failed to update cart');
      return convertCart(updatedCart);
    });
  }

  removeFromMyCart(
    ctx: context.UserContext,
    inventoryId: UUID,
    quantity: number = 1,
  ): Promise<gql.Cart> {
    return this.withAccess('webshop:use', ctx, async () => {
      if (!ctx?.user?.student_id) throw new Error('You are not logged in');
      const myCart = await this.knex<sql.Cart>(TABLE.CART)
        .where({ student_id: ctx?.user?.student_id })
        .first();
      if (!myCart) throw new Error('Cart not found');
      return this.removeFromCart(myCart?.id, inventoryId, quantity);
    });
  }

  private async removeFromCart(
    cartId: UUID,
    inventoryId: UUID,
    quantity: number = 1,
  ): Promise<gql.Cart> {
    const cart = await this.knex<sql.Cart>(TABLE.CART)
      .where({ id: cartId })
      .first();
    if (!cart) throw new Error('Cart not found');
    await this.knex.transaction(async (trx) => {
      const cartItem = (await this.knex<sql.CartItem>(TABLE.CART_ITEM)
        .where({ cart_id: cart.id, product_inventory_id: inventoryId })
        .andWhere('quantity', '>=', quantity)
        .decrement('quantity', quantity)
        .returning('*'))[0];
      if (!cartItem) throw new Error('Item not in cart');
      if (cartItem.quantity === 0) {
        await trx<sql.CartItem>(TABLE.CART_ITEM).where({ id: cartItem.id }).del();
      }
      const inventory = await trx<sql.ProductInventory>(TABLE.PRODUCT_INVENTORY)
        .where({ id: inventoryId }).first();
      if (!inventory) throw new Error(`Inventory with id ${inventoryId} not found`);
      const product = await trx<sql.Product>(TABLE.PRODUCT)
        .where({ id: inventory.product_id }).first();
      if (!product) throw new Error(`Product with id ${inventory.product_id} not found`);
      await trx<sql.ProductInventory>(TABLE.PRODUCT_INVENTORY).where({ id: inventoryId }).update({
        quantity: inventory.quantity + quantity,
      });
      await trx<sql.Cart>(TABLE.CART).where({ id: cart.id }).update({
        total_price: cart.total_price - (quantity * product.price),
        total_quantity: cart.total_quantity - quantity,
      });
    });
    const updatedCart = await this.knex<sql.Cart>(TABLE.CART).where({ id: cart.id }).first();
    if (!updatedCart) throw new Error('Failed to update cart');
    return convertCart(updatedCart);
  }
}
