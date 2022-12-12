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
import { TABLE } from '~/src/types/webshop';
import { categories, inventories, products } from '../cart/cartData';
import {
  ctx, userInventories, userInventoryItems, ctxPhilip,
} from './inventoryData';
import { DeliverItem, GetInventoryItemsByStatus } from './inventoryGraphql';
import { ConsumeItemMutation, MyChestQuery } from '../payment/paymentGraphql';
import { emptyCtx } from '../payment/paymentData';

chai.use(spies);

const sandbox = chai.spy.sandbox();

describe('Payment Graphql Queries', () => {
  let dataSources: DataSources;
  let dataSourcesPhilip: DataSources;
  let dataSourcesLoggedOut: DataSources;
  let client: ApolloServerTestClient;
  let clientPhilip: ApolloServerTestClient;
  let clientLoggedOut: ApolloServerTestClient;

  before(() => {
    const { server, dataSources: sources } = constructTestServer(ctx);
    const { server: serverPhilip, dataSources: sourcesPhilip } = constructTestServer(ctxPhilip);
    const { server: serverLoggedOut, dataSources: sourcesLoggedOut } = constructTestServer();
    dataSources = sources;
    dataSourcesPhilip = sourcesPhilip;
    dataSourcesLoggedOut = sourcesLoggedOut;
    client = createTestClient(server);
    clientPhilip = createTestClient(serverPhilip);
    clientLoggedOut = createTestClient(serverLoggedOut);
    sandbox.on(dataSources.inventoryAPI, 'withAccess', (_, __, fn) => fn());
    sandbox.on(dataSourcesPhilip.inventoryAPI, 'withAccess', (_, __, fn) => fn());
    sandbox.on(dataSourcesLoggedOut.inventoryAPI, 'withAccess', (_, __, fn) => fn());
  });

  beforeEach(async () => {
    await knex<sql.ProductCategory>(TABLE.PRODUCT_CATEGORY).insert(categories);
    await knex<sql.Product>(TABLE.PRODUCT).insert(products);
    await knex<sql.ProductInventory>(TABLE.PRODUCT_INVENTORY).insert(inventories);
    await knex<sql.Cart>(TABLE.USER_INVENTORY).insert(userInventories);
    await knex<sql.CartItem>(TABLE.USER_INVENTORY_ITEM).insert(userInventoryItems);
  });

  afterEach(async () => {
    chai.spy.restore(dataSources.paymentAPI);
    chai.spy.restore(dataSources.inventoryAPI);
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

  describe('ConsumeItem', () => {
    it('consumes philip\'s item', async () => {
      chai.spy.on(dataSourcesPhilip.inventoryAPI, 'consumeItem');
      const { data, errors } = await clientPhilip.mutate({
        mutation: ConsumeItemMutation,
        variables: {
          itemId: userInventoryItems[3].id,
        },
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(dataSourcesPhilip.inventoryAPI.consumeItem).to.have.been.called
        .with(ctxPhilip, userInventoryItems[3].id);
      const expected: gql.UserInventory = {
        id: userInventories[1].id,
        items: [{
          id: userInventoryItems[3].id,
          name: products[0].name,
          description: products[0].description,
          imageUrl: products[0].image_url,
          paidAt: userInventoryItems[3].paid_at,
          paidPrice: products[0].price,
          consumedAt: data.webshop.consumeItem.items[0].consumedAt,
          // @ts-ignore
          variant: null,
          status: gql.InventoryItemStatus.Consumed,
          studentId: 'philip',
        }],
      };
      expect(data.webshop.consumeItem).to.deep.equal(expected);
    });

    it('attempts to consume an item twice', async () => {
      chai.spy.on(dataSourcesPhilip.inventoryAPI, 'consumeItem');
      await clientPhilip.mutate({
        mutation: ConsumeItemMutation,
        variables: {
          itemId: userInventoryItems[3].id,
        },
      });
      const { data, errors } = await clientPhilip.mutate({
        mutation: ConsumeItemMutation,
        variables: {
          itemId: userInventoryItems[3].id,
        },
      });
      expect(errors?.[0].message, `${JSON.stringify(errors)}`).to.equal('Item already consumed.');
      expect(dataSourcesPhilip.inventoryAPI.consumeItem).to.have.been.called.twice;

      expect(data.webshop.consumeItem).to.be.null;
    });

    it('attempts to consume philip\'s item as oliver', async () => {
      chai.spy.on(dataSources.inventoryAPI, 'consumeItem');
      const { data, errors } = await client.mutate({
        mutation: ConsumeItemMutation,
        variables: {
          itemId: userInventoryItems[3].id,
        },
      });
      expect(errors?.[0].message, `${JSON.stringify(errors)}`).to.be.equal('Item does not belong to you.');
      expect(dataSources.inventoryAPI.consumeItem).to.have.been.called
        .with(ctx, userInventoryItems[3].id);
      expect(data.webshop.consumeItem).to.deep.be.null;
    });

    it('attempts to consume philip\'s item while logged out', async () => {
      chai.spy.on(dataSourcesLoggedOut.inventoryAPI, 'consumeItem');
      const { data, errors } = await clientLoggedOut.mutate({
        mutation: ConsumeItemMutation,
        variables: {
          itemId: userInventoryItems[3].id,
        },
      });
      expect(errors?.[0].message, `${JSON.stringify(errors)}`).to.be.equal('You are not logged in.');
      expect(dataSourcesLoggedOut.inventoryAPI.consumeItem).to.have.been.called
        .with(emptyCtx, userInventoryItems[3].id);
      expect(data.webshop.consumeItem).to.deep.be.null;
    });

    it('attempts to consume non-existing item', async () => {
      chai.spy.on(dataSources.inventoryAPI, 'consumeItem');
      const { data, errors } = await client.mutate({
        mutation: ConsumeItemMutation,
        variables: {
          itemId: userInventories[0].id,
        },
      });
      expect(errors?.[0].message, `${JSON.stringify(errors)}`).to.be.equal('Cannot find item.');
      expect(dataSources.inventoryAPI.consumeItem).to.have.been.called
        .with(ctx, userInventories[0].id);
      expect(data.webshop.consumeItem).to.deep.be.null;
    });
  });

  describe('GetUserInventory', () => {
    it('gets philip\'s inventory', async () => {
      chai.spy.on(dataSources.inventoryAPI, 'getUserInventory');
      const { data, errors } = await client.query({
        query: MyChestQuery,
        variables: {
          studentId: 'philip',
        },
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(dataSources.inventoryAPI.getUserInventory).to.have.been.called
        .with(ctx, 'philip');
      const expected: gql.UserInventory = {
        id: userInventories[1].id,
        items: [{
          id: userInventoryItems[3].id,
          name: products[0].name,
          description: products[0].description,
          imageUrl: products[0].image_url,
          paidAt: userInventoryItems[3].paid_at,
          paidPrice: products[0].price,
          consumedAt: null,
          // @ts-ignore
          variant: null,
          status: gql.InventoryItemStatus.Paid,
          studentId: 'philip',
        }],
      };
      expect(data.chest).to.deep.equal(expected);
    });

    it('attempts to get non-existing inventory', async () => {
      chai.spy.on(dataSources.inventoryAPI, 'getUserInventory');
      const { data, errors } = await client.query({
        query: MyChestQuery,
        variables: {
          studentId: 'benim',
        },
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(dataSources.inventoryAPI.getUserInventory).to.have.been.called
        .with(ctx, 'benim');
      expect(data.chest).to.equal(null);
    });
  });

  describe(('GetInventoryItemByStatus'), () => {
    it('gets all "PAID" inventory items', async () => {
      chai.spy.on(dataSources.inventoryAPI, 'getInventoryItemsByStatus');
      const { data, errors } = await client.query({
        query: GetInventoryItemsByStatus,
        variables: {
          status: gql.InventoryItemStatus.Paid,
        },
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(dataSources.inventoryAPI.getInventoryItemsByStatus).to.have.been.called
        .with(ctx, gql.InventoryItemStatus.Paid);

      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      const expected: gql.UserInventoryItem[] = [{
        id: userInventoryItems[0].id,
        name: products[0].name,
        description: products[0].description,
        imageUrl: products[0].image_url,
        paidAt: userInventoryItems[0].paid_at,
        paidPrice: products[0].price,
        consumedAt: null,
        // @ts-ignore
        variant: null,
        deliveredAt: null,
        status: gql.InventoryItemStatus.Paid,
        studentId: 'oliver',
      },
      {
        id: data.inventoryItemsByStatus[1].id,
        name: products[0].name,
        description: products[0].description,
        imageUrl: products[0].image_url,
        paidAt: data.inventoryItemsByStatus[1].paidAt,
        paidPrice: products[0].price,
        consumedAt: null,
        // @ts-ignore
        variant: null,
        deliveredAt: null,
        status: gql.InventoryItemStatus.Paid,
        studentId: 'oliver',
      },
      {
        id: data.inventoryItemsByStatus[2].id,
        name: products[0].name,
        description: products[0].description,
        imageUrl: products[0].image_url,
        paidAt: data.inventoryItemsByStatus[2].paidAt,
        paidPrice: products[0].price,
        consumedAt: null,
        // @ts-ignore
        variant: null,
        deliveredAt: null,
        status: gql.InventoryItemStatus.Paid,
        studentId: 'philip',
      }];
      expect(data.inventoryItemsByStatus, JSON.stringify(data)).to.deep.equal(expected);
    });

    it('gets all inventory items that belongs to "philip"', async () => {
      chai.spy.on(dataSources.inventoryAPI, 'getInventoryItemsByStatus');
      const { data, errors } = await client.query({
        query: GetInventoryItemsByStatus,
        variables: {
          studentId: 'philip',
        },
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(dataSources.inventoryAPI.getInventoryItemsByStatus).to.have.been.called
        .with(ctx, undefined, 'philip');

      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      const expected: gql.UserInventoryItem[] = [
        {
          id: userInventoryItems[3].id,
          name: products[0].name,
          description: products[0].description,
          imageUrl: products[0].image_url,
          paidAt: userInventoryItems[3].paid_at,
          paidPrice: products[0].price,
          consumedAt: null,
          // @ts-ignore
          variant: null,
          deliveredAt: null,
          status: gql.InventoryItemStatus.Paid,
          studentId: 'philip',
        }];
      expect(data.inventoryItemsByStatus, JSON.stringify(data)).to.deep.equal(expected);
    });

    it('gets all inventory items that have a specific ID', async () => {
      chai.spy.on(dataSources.inventoryAPI, 'getInventoryItemsByStatus');
      const { data, errors } = await client.query({
        query: GetInventoryItemsByStatus,
        variables: {
          productId: products[1].id,
        },
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(dataSources.inventoryAPI.getInventoryItemsByStatus).to.have.been.called
        .with(ctx, undefined, undefined, products[1].id);

      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      const expected: gql.UserInventoryItem[] = [
        {
          id: userInventoryItems[2].id,
          name: products[1].name,
          description: products[1].description,
          imageUrl: products[1].image_url,
          paidAt: userInventoryItems[2].paid_at,
          paidPrice: products[1].price,
          consumedAt: userInventoryItems[2].consumed_at,
          // @ts-ignore
          variant: null,
          deliveredAt: null,
          status: gql.InventoryItemStatus.Consumed,
          studentId: 'oliver',
        }];
      expect(data.inventoryItemsByStatus, JSON.stringify(data)).to.deep.equal(expected);
    });
  });

  describe(('DeliverItem'), () => {
    it('delivers an item', async () => {
      chai.spy.on(dataSources.inventoryAPI, 'deliverItem');
      const { data, errors } = await client.mutate({
        mutation: DeliverItem,
        variables: {
          itemId: userInventoryItems[2].id,
        },
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(dataSources.inventoryAPI.deliverItem).to.have.been.called
        .with(ctx, userInventoryItems[2].id);
      const expected: gql.UserInventoryItem = {
        id: userInventoryItems[2].id,
        name: products[1].name,
        description: products[1].description,
        imageUrl: products[1].image_url,
        paidAt: userInventoryItems[2].paid_at,
        paidPrice: products[1].price,
        consumedAt: userInventoryItems[2].consumed_at,
        // @ts-ignore
        variant: null,
        deliveredAt: data.webshop.deliverItem.deliveredAt,
        status: gql.InventoryItemStatus.Delivered,
        studentId: 'oliver',
      };
      expect(data.webshop.deliverItem, JSON.stringify(data)).to.deep.equal(expected);
    });

    it('attempts to deliver an item twice', async () => {
      chai.spy.on(dataSources.inventoryAPI, 'deliverItem');
      await client.mutate({
        mutation: DeliverItem,
        variables: {
          itemId: userInventoryItems[2].id,
        },
      });
      const { data, errors } = await client.mutate({
        mutation: DeliverItem,
        variables: {
          itemId: userInventoryItems[2].id,
        },
      });
      expect(errors?.[0]?.message, `${JSON.stringify(errors)}`).to.equal('Item already delivered.');
      expect(dataSources.inventoryAPI.deliverItem).to.have.been.called.twice;
      expect(data.webshop.deliverItem, JSON.stringify(data)).to.deep.be.null;
    });

    it('attempts to deliver an unconsumed item', async () => {
      chai.spy.on(dataSources.inventoryAPI, 'deliverItem');
      const { data, errors } = await client.mutate({
        mutation: DeliverItem,
        variables: {
          itemId: userInventoryItems[0].id,
        },
      });
      expect(errors?.[0]?.message, `${JSON.stringify(errors)}`).to.equal('Item is not consumed yet.');
      expect(dataSources.inventoryAPI.deliverItem).to.have.been.called
        .with(ctx, userInventoryItems[0].id);
      expect(data.webshop.deliverItem, JSON.stringify(data)).to.deep.be.null;
    });

    it('attempts to deliver an item that cannot be found', async () => {
      chai.spy.on(dataSources.inventoryAPI, 'deliverItem');
      const { data, errors } = await client.mutate({
        mutation: DeliverItem,
        variables: {
          itemId: userInventories[0].id,
        },
      });
      expect(errors?.[0]?.message, `${JSON.stringify(errors)}`).to.equal('Cannot find item.');
      expect(dataSources.inventoryAPI.deliverItem).to.have.been.called
        .with(ctx, userInventories[0].id);
      expect(data.webshop.deliverItem, JSON.stringify(data)).to.deep.be.null;
    });
  });
});
