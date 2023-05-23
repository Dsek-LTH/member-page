import 'mocha';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import {
  ApolloServerTestClient,
  createTestClient,
} from 'apollo-server-testing';

import { DataSources } from '~/src/datasources';
import constructTestServer from '../util';
import { context, knex } from '~/src/shared';
import * as gql from '~/src/types/graphql';
import * as sql from '~/src/types/webshop';
import { TABLE, TRANSACTION_COST, TRANSACTION_ITEM } from '~/src/datasources/WebshopAPI';
import {
  categories, inventories, PRODUCT, products,
} from './cartData';
import {
  AddToMyCart, GetMyCart, RemoveFromMyCart, RemoveMyCart,
} from './cartGraphql';

const ctx1: context.UserContext = { user: { keycloak_id: 'test', student_id: 'oliver' }, roles: undefined };
const emptyCtx: context.UserContext = { user: undefined, roles: undefined };

chai.use(spies);

const sandbox = chai.spy.sandbox();

describe('Cart Graphql Queries', () => {
  let dataSources: DataSources;
  let dataSourcesLoggedOut: DataSources;
  let client: ApolloServerTestClient;
  let clientLoggedOut: ApolloServerTestClient;

  before(() => {
    const { server: serverAuthorized, dataSources: d1 } = constructTestServer(ctx1);
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
  });

  afterEach(async () => {
    chai.spy.restore(dataSources.webshopAPI);
    await knex<sql.Cart>(TABLE.CART).del();
    await knex<sql.CartItem>(TABLE.CART_ITEM).del();
    await knex(TABLE.PRODUCT_INVENTORY).del();
    await knex(TABLE.PRODUCT).del();
    await knex(TABLE.PRODUCT_CATEGORY).del();
  });

  after(async () => {
    sandbox.restore();
  });

  describe(('AddToMyCart'), () => {
    it('adds a product to my cart', async () => {
      chai.spy.on(dataSources.webshopAPI, 'addToMyCart');
      const { data, errors } = await client.mutate({
        mutation: AddToMyCart,
        variables: {
          inventoryId: inventories[0].id,
          quantity: 1,
        },
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(dataSources.webshopAPI.addToMyCart).to.have.been.called
        .with(ctx1, inventories[0].id, 1);
      const expected: gql.Cart = {
        id: data.webshop.addToMyCart.id,
        expiresAt: data.webshop.addToMyCart.expiresAt,
        cartItems: [{
          id: data.webshop.addToMyCart.cartItems[0].id,
          name: products[0].name,
          description: products[0].description,
          imageUrl: products[0].image_url,
          inventory: [{
            inventoryId: inventories[0].id,
            id: data.webshop.addToMyCart.cartItems[0].inventory[0].id,
            quantity: 1,
            // @ts-ignore
            variant: null,
          }],
          maxPerUser: products[0].max_per_user,
          price: products[0].price,
          category: {
            id: categories[0].id,
            name: categories[0].name,
            description: categories[0].description,
          },
        },
        {
          ...TRANSACTION_ITEM,
          // @ts-ignore
          category: null,
        }],
        totalPrice: products[0].price + TRANSACTION_COST,
        totalQuantity: 1,
      };
      expect(data.webshop.addToMyCart, JSON.stringify(data)).to.deep.equal(expected);

      const updatedInventory = await knex<sql.ProductInventory>(TABLE.PRODUCT_INVENTORY).where(
        { id: inventories[0].id },
      ).first();
      expect(updatedInventory?.quantity).to.equal(inventories[0].quantity - 1);
    });

    it('adds the same product to my cart twice', async () => {
      chai.spy.on(dataSources.webshopAPI, 'addToMyCart');
      await client.mutate({
        mutation: AddToMyCart,
        variables: {
          inventoryId: inventories[0].id,
          quantity: 1,
        },
      });
      expect(dataSources.webshopAPI.addToMyCart).to.have.been.called
        .with(ctx1, inventories[0].id, 1);
      const { data, errors } = await client.mutate({
        mutation: AddToMyCart,
        variables: {
          inventoryId: inventories[0].id,
          quantity: 1,
        },
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(dataSources.webshopAPI.addToMyCart).to.have.been.called.twice;
      const expected: gql.Cart = {
        id: data.webshop.addToMyCart.id,
        expiresAt: data.webshop.addToMyCart.expiresAt,
        cartItems: [{
          id: data.webshop.addToMyCart.cartItems[0].id,
          name: products[0].name,
          description: products[0].description,
          imageUrl: products[0].image_url,
          inventory: [{
            inventoryId: inventories[0].id,
            id: data.webshop.addToMyCart.cartItems[0].inventory[0].id,
            quantity: 2,
            // @ts-ignore
            variant: null,
          }],
          maxPerUser: products[0].max_per_user,
          price: products[0].price,
          category: {
            id: categories[0].id,
            name: categories[0].name,
            description: categories[0].description,
          },
        },
        {
          ...TRANSACTION_ITEM,
          // @ts-ignore
          category: null,
        }],
        totalPrice: products[0].price * 2 + TRANSACTION_COST,
        totalQuantity: 2,
      };
      expect(data.webshop.addToMyCart, JSON.stringify(data)).to.deep.equal(expected);

      const updatedInventory = await knex<sql.ProductInventory>(TABLE.PRODUCT_INVENTORY).where(
        { id: inventories[0].id },
      ).first();
      expect(updatedInventory?.quantity).to.equal(inventories[0].quantity - 2);
    });

    it('adds two different products to my cart', async () => {
      chai.spy.on(dataSources.webshopAPI, 'addToMyCart');
      await client.mutate({
        mutation: AddToMyCart,
        variables: {
          inventoryId: inventories[0].id,
          quantity: 1,
        },
      });
      expect(dataSources.webshopAPI.addToMyCart).to.have.been.called
        .with(ctx1, inventories[0].id, 1);
      const { data, errors } = await client.mutate({
        mutation: AddToMyCart,
        variables: {
          inventoryId: inventories[1].id,
          quantity: 1,
        },
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(dataSources.webshopAPI.addToMyCart).to.have.been.called
        .with(ctx1, inventories[1].id, 1);
      expect(dataSources.webshopAPI.addToMyCart).to.have.been.called.twice;
      const expected: gql.Cart = {
        id: data.webshop.addToMyCart.id,
        expiresAt: data.webshop.addToMyCart.expiresAt,
        cartItems: [
          {
            id: data.webshop.addToMyCart.cartItems[0].id,
            name: products[0].name,
            description: products[0].description,
            imageUrl: products[0].image_url,
            inventory: [{
              inventoryId: inventories[0].id,
              id: data.webshop.addToMyCart.cartItems[0].inventory[0].id,
              quantity: 1,
              // @ts-ignore
              variant: null,
            }],
            maxPerUser: products[0].max_per_user,
            price: products[0].price,
            category: {
              id: categories[0].id,
              name: categories[0].name,
              description: categories[0].description,
            },
          },
          {
            id: data.webshop.addToMyCart.cartItems[1].id,
            name: products[1].name,
            description: products[1].description,
            imageUrl: products[1].image_url,
            inventory: [{
              inventoryId: inventories[1].id,
              id: data.webshop.addToMyCart.cartItems[1].inventory[0].id,
              quantity: 1,
              // @ts-ignore
              variant: inventories[1].variant,
            }],
            maxPerUser: products[1].max_per_user,
            price: products[1].price,
            category: {
              id: categories[1].id,
              name: categories[1].name,
              description: categories[1].description,
            },
          },
          {
            ...TRANSACTION_ITEM,
            // @ts-ignore
            category: null,
          }],
        totalPrice: products[0].price + products[1].price + TRANSACTION_COST,
        totalQuantity: 2,
      };
      expect(data.webshop.addToMyCart, JSON.stringify(data)).to.deep.equal(expected);

      const updatedInventory1 = await knex<sql.ProductInventory>(TABLE.PRODUCT_INVENTORY).where(
        { id: inventories[0].id },
      ).first();
      const updatedInventory2 = await knex<sql.ProductInventory>(TABLE.PRODUCT_INVENTORY).where(
        { id: inventories[1].id },
      ).first();
      expect(updatedInventory1?.quantity).to.equal(inventories[0].quantity - 1);
      expect(updatedInventory2?.quantity).to.equal(inventories[1].quantity - 1);
    });

    it('adds more items to your cart than is available', async () => {
      chai.spy.on(dataSources.webshopAPI, 'addToMyCart');
      const { data, errors } = await client.mutate({
        mutation: AddToMyCart,
        variables: {
          inventoryId: inventories[PRODUCT.BILJETT].id,
          quantity: 10,
        },
      });
      expect(errors && errors[0].message, `${JSON.stringify(errors)}`).to.equal('Not enough items in stock');
      expect(dataSources.webshopAPI.addToMyCart).to.have.been.called
        .with(ctx1, inventories[PRODUCT.BILJETT].id, 10);
      expect(data.webshop.addToMyCart, JSON.stringify(data)).to.be.null;
      const updatedInventory = await knex<sql.ProductInventory>(TABLE.PRODUCT_INVENTORY).where(
        { id: inventories[PRODUCT.BILJETT].id },
      ).first();
      expect(updatedInventory?.quantity).to.equal(inventories[PRODUCT.BILJETT].quantity);
    });

    it('adds more items to your cart at once than is allowed', async () => {
      chai.spy.on(dataSources.webshopAPI, 'addToMyCart');
      const { data, errors } = await client.mutate({
        mutation: AddToMyCart,
        variables: {
          inventoryId: inventories[PRODUCT.BILJETT_SALLSYNT].id,
          quantity: 2,
        },
      });
      expect(errors && errors[0].message, `${JSON.stringify(errors)}`).to.equal('You already have the maximum amount of this product.');
      expect(dataSources.webshopAPI.addToMyCart).to.have.been.called
        .with(ctx1, inventories[PRODUCT.BILJETT_SALLSYNT].id, 2);
      expect(data.webshop.addToMyCart, JSON.stringify(data)).to.be.null;
      const updatedInventory = await knex<sql.ProductInventory>(TABLE.PRODUCT_INVENTORY).where(
        { id: inventories[PRODUCT.BILJETT_SALLSYNT].id },
      ).first();
      expect(updatedInventory?.quantity).to.equal(inventories[PRODUCT.BILJETT_SALLSYNT].quantity);
    });

    it('adds more items to your cart in sequence than allowed', async () => {
      chai.spy.on(dataSources.webshopAPI, 'addToMyCart');
      const { errors: errors1 } = await client.mutate({
        mutation: AddToMyCart,
        variables: {
          inventoryId: inventories[PRODUCT.BILJETT_SALLSYNT].id,
          quantity: 1,
        },
      });
      expect(errors1).to.be.undefined;
      expect(dataSources.webshopAPI.addToMyCart).to.have.been.called
        .with(ctx1, inventories[PRODUCT.BILJETT_SALLSYNT].id, 1);
      const { data, errors } = await client.mutate({
        mutation: AddToMyCart,
        variables: {
          inventoryId: inventories[PRODUCT.BILJETT_SALLSYNT].id,
          quantity: 2,
        },
      });
      expect(errors && errors[0].message, `${JSON.stringify(errors)}`).to.equal('You already have the maximum amount of this product.');
      expect(dataSources.webshopAPI.addToMyCart).to.have.been.called
        .with(ctx1, inventories[PRODUCT.BILJETT_SALLSYNT].id, 2);
      expect(dataSources.webshopAPI.addToMyCart).to.have.been.called.twice;
      expect(data.webshop.addToMyCart, JSON.stringify(data)).to.be.null;

      const updatedInventory = await knex<sql.ProductInventory>(TABLE.PRODUCT_INVENTORY).where(
        { id: inventories[PRODUCT.BILJETT_SALLSYNT].id },
      ).first();
      expect(updatedInventory?.quantity).to
        .equal(inventories[PRODUCT.BILJETT_SALLSYNT].quantity - 1);
    });

    it('adds an item to my cart without a username', async () => {
      chai.spy.on(dataSourcesLoggedOut.webshopAPI, 'addToMyCart');
      const { data, errors } = await clientLoggedOut.mutate({
        mutation: AddToMyCart,
        variables: {
          inventoryId: inventories[PRODUCT.KAFFE].id,
          quantity: 1,
        },
      });
      expect(errors && errors[0].message, `${JSON.stringify(errors)}`).to.equal('You are not logged in');
      expect(dataSourcesLoggedOut.webshopAPI.addToMyCart).to.have.been.called
        .with(emptyCtx, inventories[PRODUCT.KAFFE].id, 1);
      expect(data.webshop.addToMyCart, JSON.stringify(data)).to.be.null;

      const updatedInventory = await knex<sql.ProductInventory>(TABLE.PRODUCT_INVENTORY).where(
        { id: inventories[PRODUCT.KAFFE].id },
      ).first();
      expect(updatedInventory?.quantity).to
        .equal(inventories[PRODUCT.KAFFE].quantity);
    });

    it('adds a free item to my cart', async () => {
      chai.spy.on(dataSources.webshopAPI, 'addToMyCart');
      const { data, errors } = await client.mutate({
        mutation: AddToMyCart,
        variables: {
          inventoryId: inventories[PRODUCT.FREE_BILJETT].id,
          quantity: 1,
        },
      });
      expect(errors).to.be.undefined;
      expect(dataSources.webshopAPI.addToMyCart).to.have.been.called
        .with(ctx1, inventories[PRODUCT.FREE_BILJETT].id, 1);
      expect(data.webshop.addToMyCart.totalPrice).to.equal(0);
      expect(data.webshop.addToMyCart.totalQuantity).to.equal(1);
      expect(data.webshop.addToMyCart.cartItems.length).to.equal(1);

      const updatedInventory = await knex<sql.ProductInventory>(TABLE.PRODUCT_INVENTORY).where(
        { id: inventories[PRODUCT.FREE_BILJETT].id },
      ).first();
      expect(updatedInventory?.quantity).to
        .equal(inventories[PRODUCT.FREE_BILJETT].quantity - 1);
    });
  });

  describe(('RemoveFromMyCart'), () => {
    it('removes a product without having a cart', async () => {
      chai.spy.on(dataSources.webshopAPI, 'removeFromMyCart');
      const { data, errors } = await client.mutate({
        mutation: RemoveFromMyCart,
        variables: {
          inventoryId: inventories[0].id,
          quantity: 1,
        },
      });
      expect(errors && errors[0].message, `${JSON.stringify(errors)}`).to.equal('Cart not found');
      expect(dataSources.webshopAPI.removeFromMyCart).to.have.been.called
        .with(ctx1, inventories[0].id, 1);
      expect(data.webshop.removeFromMyCart, JSON.stringify(data)).to.be.null;
      const updatedInventory = await knex<sql.ProductInventory>(TABLE.PRODUCT_INVENTORY).where(
        { id: inventories[0].id },
      ).first();
      expect(updatedInventory?.quantity).to.equal(inventories[0].quantity);
    });
    it('removes a product that is not in my cart', async () => {
      const { errors: addErrors } = await client.mutate({
        mutation: AddToMyCart,
        variables: {
          inventoryId: inventories[1].id,
          quantity: 1,
        },
      });
      expect(addErrors).to.be.undefined;
      chai.spy.on(dataSources.webshopAPI, 'removeFromMyCart');
      const { data, errors } = await client.mutate({
        mutation: RemoveFromMyCart,
        variables: {
          inventoryId: inventories[0].id,
          quantity: 1,
        },
      });
      expect(errors && errors[0].message, `${JSON.stringify(errors)}`).to.equal('Item not in cart');
      expect(dataSources.webshopAPI.removeFromMyCart).to.have.been.called
        .with(ctx1, inventories[0].id, 1);
      expect(data.webshop.removeFromMyCart, JSON.stringify(data)).to.be.null;
      const updatedInventory = await knex<sql.ProductInventory>(TABLE.PRODUCT_INVENTORY).where(
        { id: inventories[0].id },
      ).first();
      expect(updatedInventory?.quantity).to.equal(inventories[0].quantity);
    });
    it('adds and removes a product from my cart', async () => {
      const { errors: addErrors } = await client.mutate({
        mutation: AddToMyCart,
        variables: {
          inventoryId: inventories[0].id,
          quantity: 1,
        },
      });
      expect(addErrors, `${JSON.stringify(addErrors)}`).to.be.undefined;

      chai.spy.on(dataSources.webshopAPI, 'removeFromMyCart');
      const { data, errors } = await client.mutate({
        mutation: RemoveFromMyCart,
        variables: {
          inventoryId: inventories[0].id,
          quantity: 1,
        },
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(dataSources.webshopAPI.removeFromMyCart).to.have.been.called
        .with(ctx1, inventories[0].id, 1);
      const expected: gql.Cart = {
        id: data.webshop.removeFromMyCart.id,
        expiresAt: data.webshop.removeFromMyCart.expiresAt,
        cartItems: [],
        totalPrice: 0,
        totalQuantity: 0,
      };
      expect(data.webshop.removeFromMyCart, JSON.stringify(data)).to.deep.equal(expected);
      const updatedInventory = await knex<sql.ProductInventory>(TABLE.PRODUCT_INVENTORY).where(
        { id: inventories[0].id },
      ).first();
      expect(updatedInventory?.quantity).to.equal(inventories[0].quantity);
    });
  });

  describe(('GetMyCart'), () => {
    it('adds a product to and gets my cart', async () => {
      const { errors: addErrors } = await client.mutate({
        mutation: AddToMyCart,
        variables: {
          inventoryId: inventories[0].id,
          quantity: 1,
        },
      });
      expect(addErrors, `${JSON.stringify(addErrors)}`).to.be.undefined;

      chai.spy.on(dataSources.webshopAPI, 'getMyCart');
      const { data, errors } = await client.query({
        query: GetMyCart,
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(dataSources.webshopAPI.getMyCart).to.have.been.called
        .with(ctx1);
      const expected: gql.Cart = {
        id: data.myCart.id,
        expiresAt: data.myCart.expiresAt,
        cartItems: [{
          id: data.myCart.cartItems[0].id,
          name: products[0].name,
          description: products[0].description,
          imageUrl: products[0].image_url,
          inventory: [{
            inventoryId: inventories[0].id,
            id: data.myCart.cartItems[0].inventory[0].id,
            quantity: 1,
            // @ts-ignore
            variant: null,
          }],
          maxPerUser: products[0].max_per_user,
          price: products[0].price,
          category: {
            id: categories[0].id,
            name: categories[0].name,
            description: categories[0].description,
          },
        },
        {
          ...TRANSACTION_ITEM,
          // @ts-ignore
          category: null,
        }],
        totalPrice: products[0].price + TRANSACTION_COST,
        totalQuantity: 1,
      };
      expect(data.myCart, JSON.stringify(data)).to.deep.equal(expected);
    });

    it('failing to add products should not create a cart', async () => {
      const { errors: addErrors } = await client.mutate({
        mutation: AddToMyCart,
        variables: {
          inventoryId: inventories[PRODUCT.BILJETT_SALLSYNT].id,
          quantity: 10,
        },
      });
      expect(addErrors && addErrors[0].message, `${JSON.stringify(addErrors)}`).to
        .equal('Not enough items in stock');

      chai.spy.on(dataSources.webshopAPI, 'getMyCart');
      const { data, errors } = await client.query({
        query: GetMyCart,
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(dataSources.webshopAPI.getMyCart).to.have.been.called
        .with(ctx1);
      expect(data.myCart, JSON.stringify(data)).to.be.null;
    });
  });

  describe(('RemoveMyCart'), () => {
    it('removes my cart without having a cart', async () => {
      chai.spy.on(dataSources.webshopAPI, 'removeMyCart');
      const { data, errors } = await client.mutate({
        mutation: RemoveMyCart,
      });
      expect(errors && errors[0].message, `${JSON.stringify(errors)}`).to.equal('Cart not found');
      expect(dataSources.webshopAPI.removeMyCart).to.have.been.called
        .with(ctx1);
      expect(data.webshop.removeMyCart, JSON.stringify(data)).to.be.null;
    });

    it('removes my cart successfully', async () => {
      chai.spy.on(dataSources.webshopAPI, 'removeMyCart');
      const { errors: addErrors } = await client.mutate({
        mutation: AddToMyCart,
        variables: {
          inventoryId: inventories[0].id,
          quantity: 1,
        },
      });
      expect(addErrors, `${JSON.stringify(addErrors)}`).to.be.undefined;
      const { data, errors } = await client.mutate({
        mutation: RemoveMyCart,
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(dataSources.webshopAPI.removeMyCart).to.have.been.called
        .with(ctx1);
      expect(data.webshop.removeMyCart, JSON.stringify(data)).to.be.true;
    });
  });
});
