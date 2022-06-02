import { UUID } from 'dsek-shared';

export interface Markdown {
  name: string,
  markdown: string,
  markdown_en?: string,
}

export interface Article {
  id: UUID,
  header: string,
  header_en?: string,
  body: string,
  body_en?: string,
  author_id: UUID,
  author_type: 'Member' | 'Mandate',
  image_url?: string,
  published_datetime: Date,
  latest_edit_datetime?: Date,
}

export type Keycloak = {
  keycloak_id: string,
  member_id: UUID,
}

export type Like = {
  id: UUID,
  article_id: UUID,
  member_id: UUID,
}

export type Token = {
  id: UUID,
  member_id?: UUID,
  expo_token: string
}

export type Tag = {
  id: UUID,
  name: string,
  name_en?: string,
  color?: string
  icon?: string
}

export type ArticleTag = {
  id: UUID,
  article_id: UUID,
  tag_id: UUID,
}

type Create<T, N extends keyof T, O extends keyof T> = Pick<T, N> & Partial<Omit<T, O>>
export type CreateArticle = Create<Article, 'header' | 'body' | 'published_datetime' | 'author_id', 'id'>
