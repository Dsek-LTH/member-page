import { Knex } from 'knex';
import { TABLE } from '../../src/datasources/WebshopAPI';
import * as sql from '~/src/types/webshop';

export default async function insertProducts(knex: Knex) {
  const categoryIds = (await knex<sql.ProductCategory>(TABLE.PRODUCT_CATEGORY).insert([
    {
      name: 'Caféet',
      description: 'Här hittar du allt du behöver för att dricka kaffe',
    },
    {
      name: 'Biljetter',
      description: 'Här hittar du biljetter till olika evenemang',
    },
    {
      name: 'Merch',
      description: 'Här hittar du olika typer av merchandise',
    },
  ]).returning('id')).map((v) => v.id);

  const productIds = (await knex<sql.Product>(TABLE.PRODUCT).insert([
    {
      name: 'Kaffe',
      price: 10,
      description: 'Kaffe',
      image_url: 'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/flat-white-3402c4f.jpg',
      max_per_user: 10,
      category_id: categoryIds[0],
    },
    {
      name: 'Biljett till Nollegasquen',
      price: 100,
      description: 'Biljett till Nollegasquens beskrivning',
      image_url: 'https://cdn3.vectorstock.com/i/1000x1000/09/42/yellow-ticket-vector-590942.jpg',
      max_per_user: 1,
      category_id: categoryIds[1],
    },
    {
      name: 'En väldigt sällsynt biljett',
      price: 1000,
      description: 'Den här biljetten är väldigt sällsynt',
      image_url: 'https://merriam-webster.com/assets/mw/images/article/art-wap-landing-mp-lg/alt-59d686b7bdb0b-4342-e0eb70e236dccbb643a810e5f6731ae5@1x.jpg',
      max_per_user: 1,
      category_id: categoryIds[1],
    },
    {
      name: 'T-shirt',
      price: 250,
      description: 'En väldigt fin T-shirt',
      image_url: 'https://egettryck.se/7658-large_default/kungsbla-barn-t-shirt-med-eget-tryck.jpg',
      max_per_user: 1000,
      category_id: categoryIds[2],
    },
  ]).returning('id')).map((v) => v.id);

  await knex<sql.ProductInventory>(TABLE.PRODUCT_INVENTORY).insert([
    {
      product_id: productIds[0],
      quantity: 100,
    },
    {
      product_id: productIds[1],
      quantity: 25,
    },
    {
      product_id: productIds[2],
      quantity: 1,
    },
    {
      product_id: productIds[3],
      quantity: 10,
      variant: 'S',
    },
    {
      product_id: productIds[3],
      quantity: 10,
      variant: 'M',
    },
    {
      product_id: productIds[3],
      quantity: 10,
      variant: 'L',
    },
  ]);
}
