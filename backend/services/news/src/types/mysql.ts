export type DbArticle = {
  id: number,
  header: string,
  body: string,
  author_id: number,
  published_datetime: string,
  latest_edit_datetime?: string,
}

export type DbKeycloak = {
  keycloak_id: string,
  member_id: number,
}