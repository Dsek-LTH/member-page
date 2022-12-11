import {
  dbUtils, context, UUID,
} from '../shared';
import { convertUserInventoryItem } from '../shared/converters/webshopConverters';
import * as gql from '../types/graphql';
import * as sql from '../types/webshop';
import { Member } from '../types/database';
import { TABLE } from '../types/webshop';

export default class InventoryAPI extends dbUtils.KnexDataSource {
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
}
