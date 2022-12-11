import { readFileSync } from 'fs';
import { resolve } from 'path';
import { Agent } from 'https';
import axios from 'axios';
import { v4 as createId } from 'uuid';
import {
  dbUtils, context, UUID, createLogger,
} from '../shared';
import * as gql from '../types/graphql';
import * as sql from '../types/webshop';
import { TABLE } from '../types/webshop';

const toSwishId = (id: UUID) => id.toUpperCase().replaceAll('-', '');

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

export default class PaymentAPI extends dbUtils.KnexDataSource {
  initiatePayment(
    ctx: context.UserContext,
    phoneNumber: string,
  ): Promise<gql.Payment> {
    return this.withAccess('webshop:use', ctx, async () => {
      if (!ctx?.user?.student_id) throw new Error('You are not logged in');
      const myCart = await this.knex<sql.Cart>(TABLE.CART)
        .where({ student_id: ctx?.user?.student_id })
        .first();
      if (!myCart) throw new Error('Cart not found');
      if (myCart.total_quantity === 0) throw new Error('Cart is empty');
      if (myCart.expires_at < new Date()) throw new Error('Cart has expired');
      const existingPayment = await this.knex<sql.Payment>(TABLE.PAYMENT)
        .where({ student_id: ctx?.user?.student_id })
        .andWhere({ payment_status: 'PENDING' })
        .first();
      if (existingPayment) {
        await this.knex<sql.Payment>(TABLE.PAYMENT).where({ id: existingPayment.id }).update({
          payment_status: 'CANCELLED',
        });
      }
      const swishId = toSwishId(createId());
      const payment = (await this.knex<sql.Payment>(TABLE.PAYMENT).insert({
        swish_id: swishId,
        payment_method: 'Swish',
        payment_status: 'PENDING',
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
        payerAlias: phoneNumber,
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
}
