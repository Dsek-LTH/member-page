export interface Article {
  id: number,
  header: string,
  header_en?: string,
  body: string,
  body_en?: string,
  author_id: number,
  image_url?: string,
  published_datetime: Date,
  latest_edit_datetime?: Date,
}

export type Keycloak = {
  keycloak_id: string,
  member_id: number,
}

type Create<T, N extends keyof T, O extends keyof T> = Pick<T, N> & Partial<Omit<T, O>>
export type CreateArticle = Create<Article, 'header' | 'body' | 'published_datetime' | 'author_id', 'id'>