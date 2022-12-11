import {
  dbUtils, context, UUID,
} from '../shared';
import {
  convertInventory,
  convertProduct,
  convertProductCategory,
} from '../shared/converters/webshopConverters';
import * as gql from '../types/graphql';
import * as sql from '../types/webshop';
import { TABLE } from '../types/webshop';

export default class ProductAPI extends dbUtils.KnexDataSource {
  getProducts(ctx: context.UserContext, categoryId?: string): Promise<gql.Product[]> {
    return this.withAccess('webshop:read', ctx, async () => {
      let query = this.knex<sql.Product>(TABLE.PRODUCT);
      if (categoryId) {
        query = query.where({ category_id: categoryId }); // not tested
      }
      const products = await query;
      const inventories = await this.knex<sql.ProductInventory>(TABLE.PRODUCT_INVENTORY).orderBy('variant');
      const categories = await this.knex<sql.ProductCategory>(TABLE.PRODUCT_CATEGORY);
      return products.map((product) => {
        const category = convertProductCategory(categories
          .find((c) => c.id === product.category_id));
        const inventory = inventories
          .filter((i) => i.product_id === product.id)
          .map(convertInventory);
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
      const inventory = productInventories.map(convertInventory);
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
}
