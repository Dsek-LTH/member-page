import 'mocha';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import { ApolloServer } from 'apollo-server';
import {
  ApolloServerTestClient,
  createTestClient,
} from 'apollo-server-testing';

import { DataSources } from '~/src/datasources';
import constructTestServer from '../util';
import { knex } from '~/src/shared';
import {
  CreateInventory,
  CreateProductMutation,
  GetProductCategories,
  GetProductQuery,
  GetProductsQuery,
  UpdateInventory,
  UpdateProductMutation,
} from './productsGraphql';
import { ProductCategory } from '~/src/types/graphql';
import { TABLE } from '~/src/datasources/WebshopAPI';
import { categories, coffeeInput, tShirtInput } from './productsData';
import { expectedProduct } from './productsFunctions';

const ctx = { user: undefined, roles: undefined };

chai.use(spies);

const sandbox = chai.spy.sandbox();

describe('Products API Graphql', () => {
  let server: ApolloServer;
  let dataSources: DataSources;
  let client: ApolloServerTestClient;

  before(async () => {
    const testServer = constructTestServer();
    server = testServer.server;
    dataSources = testServer.dataSources;
    client = createTestClient(server);
    await knex<ProductCategory>(TABLE.PRODUCT_CATEGORY).insert(categories);
  });

  beforeEach(() => {
    sandbox.on(dataSources.webshopAPI, 'withAccess', (name, context, fn) =>
      fn());
  });

  afterEach(async () => {
    chai.spy.restore(dataSources.webshopAPI);
    sandbox.restore();
    await knex(TABLE.PRODUCT).del();
  });

  after(async () => {
    await knex(TABLE.PRODUCT_CATEGORY).del();
  });

  describe('GetProductCategories', () => {
    it('should return all product categories', async () => {
      chai.spy.on(dataSources.webshopAPI, 'getProductCategories');
      const { data, errors } = await client.query({
        query: GetProductCategories,
      });
      expect(errors, JSON.stringify(errors)).to.be.undefined;
      expect(dataSources.webshopAPI.getProductCategories).to.have.been.called
        .once;
      expect(data).to.have.property('productCategories');
      expect(data.productCategories).to.deep.equal([
        {
          id: categories[0].id,
          name: categories[0].name,
          description: categories[0].description,
        },
        {
          id: categories[1].id,
          name: categories[1].name,
          description: categories[1].description,
        },
      ]);
    });
  });

  describe('CreateProduct', () => {
    it('creates a product with no variants', async () => {
      chai.spy.on(dataSources.webshopAPI, 'createProduct');
      const { data, errors } = await client.mutate({
        mutation: CreateProductMutation,
        variables: {
          input: coffeeInput,
        },
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(dataSources.webshopAPI.createProduct).to.have.been.called.with(
        ctx,
        coffeeInput,
      );
      expect(data.webshop.createProduct, JSON.stringify(data)).to.deep.equal(
        expectedProduct(data.webshop.createProduct, coffeeInput, categories[1]),
      );
      expect(data.webshop.createProduct.inventory).to.be.empty;
    });

    it('adds a inventory to a newly created product', async () => {
      const { data, errors } = await client.mutate({
        mutation: CreateProductMutation,
        variables: {
          input: coffeeInput,
        },
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(data.webshop.createProduct.inventory).to.be.empty;
      chai.spy.on(dataSources.webshopAPI, 'addInventory');
      const input = {
        productId: data.webshop.createProduct.id,
        quantity: 10,
      };
      const { data: updated, errors: updatedErrors } = await client.mutate({
        mutation: CreateInventory,
        variables: {
          input,
        },
      });
      expect(updatedErrors, `${JSON.stringify(updatedErrors)}`).to.be.undefined;
      expect(dataSources.webshopAPI.addInventory).to.have.been.called.with(
        ctx,
        input,
      );
      expect(updated.webshop.addInventory.inventory).to.deep.equal([
        {
          id: updated.webshop.addInventory.inventory[0].id,
          quantity: 10,
          variant: null,
        },
      ]);
    });

    it('creates a product with several variants', async () => {
      chai.spy.on(dataSources.webshopAPI, 'createProduct');
      const { data, errors } = await client.mutate({
        mutation: CreateProductMutation,
        variables: {
          input: tShirtInput,
        },
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(dataSources.webshopAPI.createProduct).to.have.been.called.with(
        ctx,
        tShirtInput,
      );
      expect(data.webshop.createProduct, JSON.stringify(data)).to.deep.equal(
        expectedProduct(data.webshop.createProduct, tShirtInput, categories[0]),
      );
      await client.mutate({
        mutation: CreateInventory,
        variables: {
          input: {
            productId: data.webshop.createProduct.id,
            quantity: 10,
            variant: 'S',
          },
        },
      });
      await client.mutate({
        mutation: CreateInventory,
        variables: {
          input: {
            productId: data.webshop.createProduct.id,
            quantity: 15,
            variant: 'M',
          },
        },
      });
      await client.mutate({
        mutation: CreateInventory,
        variables: {
          input: {
            productId: data.webshop.createProduct.id,
            quantity: 20,
            variant: 'L',
          },
        },
      });
      const { data: updated, errors: updatedErrors } = await client.query({
        query: GetProductQuery,
        variables: {
          id: data.webshop.createProduct.id,
        },
      });
      expect(updatedErrors, `${JSON.stringify(updatedErrors)}`).to.be.undefined;
      expect(updated.product.inventory).to.deep.equal([
        {
          id: updated.product.inventory[0].id,
          quantity: 10,
          variant: 'S',
        },
        {
          id: updated.product.inventory[1].id,
          quantity: 15,
          variant: 'M',
        },
        {
          id: updated.product.inventory[2].id,
          quantity: 20,
          variant: 'L',
        },
      ]);
    });

    it('gets a created product', async () => {
      chai.spy.on(dataSources.webshopAPI, 'getProductById');
      const { data: created } = await client.mutate({
        mutation: CreateProductMutation,
        variables: {
          input: coffeeInput,
        },
      });
      const { data, errors } = await client.query({
        query: GetProductQuery,
        variables: {
          id: created.webshop.createProduct.id,
        },
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(dataSources.webshopAPI.getProductById).to.have.been.called.with(
        ctx,
        created.webshop.createProduct.id,
      );
      expect(data.product).to.not.be.null;
      expect(data.product, JSON.stringify(data)).to.deep.equal(
        expectedProduct(data.product, coffeeInput, categories[1]),
      );
    });

    it('gets several products after creating them', async () => {
      chai.spy.on(dataSources.webshopAPI, 'getProducts');
      await client.mutate({
        mutation: CreateProductMutation,
        variables: {
          input: coffeeInput,
        },
      });
      await client.mutate({
        mutation: CreateProductMutation,
        variables: {
          input: tShirtInput,
        },
      });
      const { data, errors } = await client.query({
        query: GetProductsQuery,
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(dataSources.webshopAPI.getProducts).to.have.been.called;
      expect(data.products).to.have.lengthOf(2);
      expect(data.products[0], JSON.stringify(data)).to.deep.equal(
        expectedProduct(data.products[0], coffeeInput, categories[1]),
      );
      expect(data.products[1], JSON.stringify(data)).to.deep.equal(
        expectedProduct(data.products[1], tShirtInput, categories[0]),
      );
    });
  });

  describe('UpdateProduct', () => {
    it('updates a product', async () => {
      const { data } = await client.mutate({
        mutation: CreateProductMutation,
        variables: {
          input: coffeeInput,
        },
      });
      expect(data.webshop.createProduct, JSON.stringify(data)).to.deep.equal(
        expectedProduct(data.webshop.createProduct, coffeeInput, categories[1]),
      );
      chai.spy.on(dataSources.webshopAPI, 'updateProduct');
      const input = {
        productId: data.webshop.createProduct.id,
        name: 'Updated Coffee',
        description: 'Updated description',
        price: 1337,
        categoryId: categories[0].id,
      };
      const { data: updated, errors } = await client.mutate({
        mutation: UpdateProductMutation,
        variables: {
          input,
        },
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(dataSources.webshopAPI.updateProduct).to.have.been.called.with(
        ctx,
        input,
      );
      expect(
        updated.webshop.updateProduct,
        JSON.stringify(updated),
      ).to.deep.equal({
        ...expectedProduct(
          data.webshop.createProduct,
          coffeeInput,
          categories[0],
        ),
        name: 'Updated Coffee',
        description: 'Updated description',
        price: 1337,
      });
    });

    it('updates a product inventory', async () => {
      const { data } = await client.mutate({
        mutation: CreateProductMutation,
        variables: {
          input: coffeeInput,
        },
      });
      expect(data.webshop.createProduct, JSON.stringify(data)).to.deep.equal(
        expectedProduct(data.webshop.createProduct, coffeeInput, categories[1]),
      );
      const createInventoryInput = {
        productId: data.webshop.createProduct.id,
        quantity: 10,
      };
      const { data: updated } = await client.mutate({
        mutation: CreateInventory,
        variables: {
          input: createInventoryInput,
        },
      });
      const inventoryId = updated.webshop.addInventory.inventory[0].id;
      const input = {
        inventoryId,
        quantity: 20,
      };
      const { data: updatedInventory, errors } = await client.mutate({
        mutation: UpdateInventory,
        variables: {
          input,
        },
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(updatedInventory.webshop.updateInventory.inventory[0].id).to.equal(
        inventoryId,
      );
      expect(
        updatedInventory.webshop.updateInventory.inventory[0].quantity,
      ).to.equal(20);
    });
  });

  describe('DeleteProduct', () => {
    it('deletes a product', async () => {
      await client.mutate({
        mutation: CreateProductMutation,
        variables: {
          input: coffeeInput,
        },
      });
      const { data } = await client.query({
        query: GetProductsQuery,
      });
      expect(data.products).to.have.lengthOf(1);
    });
  });
});
