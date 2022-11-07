import type Knex from 'knex';
import { ApiAccessPolicy } from '~/src/shared';

// eslint-disable-next-line import/prefer-default-export
export const seed = async (knex: Knex) => {
  await knex('api_access_policies').del();

  await knex<ApiAccessPolicy>('api_access_policies').insert([
    { api_name: 'core:access:api:create', role: 'dsek.infu.dwww' },
    { api_name: 'core:access:api:create', role: '*' },
    { api_name: 'core:access:api:read', role: 'dsek' },
    { api_name: 'core:access:api:read', role: '*' },
    { api_name: 'core:access:api:read', role: '*' },
    { api_name: 'core:access:api:delete', role: '*' },
    { api_name: 'core:access:door:create', role: 'dsek.infu.dwww.mastare' },
    { api_name: 'core:access:door:create', role: '*' },
    { api_name: 'core:access:door:read', role: '*' },
    { api_name: 'core:access:admin:read', role: '*' },
    { api_name: 'core:committee:read', role: '*' },
    { api_name: 'core:mandate:read', role: '*' },
    { api_name: 'core:mandate:create', role: '*' },
    { api_name: 'core:mandate:delete', role: '*' },
    { api_name: 'core:position:read', role: '*' },
    { api_name: 'core:member:read', role: '*' },
    { api_name: 'core:member:create', role: '*' },
    { api_name: 'core:member:update', role: 'dsek.infu.dwww.mastare' },
    { api_name: 'core:mail:alias:read', role: '*' },
    { api_name: 'core:mail:alias:create', role: '*' },
    { api_name: 'booking_request:read', role: '*' },
    { api_name: 'booking_request:create', role: '*' },
    { api_name: 'booking_request:delete', role: '*' },
    { api_name: 'booking_request:update', role: '*' },
    { api_name: 'booking_request:delete', role: '*' },
    { api_name: 'booking_request:bookable:read', role: '*' },
    { api_name: 'booking_request:bookable:create', role: '*' },
    { api_name: 'booking_request:bookable:update', role: '*' },
    { api_name: 'event:read', role: '*' },
    { api_name: 'event:create', role: 'dsek.infu' },
    { api_name: 'event:update', role: 'dsek.infu' },
    { api_name: 'event:delete', role: 'dsek.infu' },
    { api_name: 'event:like', role: '_' },
    { api_name: 'news:article:create', role: 'dsek.infu' },
    { api_name: 'news:article:read', role: '*' },
    { api_name: 'news:article:like', role: '_' },
    { api_name: 'news:article:comment', role: '_' },
    { api_name: 'news:article:comment:delete', role: 'dsek.infu' },
    { api_name: 'news:article:update', role: 'dsek.infu' },
    { api_name: 'news:article:delete', role: 'dsek.infu' },
    { api_name: 'news:article:update', role: '*' },
    { api_name: 'fileHandler:news:create', role: 'dsek.infu' },
    { api_name: 'fileHandler:news:read', role: '*' },
    { api_name: 'fileHandler:news:update', role: 'dsek.infu' },
    { api_name: 'fileHandler:news:delete', role: 'dsek.infu' },
    { api_name: 'fileHandler:documents:create', role: 'dsek.infu' },
    { api_name: 'fileHandler:documents:read', role: '*' },
    { api_name: 'fileHandler:documents:update', role: 'dsek.infu' },
    { api_name: 'fileHandler:documents:delete', role: 'dsek.infu' },
    { api_name: 'fileHandler:members:create', role: '_' },
    { api_name: 'fileHandler:members:read', role: '*' },
    { api_name: 'markdowns:read', role: '*' },
    { api_name: 'markdowns:update', role: 'dsek.infu' },
    { api_name: 'markdowns:update', role: 'dsek.cafe' },
    { api_name: 'markdowns:create', role: '*' },
    { api_name: 'tokens:register', role: '*' },
    { api_name: 'tags:read', role: 'dsek' },
    { api_name: 'tags:read', role: '*' },
    { api_name: 'tags:update', role: 'dsek.infu' },
    { api_name: 'tags:create', role: 'dsek.infu' },
    { api_name: 'songs:read', role: '*' },
  ]);
};