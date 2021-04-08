export type DbArticle = {
  id: number,
  header: string,
  header_en?: string,
  body: string,
  body_en?: string,
  author_id: number,
  published_datetime: Date,
  latest_edit_datetime?: Date,
}

export type DbKeycloak = {
  keycloak_id: string,
  member_id: number,
}