import { UUID } from 'dsek-shared';

export type Article = {
  id: UUID,
  header: string,
  header_en?: string,
  body: string,
  body_en?: string,
  author_id: UUID,
  image_url?: string,
  published_datetime: Date,
  latest_edit_datetime?: Date,
}

export type Keycloak = {
  keycloak_id: string,
  member_id: UUID,
}