import 'mocha';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import {
  ApolloServerTestClient,
  createTestClient,
} from 'apollo-server-testing';

import { DataSources } from '~/src/datasources';
import constructTestServer from '../util';
import { knex } from '~/src/shared';
import * as gql from '~/src/types/graphql';
import * as sql from '~/src/types/webshop';
import { TABLE } from '~/src/datasources/WebshopAPI';
import { categories, inventories, products } from '../cart/cartData';
import {
  cart, cartItems, ctx, freeCart, freeItems, phoneNumber,
} from './paymentData';
import {
  ConsumeItemMutation,
  FreeCheckoutMutation,
  GetPaymentQuery, InitiatePaymentQuery, MyChestQuery, UpdatePaymentStatusMutation,
} from './paymentGraphql';

chai.use(spies);

const sandbox = chai.spy.sandbox();

describe('Payment Graphql Queries', () => {
  let dataSources: DataSources;
  let dataSourcesLoggedOut: DataSources;
  let client: ApolloServerTestClient;
  let clientLoggedOut: ApolloServerTestClient;

  before(() => {
    const { server: serverAuthorized, dataSources: d1 } = constructTestServer(ctx);
    dataSources = d1;
    const { server: serverLoggedOut, dataSources: d2 } = constructTestServer();
    dataSourcesLoggedOut = d2;
    client = createTestClient(serverAuthorized);
    clientLoggedOut = createTestClient(serverLoggedOut);
    sandbox.on(dataSources.webshopAPI, 'withAccess', (_, __, fn) => fn());
    sandbox.on(dataSourcesLoggedOut.webshopAPI, 'withAccess', (_, __, fn) => fn());
  });

  beforeEach(async () => {
    await knex<sql.ProductCategory>(TABLE.PRODUCT_CATEGORY).insert(categories);
    await knex<sql.Product>(TABLE.PRODUCT).insert(products);
    await knex<sql.ProductInventory>(TABLE.PRODUCT_INVENTORY).insert(inventories);
    await knex<sql.Cart>(TABLE.CART).insert(cart);
    await knex<sql.CartItem>(TABLE.CART_ITEM).insert(cartItems);
  });

  afterEach(async () => {
    chai.spy.restore(dataSources.webshopAPI);
    await knex<sql.UserInventoryItem>(TABLE.USER_INVENTORY_ITEM).del();
    await knex<sql.UserInventory>(TABLE.USER_INVENTORY).del();
    await knex<sql.Cart>(TABLE.CART).del();
    await knex<sql.CartItem>(TABLE.CART_ITEM).del();
    await knex(TABLE.PRODUCT_INVENTORY).del();
    await knex(TABLE.PRODUCT).del();
    await knex(TABLE.PRODUCT_CATEGORY).del();
    await knex(TABLE.PAYMENT).del();
    await knex(TABLE.ORDER).del();
    await knex(TABLE.ORDER_ITEM).del();
  });

  after(async () => {
    sandbox.restore();
  });

  describe(('InitiatePayment'), () => {
    it('initiates a payment successfully', async () => {
      chai.spy.on(dataSources.webshopAPI, 'initiatePayment');
      const { data, errors } = await client.mutate({
        mutation: InitiatePaymentQuery,
        variables: {
          phoneNumber,
        },
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(dataSources.webshopAPI.initiatePayment).to.have.been.called
        .with(ctx, phoneNumber);
      const expected: gql.Payment = {
        id: data.webshop.initiatePayment.id,
        amount: cart.total_price,
        currency: 'SEK',
        createdAt: data.webshop.initiatePayment.createdAt,
        updatedAt: data.webshop.initiatePayment.updatedAt,
        paymentMethod: 'Swish',
        paymentStatus: gql.PaymentStatus.Pending,
      };
      expect(data.webshop.initiatePayment, JSON.stringify(data)).to.deep.equal(expected);
    });
    it('initiates a free payment', async () => {
      await knex<sql.Cart>(TABLE.CART).del();
      await knex<sql.CartItem>(TABLE.CART_ITEM).del();
      await knex<sql.Cart>(TABLE.CART).insert(freeCart);
      await knex<sql.CartItem>(TABLE.CART_ITEM).insert(freeItems);
      chai.spy.on(dataSources.webshopAPI, 'initiatePayment');
      const { data, errors } = await client.mutate({
        mutation: FreeCheckoutMutation,
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(dataSources.webshopAPI.initiatePayment).to.have.been.called
        .with(ctx);
      const expected: gql.Payment = {
        id: data.webshop.freeCheckout.id,
        amount: 0,
        currency: 'SEK',
        createdAt: data.webshop.freeCheckout.createdAt,
        updatedAt: data.webshop.freeCheckout.updatedAt,
        paymentMethod: 'Free',
        paymentStatus: gql.PaymentStatus.Paid,
      };
      expect(data.webshop.freeCheckout, JSON.stringify(data)).to.deep.equal(expected);

      chai.spy.on(dataSources.webshopAPI, 'getUserInventory');
      const { data: userChest, errors: chestErrors } = await client.query({
        query: MyChestQuery,
        variables: {
          studentId: ctx.user?.student_id,
        },
      });
      expect(chestErrors, `${JSON.stringify(chestErrors)}`).to.be.undefined;
      expect(userChest.chest.items.length).to.equal(1);
    });
  });

  describe(('GetPayment'), () => {
    it('initiates a payment and gets it', async () => {
      /** Initiate payment */
      const { data: initiateData, errors: initiateErrors } = await client.mutate({
        mutation: InitiatePaymentQuery,
        variables: {
          phoneNumber,
        },
      });
      expect(initiateErrors, `${JSON.stringify(initiateErrors)}`).to.be.undefined;

      /** Get payment */
      chai.spy.on(dataSources.webshopAPI, 'getPayment');
      const { data, errors } = await client.query({
        query: GetPaymentQuery,
        variables: {
          id: initiateData.webshop.initiatePayment.id,
        },
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(dataSources.webshopAPI.getPayment).to.have.been.called
        .with(ctx, initiateData.webshop.initiatePayment.id);
      const expected: gql.Payment = {
        id: initiateData.webshop.initiatePayment.id,
        amount: cart.total_price,
        currency: 'SEK',
        createdAt: initiateData.webshop.initiatePayment.createdAt,
        updatedAt: data.payment.updatedAt,
        paymentMethod: 'Swish',
        paymentStatus: gql.PaymentStatus.Pending,
      };
      expect(data.payment, JSON.stringify(data)).to.deep.equal(expected);
    });
  });

  describe(('UpdatePaymentStatus'), () => {
    it('sets payment status to paid', async () => {
      const { data: paymentData, errors: initiateErrors } = await client.mutate({
        mutation: InitiatePaymentQuery,
        variables: {
          phoneNumber,
        },
      });
      expect(initiateErrors, `${JSON.stringify(initiateErrors)}`).to.be.undefined;
      const payment = await knex<sql.Payment>(TABLE.PAYMENT)
        .where({ id: paymentData.webshop.initiatePayment.id }).first();
      chai.spy.on(dataSourcesLoggedOut.webshopAPI, 'updatePaymentStatus');
      const { data, errors } = await clientLoggedOut.mutate({
        mutation: UpdatePaymentStatusMutation,
        variables: {
          paymentId: payment?.swish_id,
          status: gql.PaymentStatus.Paid,
        },
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(dataSourcesLoggedOut.webshopAPI.updatePaymentStatus).to.have.been.called
        .with(payment?.swish_id, gql.PaymentStatus.Paid);
      const expected: gql.Payment = {
        id: paymentData.webshop.initiatePayment.id,
        amount: cart.total_price,
        currency: 'SEK',
        createdAt: paymentData.webshop.initiatePayment.createdAt,
        updatedAt: data.webshop.updatePaymentStatus.updatedAt,
        paymentMethod: 'Swish',
        paymentStatus: gql.PaymentStatus.Paid,
      };
      expect(data.webshop.updatePaymentStatus, JSON.stringify(data)).to.deep.equal(expected);
    });

    it('sets payment status to cancelled', async () => {
      const { data: paymentData, errors: initiateErrors } = await client.mutate({
        mutation: InitiatePaymentQuery,
        variables: {
          phoneNumber,
        },
      });
      expect(initiateErrors, `${JSON.stringify(initiateErrors)}`).to.be.undefined;
      const payment = await knex<sql.Payment>(TABLE.PAYMENT)
        .where({ id: paymentData.webshop.initiatePayment.id }).first();
      chai.spy.on(dataSourcesLoggedOut.webshopAPI, 'updatePaymentStatus');
      const { data, errors } = await clientLoggedOut.mutate({
        mutation: UpdatePaymentStatusMutation,
        variables: {
          paymentId: payment?.swish_id,
          status: gql.PaymentStatus.Cancelled,
        },
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(dataSourcesLoggedOut.webshopAPI.updatePaymentStatus).to.have.been.called
        .with(payment?.swish_id, gql.PaymentStatus.Cancelled);
      const expected: gql.Payment = {
        id: paymentData.webshop.initiatePayment.id,
        amount: cart.total_price,
        currency: 'SEK',
        createdAt: paymentData.webshop.initiatePayment.createdAt,
        updatedAt: data.webshop.updatePaymentStatus.updatedAt,
        paymentMethod: 'Swish',
        paymentStatus: gql.PaymentStatus.Cancelled,
      };
      expect(data.webshop.updatePaymentStatus, JSON.stringify(data)).to.deep.equal(expected);
    });
  });

  describe(('MyChest'), () => {
    it('gets a users chest after paying for something', async () => {
      /** Initiate a payment */
      const { data: paymentData, errors: initiateErrors } = await client.mutate({
        mutation: InitiatePaymentQuery,
        variables: {
          phoneNumber,
        },
      });
      expect(initiateErrors, `${JSON.stringify(initiateErrors)}`).to.be.undefined;
      const payment = await knex<sql.Payment>(TABLE.PAYMENT)
        .where({ id: paymentData.webshop.initiatePayment.id }).first();

      /** Update payment status to paid, which should put the items in users inventory */
      const { errors: payErrors } = await clientLoggedOut.mutate({
        mutation: UpdatePaymentStatusMutation,
        variables: {
          paymentId: payment?.swish_id,
          status: gql.PaymentStatus.Paid,
        },
      });
      expect(payErrors, `${JSON.stringify(payErrors)}`).to.be.undefined;

      /** Get the users chest */
      chai.spy.on(dataSources.webshopAPI, 'getUserInventory');
      const { data, errors } = await client.query({
        query: MyChestQuery,
        variables: {
          studentId: ctx.user?.student_id,
        },
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(dataSources.webshopAPI.getUserInventory).to.have.been.called
        .with(ctx, ctx.user?.student_id);
      const expected: gql.UserInventory = {
        id: data.chest.id,
        items: [{
          id: data.chest.items[0].id,
          name: products[1].name,
          description: products[1].description,
          imageUrl: products[1].image_url,
          paidAt: data.chest.items[0].paidAt,
          paidPrice: products[1].price,
          consumedAt: null,
          variant: inventories[1].variant,
        },
        {
          id: data.chest.items[1].id,
          name: products[0].name,
          description: products[0].description,
          imageUrl: products[0].image_url,
          paidAt: data.chest.items[1].paidAt,
          paidPrice: products[0].price,
          consumedAt: null,
          // @ts-ignore
          variant: null,
        },
        {
          id: data.chest.items[2].id,
          name: products[0].name,
          description: products[0].description,
          imageUrl: products[0].image_url,
          paidAt: data.chest.items[2].paidAt,
          paidPrice: products[0].price,
          consumedAt: null,
          // @ts-ignore
          variant: null,
        }],
      };
      expect(data.chest, JSON.stringify(data)).to.deep.equal(expected);
    });
  });

  describe(('ConsumeItem'), () => {
    it('gets a users chest after consuming something', async () => {
      /** Initiate a payment */
      const { data: paymentData, errors: initiateErrors } = await client.mutate({
        mutation: InitiatePaymentQuery,
        variables: {
          phoneNumber,
        },
      });
      expect(initiateErrors, `${JSON.stringify(initiateErrors)}`).to.be.undefined;
      const payment = await knex<sql.Payment>(TABLE.PAYMENT)
        .where({ id: paymentData.webshop.initiatePayment.id }).first();

      /** Update payment status to paid, which should put the items in users inventory */
      const { errors: payErrors } = await clientLoggedOut.mutate({
        mutation: UpdatePaymentStatusMutation,
        variables: {
          paymentId: payment?.swish_id,
          status: gql.PaymentStatus.Paid,
        },
      });
      expect(payErrors, `${JSON.stringify(payErrors)}`).to.be.undefined;

      /** Get the users chest */
      const { data: chestData, errors: chestErrors } = await client.query({
        query: MyChestQuery,
        variables: {
          studentId: ctx.user?.student_id,
        },
      });
      expect(chestErrors, `${JSON.stringify(chestErrors)}`).to.be.undefined;

      /** Consume an item */
      chai.spy.on(dataSources.webshopAPI, 'consumeItem');
      const { data, errors } = await client.mutate({
        mutation: ConsumeItemMutation,
        variables: {
          itemId: chestData.chest.items[0].id,
        },
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(dataSources.webshopAPI.consumeItem).to.have.been.called
        .with(ctx, chestData.chest.items[0].id);
      const expected: gql.UserInventory = {
        id: chestData.chest.id,
        items: [{
          id: chestData.chest.items[0].id,
          name: products[1].name,
          description: products[1].description,
          imageUrl: products[1].image_url,
          paidAt: chestData.chest.items[0].paidAt,
          paidPrice: products[1].price,
          consumedAt: data.webshop.consumeItem.items[0].consumedAt,
          variant: inventories[1].variant,
        },
        {
          id: chestData.chest.items[1].id,
          name: products[0].name,
          description: products[0].description,
          imageUrl: products[0].image_url,
          paidAt: chestData.chest.items[1].paidAt,
          paidPrice: products[0].price,
          consumedAt: null,
          // @ts-ignore
          variant: null,
        },
        {
          id: chestData.chest.items[2].id,
          name: products[0].name,
          description: products[0].description,
          imageUrl: products[0].image_url,
          paidAt: chestData.chest.items[2].paidAt,
          paidPrice: products[0].price,
          consumedAt: null,
          // @ts-ignore
          variant: null,
        }],
      };
      expect(chestData.chest.items[0].consumedAt).to.be.null;
      expect(data.webshop.consumeItem.items[0].consumedAt).to.not.be.null;
      expect(data.webshop.consumeItem, JSON.stringify(data)).to.deep.equal(expected);
    });
  });
});
