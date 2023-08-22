import { Knex } from 'knex';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { Agent } from 'https';
import axios from 'axios';
import { v4 as createId } from 'uuid';
import { ApolloError } from 'apollo-server';
import {
  dbUtils, context, UUID, createLogger,
} from '../shared';
import {
  convertCart, convertCartItem,
  convertDiscount, convertInventory,
  convertProduct, convertProductCategory, convertUserInventoryItem,
} from '../shared/converters/webshopConverters';
import { addMinutes } from '../shared/utils';
import * as gql from '../types/graphql';
import * as sql from '../types/webshop';
import { Member } from '../types/database';

let transactions = 0;

const generateTransactionId = () => {
  transactions += 1;
  return transactions;
};

const toSwishId = (id: UUID) => id.toUpperCase().replaceAll('-', '');

const CART_EXPIRATION_MINUTES = 30;
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

export const TABLE = {
  CART: 'cart',
  CART_ITEM: 'cart_item',
  PRODUCT: 'product',
  PRODUCT_CATEGORY: 'product_category',
  PRODUCT_INVENTORY: 'product_inventory',
  PRODUCT_DISCOUNT: 'product_discount',
  PRODUCT_QUESTIONS: 'product_questions',
  PAYMENT: 'payment',
  ORDER: 'order',
  ORDER_ITEM: 'order_item',
  USER_INVENTORY: 'user_inventory',
  USER_INVENTORY_ITEM: 'user_inventory_item',
};

const logger = createLogger('WebshopAPI');

const cert = readFileSync(resolve(__dirname, '../ssl/public.pem'), { encoding: 'utf-8' });
const key = readFileSync(resolve(__dirname, '../ssl/private.key'), { encoding: 'utf-8' });
const ca = readFileSync(resolve(__dirname, '../ssl/Swish_TLS_RootCA.pem'), { encoding: 'utf-8' });

const agent = new Agent({
  cert,
  key,
  ca,
});

const client = axios.create({ httpsAgent: agent });

let cartsChecked = false;

export default class WebshopAPI extends dbUtils.KnexDataSource {
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

  getProducts(ctx: context.UserContext, categoryId?: string): Promise<gql.Product[]> {
    return this.withAccess('webshop:read', ctx, async () => {
      let query = this.knex<sql.Product>(TABLE.PRODUCT);
      if (categoryId) {
        query = query.where({ category_id: categoryId }); // not tested
      }
      const products = await query;
      const inventories = await this.knex<sql.ProductInventory>(TABLE.PRODUCT_INVENTORY).orderBy('variant');
      const categories = await this.knex<sql.ProductCategory>(TABLE.PRODUCT_CATEGORY);
      const discounts = await this.knex<sql.ProductDiscount>(TABLE.PRODUCT_DISCOUNT);
      return products.map((product) => {
        const category = convertProductCategory(categories
          .find((c) => c.id === product.category_id));
        const inventory = inventories
          .filter((i) => i.product_id === product.id)
          .map((i) => {
            const discount = convertDiscount(discounts
              .find((d) => d.id === i.discount_id)); // not tested
            return convertInventory(i, discount);
          });
        return convertProduct({
          product, category, inventory,
        });
      });
    });
  }

  getProductCategories(ctx: context.UserContext): Promise<gql.ProductCategory[]> {
    return this.withAccess('webshop:read', ctx, async () => {
      const categories = await this.knex<sql.ProductCategory>(TABLE.PRODUCT_CATEGORY);
      return categories.map((p) => convertProductCategory(p)!);
    });
  }

  getProductById(ctx: context.UserContext, id: UUID): Promise<gql.Maybe<gql.Product>> {
    return this.withAccess('webshop:read', ctx, async () => {
      const product = await this.knex<sql.Product>(TABLE.PRODUCT).where({ id }).first();
      if (!product) return undefined;
      const category = convertProductCategory(await this
        .knex<sql.ProductCategory>(TABLE.PRODUCT_CATEGORY)
        .where({ id: product.category_id }).first());
      const productInventories = await this
        .knex<sql.ProductInventory>(TABLE.PRODUCT_INVENTORY)
        .where({ product_id: product.id })
        .orderBy('variant');
      const discounts = await this
        .knex<sql.ProductDiscount>(TABLE.PRODUCT_DISCOUNT)
        .whereIn('id', productInventories
          .filter((i) => i.discount_id).map((i) => i.discount_id!));
      const inventory = productInventories.map((i) => {
        const discount = convertDiscount(discounts.find((d) => d.id === i.discount_id));
        return convertInventory(i, discount);
      });
      return convertProduct({ product, category, inventory });
    });
  }

  createProduct(ctx: context.UserContext, productInput: gql.ProductInput):
  Promise<gql.Product> {
    return this.withAccess('webshop:create', ctx, async () => {
      const newProduct = (await this.knex<sql.Product>(TABLE.PRODUCT)
        .insert({
          name: productInput.name,
          description: productInput.description,
          image_url: productInput.imageUrl,
          price: productInput.price,
          category_id: productInput.categoryId,
          max_per_user: productInput.maxPerUser,
        }).returning('*'))[0];
      if (!productInput.variants.length) {
        await this.knex<sql.ProductInventory>(TABLE.PRODUCT_INVENTORY).insert({
          quantity: productInput.quantity,
          product_id: newProduct.id,
        });
      } else {
        const inventoryQueries = productInput.variants
          .map((variant) => this.knex<sql.ProductInventory>(TABLE.PRODUCT_INVENTORY).insert({
            quantity: productInput.quantity,
            product_id: newProduct.id,
            variant,
          }));
        await Promise.all(inventoryQueries);
      }
      const product = await this.getProductById(ctx, newProduct.id);
      return product!;
    });
  }

  private async createMyCart(ctx: context.UserContext): Promise<sql.Cart> {
    if (!ctx?.user?.student_id) throw new Error('You are not logged in');
    const cart = (await this.knex<sql.Cart>(TABLE.CART).insert({
      student_id: ctx?.user?.student_id,
      expires_at: addMinutes(new Date(), CART_EXPIRATION_MINUTES),
      total_price: 0,
      total_quantity: 0,
    }).returning('*'))[0];
    if (!cart) throw new Error('Failed to create cart');
    setTimeout(() => {
      this.removeCartIfExpired(cart); // how does one even test this???
    }, CART_EXPIRATION_MINUTES * 60 * 1000);
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
      const discounts = await this.knex<sql.ProductDiscount>(TABLE.PRODUCT_DISCOUNT)
        .whereIn('id', inventories.filter((i) => i.discount_id).map((i) => i.discount_id!));
      const result = sqlProducts.map((product) => {
        const category = convertProductCategory(categories
          .find((c) => c.id === product.category_id));
        const inventory: gql.CartInventory[] = inventories
          .filter((i) => i.product_id === product.id)
          .map((inv) => {
            const cartItem = cartItems.find((ci) => ci.product_inventory_id === inv.id);
            if (!cartItem) throw new Error('Failed to find cart item');
            const discount = convertDiscount(discounts
              .find((d) => d.id === inv.discount_id)); // not tested
            return {
              id: cartItem.id,
              inventoryId: inv.id,
              quantity: cartItem.quantity,
              discount: discount || undefined,
              variant: inv.variant,
            };
          });
        return convertCartItem({
          product, category, inventory,
        });
      });
      const priceSum = result.reduce((acc, cur) => acc + cur.price, 0);
      if (priceSum > 0) {
        return [...result, TRANSACTION_ITEM];
      }
      return result;
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
      // If there is no transaction cost yet, and the new price is not 0, add the transaction cost
      const diffTransactionCost = (cart.total_price === 0 && product.price > 0)
        ? TRANSACTION_COST : 0;

      await trx<sql.Cart>(TABLE.CART).where({ id: cart.id }).update({
        total_price: cart.total_price + (product.price * quantity) + diffTransactionCost,
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
      const newPrice = cart.total_price - (quantity * product.price);
      const diffTransactionCost = (product.price > 0 && newPrice === TRANSACTION_COST)
        ? -TRANSACTION_COST : 0;
      await trx<sql.Cart>(TABLE.CART).where({ id: cart.id }).update({
        total_price: newPrice + diffTransactionCost,
        total_quantity: cart.total_quantity - quantity,
      });
    });
    const updatedCart = await this.knex<sql.Cart>(TABLE.CART).where({ id: cart.id }).first();
    if (!updatedCart) throw new Error('Failed to update cart');
    return convertCart(updatedCart);
  }

  initiatePayment(
    ctx: context.UserContext,
    phoneNumber?: string,
  ): Promise<gql.Payment> {
    return this.withAccess('webshop:use', ctx, async () => {
      if (!ctx?.user?.student_id) throw new Error('You are not logged in');
      const myCart = await this.knex<sql.Cart>(TABLE.CART)
        .where({ student_id: ctx?.user?.student_id })
        .first();
      if (!myCart) throw new Error('Cart not found');
      if (myCart.total_quantity === 0) throw new Error('Cart is empty');
      if (myCart.expires_at < new Date()) throw new Error('Cart has expired');
      const isFree = myCart.total_price === 0;

      if (!isFree && !phoneNumber) throw new Error('Phone number is required for non-free orders');

      const swishId = toSwishId(createId());
      const payment = (await this.knex<sql.Payment>(TABLE.PAYMENT).insert({
        swish_id: swishId,
        payment_method: isFree ? 'Free' : 'Swish',
        payment_status: isFree ? gql.PaymentStatus.Paid : gql.PaymentStatus.Pending,
        payment_amount: myCart.total_price,
        payment_currency: 'SEK',
        student_id: myCart.student_id,
      }).returning('*'))[0];
      if (!payment) throw new Error('Failed to create payment');

      const order = (await this.knex<sql.Order>(TABLE.ORDER).insert({
        payment_id: payment.id,
        total_price: myCart.total_price,
        student_id: myCart.student_id,
      }).returning('*'))[0];
      if (!order) throw new Error('Failed to create order');

      const cartItems = await this.knex<sql.CartItem>(TABLE.CART_ITEM)
        .where({ cart_id: myCart.id });
      const productInventories = await this.knex<sql.ProductInventory>(TABLE.PRODUCT_INVENTORY)
        .whereIn('id', cartItems.map((item) => item.product_inventory_id));
      const products = await this.knex<sql.Product>(TABLE.PRODUCT)
        .whereIn('id', productInventories.map((inventory) => inventory.product_id));
      const orderItemsPromise: Promise<any>[] = [];
      for (let i = 0; i < cartItems.length; i += 1) {
        const cartItem = cartItems[i];
        const productInventory = productInventories
          .find((inv) => inv.id === cartItem.product_inventory_id);
        const product = products.find((p) => p.id === productInventory?.product_id);
        if (!productInventory || !product) throw new Error('Failed to create order');
        orderItemsPromise.push(this.knex<sql.OrderItem>(TABLE.ORDER_ITEM).insert({
          order_id: order.id,
          price: product.price,
          product_inventory_id: cartItem.product_inventory_id,
          quantity: cartItem.quantity,
        }));
      }
      await Promise.all(orderItemsPromise);
      if (isFree) {
        await this.addPaymentOrderToUserInventory(payment);
        return {
          id: payment.id,
          createdAt: payment.created_at,
          updatedAt: payment.updated_at,
          paymentStatus: payment.payment_status,
          paymentMethod: payment.payment_method,
          amount: myCart.total_price,
          currency: 'SEK',
        };
      }

      if (process.env.NODE_ENV !== 'production') {
        logger.info(`Simulating payment for ${swishId}`);
        return {
          id: payment.id,
          createdAt: payment.created_at,
          updatedAt: payment.updated_at,
          paymentStatus: payment.payment_status,
          paymentMethod: payment.payment_method,
          amount: myCart.total_price,
          currency: 'SEK',
        };
      }

      if (!process.env.SWISH_CALLBACK_URL) throw new Error('No callback url set');
      const data: sql.SwishData = {
        payeePaymentReference: toSwishId(order.id),
        callbackUrl: process.env.SWISH_CALLBACK_URL,
        // Vårat swishnummer
        payeeAlias: '1231181189',
        currency: 'SEK',
        payerAlias: phoneNumber!,
        amount: myCart.total_price.toString(),
        message: 'Test',
      };

      const url = `${process.env.SWISH_URL}/api/v2/paymentrequests/${swishId}`;
      logger.info(`Initiated payment with id: ${swishId}`);
      try {
        const response = await client.put(
          url,
          data,
        );
        if (response.status === 201) {
          return {
            id: payment.id,
            createdAt: payment.created_at,
            updatedAt: payment.updated_at,
            paymentStatus: payment.payment_status,
            paymentMethod: payment.payment_method,
            amount: myCart.total_price,
            currency: 'SEK',
          };
        }
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.error(error.toString(), error.response?.data);
        logger.error('Failed to initiate payment, removing order and setting payment to ERROR...');
        await this.knex<sql.Order>(TABLE.ORDER).where({ id: order.id }).del();
        await this.knex<sql.Payment>(TABLE.PAYMENT).where({ id: payment.id }).update({
          payment_status: 'ERROR',
          updated_at: new Date(),
        });
        throw new Error(error);
      }
      throw new Error('Failed to initiate payment');
    });
  }

  private async addPaymentOrderToUserInventory(payment: sql.Payment): Promise<sql.UserInventory> {
    let userInventory = await this.knex<sql.UserInventory>(TABLE.USER_INVENTORY)
      .where({ student_id: payment.student_id })
      .first();
    if (!userInventory) {
      [userInventory] = (await this.knex<sql.UserInventory>(TABLE.USER_INVENTORY).insert({
        student_id: payment.student_id,
      }).returning('*'));
    }

    await this.knex.transaction(async (trx) => {
      if (!userInventory) throw new Error('Failed to create or find user inventory');
      const order = await trx<sql.Order>(TABLE.ORDER)
        .where({ payment_id: payment.id })
        .first();
      if (!order) throw new Error('Order not found');

      const orderItems = await trx<sql.OrderItem>(TABLE.ORDER_ITEM)
        .where({ order_id: order.id });
      const productInventories = await trx<sql.ProductInventory>(TABLE.PRODUCT_INVENTORY)
        .whereIn('id', orderItems.map((item) => item.product_inventory_id));
      const products = await trx<sql.Product>(TABLE.PRODUCT)
        .whereIn('id', productInventories.map((item) => item.product_id));

      const inventoryPromise: Promise<any>[] = [];
      for (let i = 0; i < orderItems.length; i += 1) {
        const orderItem = orderItems[i];
        const productInventory = productInventories
          .find((item) => item.id === orderItem.product_inventory_id);
        const product = products
          .find((item) => item.id === productInventory?.product_id);
        if (!productInventory || !product) throw new Error('Product not found');
        for (let j = 0; j < orderItem.quantity; j += 1) {
          inventoryPromise.push(trx<sql.UserInventoryItem>(TABLE.USER_INVENTORY_ITEM).insert({
            name: product.name,
            description: product.description,
            image_url: product.image_url,
            paid_price: orderItem.price,
            student_id: payment.student_id,
            variant: productInventory.variant,
            user_inventory_id: userInventory.id,
            product_inventory_id: orderItem.product_inventory_id,
            category_id: product.category_id,
          }));
        }
      }
      await Promise.all(inventoryPromise);
      // delete user cart and all cart items
      const myCart = await trx<sql.Cart>(TABLE.CART)
        .where({ student_id: payment.student_id })
        .first();
      if (myCart) {
        await trx<sql.CartItem>(TABLE.CART_ITEM)
          .where({ cart_id: myCart.id })
          .del();
        await trx<sql.Cart>(TABLE.CART)
          .where({ id: myCart.id })
          .del();
      }
    });
    return userInventory;
  }

  async updatePaymentStatus(
    swishId: UUID,
    paymentStatus: sql.Payment['payment_status'],
  ): Promise<gql.Payment> {
    const payment = await this.knex<sql.Payment>(TABLE.PAYMENT)
      .where({ swish_id: swishId })
      .first();
    if (!payment) throw new Error('Payment not found');

    if (paymentStatus === 'PAID') {
      await this.addPaymentOrderToUserInventory(payment);
    }
    const updatedPayment = (await this.knex<sql.Payment>(TABLE.PAYMENT)
      .where({ id: payment.id })
      .update({
        payment_status: paymentStatus,
        updated_at: new Date(),
      }).returning('*'))[0];
    return {
      id: updatedPayment.id,
      createdAt: updatedPayment.created_at,
      updatedAt: updatedPayment.updated_at,
      paymentStatus: updatedPayment.payment_status,
      paymentMethod: updatedPayment.payment_method,
      amount: updatedPayment.payment_amount,
      currency: updatedPayment.payment_currency,
    };
  }

  async getPayment(
    ctx: context.UserContext,
    id: UUID,
  ): Promise<gql.Maybe<gql.Payment>> {
    return this.withAccess('webshop:use', ctx, async () => {
      if (!ctx?.user?.student_id) throw new Error('You are not logged in');
      const payment = await this.knex<sql.Payment>(TABLE.PAYMENT)
        .where({ id })
        .first();
      if (!payment) return undefined;
      return {
        id: payment.id,
        createdAt: payment.created_at,
        updatedAt: payment.updated_at,
        paymentStatus: payment.payment_status,
        paymentMethod: payment.payment_method,
        amount: payment.payment_amount,
        currency: payment.payment_currency,
      };
    });
  }

  async getUserInventory(ctx: context.UserContext, studentId: string):
  Promise<gql.Maybe<gql.UserInventory>> {
    const member = await this.knex<Member>('members')
      .where({ student_id: studentId })
      .first();
    return this.withAccess('webshop:inventory:read', ctx, async () => {
      const userInventory = await this.knex<sql.UserInventory>(TABLE.USER_INVENTORY)
        .where({ student_id: studentId })
        .first();
      if (!userInventory) return undefined;
      const result: gql.UserInventory = {
        id: userInventory.id,
        items: await this.getUserInventoryItems(ctx, userInventory.id),
      };
      return result;
    }, member?.id);
  }

  consumeItem(ctx: context.UserContext, id: UUID): Promise<gql.UserInventory> {
    return this.withAccess('webshop:use', ctx, async () => {
      if (!ctx.user?.student_id) throw new Error('You are not logged in.');
      const item = await this.knex<sql.UserInventoryItem>(TABLE.USER_INVENTORY_ITEM)
        .where({ id })
        .first();
      if (!item) throw new Error('Cannot find item.');
      if (item.student_id !== ctx.user.student_id) throw new Error('Item does not belong to you.');
      if (item.consumed_at) throw new Error('Item already consumed.');
      await this.knex<sql.UserInventoryItem>(TABLE.USER_INVENTORY_ITEM)
        .where({ id })
        .update({
          consumed_at: new Date(),
        });
      const inventory = await this.getUserInventory(ctx, ctx.user.student_id);
      if (!inventory) throw new Error('Inventory not found');
      return inventory;
    });
  }

  async getUserInventoryItems(
    ctx: context.UserContext,
    userInventoryId: UUID,
  ): Promise<gql.UserInventoryItem[]> {
    const items = await this.knex<sql.UserInventoryItem>(TABLE.USER_INVENTORY_ITEM)
      .where({ user_inventory_id: userInventoryId })
      .orderBy('paid_at', 'desc')
      .orderBy('name', 'desc')
      .orderBy('id', 'desc');
    // filter items that are not consumed or consumed within the last 24 hours
    const filteredItems = items.filter((item) => {
      if (!item.consumed_at) return true;
      const consumedAt = new Date(item.consumed_at);
      const now = new Date();
      const diff = now.getTime() - consumedAt.getTime();
      const diffHours = diff / (1000 * 60 * 60);
      return diffHours < 24;
    });
    return filteredItems.map(convertUserInventoryItem);
  }

  async getQuestionsByProduct(
    ctx: context.UserContext,
    productId: UUID,
  ): Promise<gql.Maybe<gql.ProductQuestions>> {
    return this.withAccess('webshop:read', ctx, async () => {
      const questions = await this.knex<sql.ProductQuestions>(TABLE.PRODUCT_QUESTIONS).where({ product_id : productId }).first();
      if(!questions) return undefined;
      return {
        id: questions.id,
        productId: questions.product_id,
        freetext: questions.freetext,
        alternatives: questions.alternatives
      }
    })
  }


  // getProductById(ctx: context.UserContext, id: UUID): Promise<gql.Maybe<gql.Product>> {
  //   return this.withAccess('webshop:read', ctx, async () => {
  //     const product = await this.knex<sql.Product>(TABLE.PRODUCT).where({ id }).first();
  //     if (!product) return undefined;
  //     const category = convertProductCategory(await this
  //       .knex<sql.ProductCategory>(TABLE.PRODUCT_CATEGORY)
  //       .where({ id: product.category_id }).first());
  //     const productInventories = await this
  //       .knex<sql.ProductInventory>(TABLE.PRODUCT_INVENTORY)
  //       .where({ product_id: product.id })
  //       .orderBy('variant');
  //     const discounts = await this
  //       .knex<sql.ProductDiscount>(TABLE.PRODUCT_DISCOUNT)
  //       .whereIn('id', productInventories
  //         .filter((i) => i.discount_id).map((i) => i.discount_id!));
  //     const inventory = productInventories.map((i) => {
  //       const discount = convertDiscount(discounts.find((d) => d.id === i.discount_id));
  //       return convertInventory(i, discount);
  //     });
  //     return convertProduct({ product, category, inventory });
  //   });
  // }
}
