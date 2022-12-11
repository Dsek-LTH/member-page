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
  CreateProductMutation, GetProductCategories, GetProductQuery, GetProductsQuery,
} from './productsGraphql';
import { ProductCategory } from '~/src/types/graphql';
import { TABLE } from '~/src/types/webshop';
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
    sandbox.on(dataSources.productAPI, 'withAccess', (name, context, fn) => fn());
  });

  afterEach(async () => {
    chai.spy.restore(dataSources.productAPI);
    sandbox.restore();
    await knex(TABLE.PRODUCT).del();
  });

  after(async () => {
    await knex(TABLE.PRODUCT_CATEGORY).del();
  });

  describe('GetProductCategories', () => {
    it('should return all product categories', async () => {
      chai.spy.on(dataSources.productAPI, 'getProductCategories');
      const { data, errors } = await client.query({
        query: GetProductCategories,
      });
      expect(errors, JSON.stringify(errors)).to.be.undefined;
      expect(dataSources.productAPI.getProductCategories).to.have.been.called.once;
      expect(data).to.have.property('productCategories');
      expect(data.productCategories).to.deep.equal([{
        id: categories[0].id,
        name: categories[0].name,
        description: categories[0].description,
      },
      {
        id: categories[1].id,
        name: categories[1].name,
        description: categories[1].description,
      }]);
    });
  });

  describe(('CreateProduct'), () => {
    it('creates a product with no variants', async () => {
      chai.spy.on(dataSources.productAPI, 'createProduct');
      const { data, errors } = await client.mutate({
        mutation: CreateProductMutation,
        variables: {
          input: coffeeInput,
        },
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(dataSources.productAPI.createProduct).to.have.been.called
        .with(ctx, coffeeInput);
      expect(data.webshop.createProduct, JSON.stringify(data)).to.deep.equal(
        expectedProduct(data.webshop.createProduct, coffeeInput, categories[1]),
      );
    });

    it('creates a product with several variants', async () => {
      chai.spy.on(dataSources.productAPI, 'createProduct');
      const { data, errors } = await client.mutate({
        mutation: CreateProductMutation,
        variables: {
          input: tShirtInput,
        },
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(dataSources.productAPI.createProduct).to.have.been.called
        .with(ctx, tShirtInput);
      expect(data.webshop.createProduct, JSON.stringify(data)).to.deep.equal(
        expectedProduct(data.webshop.createProduct, tShirtInput, categories[0]),
      );
    });
  });

  describe('GetProduct', () => {
    it('gets a non-existing product', async () => {
      chai.spy.on(dataSources.productAPI, 'getProductById');
      const { data, errors } = await client.query({
        query: GetProductQuery,
        variables: {
          id: 'a1a6b1a6-1a6b-1a6b-1a6b-a1a6b1a6b1a6',
        },
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(dataSources.productAPI.getProductById).to.have.been.called
        .with(ctx, 'a1a6b1a6-1a6b-1a6b-1a6b-a1a6b1a6b1a6');
      expect(data.product).to.be.null;
    });
    it('gets a created product', async () => {
      chai.spy.on(dataSources.productAPI, 'getProductById');
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
      expect(dataSources.productAPI.getProductById).to.have.been.called
        .with(ctx, created.webshop.createProduct.id);
      expect(data.product).to.not.be.null;
      expect(data.product, JSON.stringify(data)).to.deep.equal(
        expectedProduct(data.product, coffeeInput, categories[1]),
      );
    });

    it('gets several products after creating them', async () => {
      chai.spy.on(dataSources.productAPI, 'getProducts');
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
      expect(dataSources.productAPI.getProducts).to.have.been.called;
      expect(data.products).to.have.lengthOf(2);
      expect(data.products[0], JSON.stringify(data)).to.deep.equal(
        expectedProduct(data.products[0], coffeeInput, categories[1]),
      );
      expect(data.products[1], JSON.stringify(data)).to.deep.equal(
        expectedProduct(data.products[1], tShirtInput, categories[0]),
      );
    });

    it('gets filtered products after creating them', async () => {
      chai.spy.on(dataSources.productAPI, 'getProducts');
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
        variables: {
          categoryId: categories[0].id,
        },
      });
      expect(errors, `${JSON.stringify(errors)}`).to.be.undefined;
      expect(dataSources.productAPI.getProducts).to.have.been.called;
      expect(data.products).to.have.lengthOf(1);
      expect(data.products[0], JSON.stringify(data)).to.deep.equal(
        expectedProduct(data.products[0], tShirtInput, categories[0]),
      );
    });
  });
});
