import { UUID } from '../shared';

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
  published_datetime?: Date,
  latest_edit_datetime?: Date,
  removed_at?: Date,
  slug?: string,
  status: 'draft' | 'approved' | 'rejected', // Status if article is request or not
  created_datetime: Date,
}

export interface ArticleRequest {
  id: UUID,
  article_id?: UUID,
  approved_datetime?: Date,
  rejected_datetime?: Date,
  rejection_reason?: string,
  handled_by?: UUID,
  should_send_notification: boolean,
  notification_body?: string,
  notification_body_en?: string,
}

export interface Author {
  author_id: UUID,
  author_type: 'Member' | 'Mandate',
}

export type Keycloak = {
  keycloak_id: string,
  member_id: UUID,
};

export type Like = {
  id: UUID,
  article_id: UUID,
  member_id: UUID,
};

export type Comment = {
  id: UUID,
  article_id: UUID,
  member_id: UUID,
  content: string,
  published: Date,
};

export type Tag = {
  id: UUID,
  name: string,
  name_en?: string,
  color?: string
  is_default: boolean
};

export type TagBlacklist = {
  id: UUID,
  member_id: UUID,
  tag_id: UUID,
  created_at: Date,
};

export type ArticleTag = {
  id: UUID,
  article_id: UUID,
  tag_id: UUID,
};

// Article & maybe ArticleTag
export type ArticleWithTag = Article & {
  article_id?: string,
  tag_id?: string,
};

export type UploadData = {
  fileUrl: string,
  uploadUrl: string
};

export type Alert = {
  id: UUID,
  severity: 'info' | 'warning' | 'error' | 'success',
  message: string,
  message_en: string,
  created_at: Date,
  removed_at: Date,
};

type Create<T, N extends keyof T, O extends keyof T> = Pick<T, N> & Partial<Omit<T, O>>;
export type CreateArticle = Create<Article, 'header' | 'body' | 'published_datetime' | 'author_id', 'id'>;
