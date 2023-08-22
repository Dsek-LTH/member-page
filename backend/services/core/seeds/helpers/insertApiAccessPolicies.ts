import type { Knex } from 'knex';
import { ApiAccessPolicy } from '~/src/shared';

export default async function insertApiAccessPolicies(knex: Knex) {
  await knex<ApiAccessPolicy>('api_access_policies').insert([
    { api_name: 'core:access:api:create', role: 'dsek.infu' },
    { api_name: 'core:access:api:create', role: '*' },
    { api_name: 'core:access:api:read', role: 'dsek' },
    { api_name: 'core:access:api:read', role: '*' },
    { api_name: 'core:access:api:read', role: '*' },
    { api_name: 'core:access:api:delete', role: '*' },
    { api_name: 'core:access:door:create', role: 'dsek.infu' },
    { api_name: 'core:access:door:create', role: '*' },
    { api_name: 'core:access:door:read', role: '*' },
    { api_name: 'core:access:admin:read', role: 'dsek.infu' },
    { api_name: 'core:committee:read', role: '*' },
    { api_name: 'core:mandate:read', role: '*' },
    { api_name: 'core:mandate:create', role: '_' },
    { api_name: 'core:mandate:delete', role: '_' },
    { api_name: 'core:position:read', role: '*' },
    { api_name: 'core:member:read', role: '*' },
    { api_name: 'core:member:create', role: '*' },
    { api_name: 'core:member:update', role: 'dsek.infu' },
    { api_name: 'core:member:ping', role: '_' },
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
    { api_name: 'news:article:create', role: '_' },
    { api_name: 'news:article:manage', role: 'dsek.infu' },
    { api_name: 'news:article:read', role: '*' },
    { api_name: 'news:article:like', role: '_' },
    { api_name: 'news:article:comment', role: '_' },
    { api_name: 'news:article:comment:delete', role: 'dsek.infu' },
    // { api_name: 'news:article:update', role: 'dsek.infu' },
    // { api_name: 'news:article:delete', role: 'dsek.infu' },
    { api_name: 'fileHandler:news:create', role: 'dsek.infu' },
    { api_name: 'fileHandler:news:read', role: '*' },
    { api_name: 'fileHandler:news:update', role: 'dsek.infu' },
    { api_name: 'fileHandler:news:delete', role: 'dsek.infu' },
    { api_name: 'fileHandler:documents:create', role: 'dsek.infu' },
    { api_name: 'fileHandler:documents:read', role: '*' },
    { api_name: 'fileHandler:documents:update', role: 'dsek.infu' },
    { api_name: 'fileHandler:documents:delete', role: 'dsek.infu' },
    { api_name: 'fileHandler:files:create', role: 'dsek.infu' },
    { api_name: 'fileHandler:files:read', role: '*' },
    { api_name: 'fileHandler:files:update', role: 'dsek.infu' },
    { api_name: 'fileHandler:files:delete', role: 'dsek.infu' },
    { api_name: 'fileHandler:photos:create', role: 'dsek.infu' },
    { api_name: 'fileHandler:photos:read', role: '*' },
    { api_name: 'fileHandler:photos:update', role: 'dsek.infu' },
    { api_name: 'fileHandler:photos:delete', role: 'dsek.infu' },
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
    { api_name: 'core:admin', role: 'dsek.infu' },
    { api_name: 'admin:settings:read', role: 'dsek.infu' },
    { api_name: 'admin:settings:create', role: 'dsek.infu' },
    { api_name: 'admin:settings:update', role: 'dsek.infu' },
    { api_name: 'admin:settings:delete', role: 'dsek.infu' },
    { api_name: 'event:social', role: '_' },
    { api_name: 'event:comment', role: '_' },
    { api_name: 'event:comment:delete', role: 'dsek.infu' },
    { api_name: 'webshop:read', role: '*' },
    { api_name: 'webshop:create', role: 'dsek.infu' },
    { api_name: 'webshop:use', role: '_' },
    { api_name: 'alert', role: 'dsek.infu' },
    { api_name: 'core:mail:alias:update', role: '*' },
    { api_name: 'governing_document:read', role: '*' },
    { api_name: 'governing_document:write', role: '_' },
    { api_name: 'nolla:news', role: 'dsek.infu.dwww' },
    { api_name: 'nolla:news', role: 'dsek.noll' },
    { api_name: 'nolla:events', role: 'dsek.noll' },
    { api_name: 'nolla:events', role: 'dsek.infu.dwww' },
    { api_name: 'nolla:admin', role: 'dsek.infu.dwww' },
    { api_name: 'nolla:admin', role: 'dsek.noll.stab' },
    { api_name: 'nolla:see_stab', role: 'dsek.noll.stab' },
  ]);
}
