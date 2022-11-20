import { dbUtils, context, UUID } from '../shared';
import {
  convertCart, convertDiscount, convertProduct, convertProductCategory,
} from '../shared/converters/webshopConverters';
import { addMinutes } from '../shared/utils';
import * as gql from '../types/graphql';
import * as sql from '../types/webshop';

const CART_EXPIRATION_MINUTES = 30;

export default class WebshopAPI extends dbUtils.KnexDataSource {
  getProducts(ctx: context.UserContext): Promise<gql.Product[]> {
    return this.withAccess('webshop:read', ctx, async () => {
      const products = await this.knex<sql.Product>('products');
      const categories = await this.knex<sql.ProductCategory>('product_categories');
      const discounts = await this.knex<sql.ProductDiscount>('discounts');

      return products.map((product) => {
        const category = convertProductCategory(categories
          .find((c) => c.id === product.category_id));
        const discount = convertDiscount(discounts
          .find((d) => d.id === product.discount_id));
        return convertProduct({ product, category, discount });
      });
    });
  }

  getProductById(ctx: context.UserContext, id: UUID): Promise<gql.Maybe<gql.Product>> {
    return this.withAccess('webshop:read', ctx, async () => {
      const product = await this.knex<sql.Product>('products').where({ id }).first();
      if (!product) return undefined;
      const category = convertProductCategory(await this.knex<sql.ProductCategory>('product_categories')
        .where({ id: product.category_id }).first());
      const discount = convertDiscount(await this.knex<sql.ProductDiscount>('discounts')
        .where({ id: product.discount_id }).first());
      return convertProduct({ product, category, discount });
    });
  }

  private async createMyCart(ctx: context.UserContext): Promise<sql.Cart> {
    if (!ctx?.user?.student_id) throw new Error('User is not a student');
    const cart = await this.knex<sql.Cart>('carts').insert({
      student_id: ctx?.user?.student_id,
      expires_at: addMinutes(new Date(), CART_EXPIRATION_MINUTES),
    }).returning('*').first();
    if (!cart) throw new Error('Failed to create cart');
    return cart;
  }

  getMyCart(ctx: context.UserContext): Promise<gql.Cart> {
    return this.withAccess('webshop:read', ctx, async () => {
      if (!ctx?.user?.student_id) throw new Error('User is not a student');
      const cart = await this.knex<sql.Cart>('carts').where({
        student_id: ctx?.user?.student_id,
      }).first();
      if (!cart) return convertCart(await this.createMyCart(ctx));
      return convertCart(cart);
    });
  }

  getCartItems(ctx: context.UserContext, cartId: UUID): Promise<gql.Product[]> {
    return this.withAccess('webshop:read', ctx, async () => {
      const cartItems = await this.knex<sql.CartItem>('cart_item').where({ cart_id: cartId });
      const products = await this.knex<sql.Product>('products').whereIn('id', cartItems.map((ci) => ci.product_id));
      const categories = await this.knex<sql.ProductCategory>('product_categories');
      const discounts = await this.knex<sql.ProductDiscount>('discounts');

      return cartItems.map((cartItem) => {
        const product = products.find((p) => p.id === cartItem.product_id);
        if (!product) throw new Error(`Product with id ${cartItem.product_id} not found`);
        const category = convertProductCategory(categories
          .find((c) => c.id === product.category_id));
        const discount = convertDiscount(discounts
          .find((d) => d.id === product.discount_id));
        return convertProduct({ product, category, discount });
      });
    });
  }

  private async inventoryToCartTransaction(
    cart: sql.Cart,
    product: sql.Product,
    quantity: number = 1,
  ) {
    return this.knex.transaction(async (trx) => {
      const inventory = await trx<sql.ProductInventory>('product_inventory').where({ id: product.inventory_id }).first();
      if (!inventory) throw new Error(`Inventory for product ${product.id} not found`);
      if (inventory.quantity < quantity) throw new Error('Not enough inventory');
      const cartItem = await trx<sql.CartItem>('cart_item').where({ cart_id: cart.id, product_id: product.id }).first();
      const userInventoryItem = await trx<sql.UserInventoryItem>('user_inventory_item').where({ student_id: cart.student_id, product_id: product.id }).first();
      if (cartItem) {
        if (userInventoryItem && userInventoryItem.quantity + cartItem.quantity + quantity > inventory.max_per_user) throw new Error('You already have the maximum amount of this product.');
        await trx<sql.CartItem>('cart_item').where({ id: cartItem.id }).update({
          quantity: cartItem.quantity + quantity,
        });
      } else {
        if (userInventoryItem && userInventoryItem.quantity + quantity > inventory.max_per_user) throw new Error('You already have the maximum amount of this product.');
        await trx<sql.CartItem>('cart_item').insert({
          cart_id: cart.id,
          product_id: product.id,
          quantity,
        });
      }
      await trx<sql.ProductInventory>('product_inventory').where({ id: inventory.id }).update({
        quantity: inventory.quantity - 1,
      });
      await trx<sql.Cart>('carts').where({ id: cart.id }).update({
        total_price: cart.total_price + product.price,
      });
    });
  }

  addToMyCart(ctx: context.UserContext, productId: UUID, quantity: number = 1): Promise<gql.Cart> {
    return this.withAccess('webshop:use', ctx, async () => {
      const product = await this.knex<sql.Product>('product').where({ id: productId }).first();
      if (!product) throw new Error(`Product with id ${productId} not found`);
      let myCart = await this.knex<sql.Cart>('cart').where({ student_id: ctx?.user?.student_id }).first();
      if (!myCart) {
        myCart = await this.createMyCart(ctx);
      }
      await this.inventoryToCartTransaction(myCart, product, quantity);
      const updatedCart = await this.knex<sql.Cart>('cart').where({ id: myCart.id }).first();
      if (!updatedCart) throw new Error('Failed to update cart');
      return convertCart(updatedCart);
    });
  }

  removeFromMyCart(
    ctx: context.UserContext,
    productId: UUID,
    quantity: number = 1,
  ): Promise<gql.Cart> {
    return this.withAccess('webshop:use', ctx, async () => {
      const product = await this.knex<sql.Product>('product').where({ id: productId }).first();
      if (!product) throw new Error(`Product with id ${productId} not found`);
      const myCart = await this.knex<sql.Cart>('cart').where({ student_id: ctx?.user?.student_id }).first();
      if (!myCart) throw new Error('Cart not found');
      const cartItem = await this.knex<sql.CartItem>('cart_item').where({ cart_id: myCart.id, product_id: productId }).first();
      if (!cartItem) throw new Error('Product not found in cart');
      if (cartItem.quantity < quantity) throw new Error('Not enough products in cart');
      await this.knex.transaction(async (trx) => {
        const inventory = await trx<sql.ProductInventory>('product_inventory').where({ id: product.inventory_id }).first();
        if (!inventory) throw new Error(`Inventory for product ${product.id} not found`);
        await trx<sql.CartItem>('cart_item').where({ id: cartItem.id }).update({
          quantity: cartItem.quantity - quantity,
        });
        await trx<sql.ProductInventory>('product_inventory').where({ id: inventory.id }).update({
          quantity: inventory.quantity + quantity,
        });
        await trx<sql.Cart>('cart').where({ id: myCart.id }).update({
          total_price: myCart.total_price - (product.price * quantity),
        });
      });
      const updatedCart = await this.knex<sql.Cart>('cart').where({ id: myCart.id }).first();
      if (!updatedCart) throw new Error('Failed to update cart');
      return convertCart(updatedCart);
    });
  }
}
