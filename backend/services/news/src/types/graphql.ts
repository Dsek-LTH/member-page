import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | undefined;
export type InputMaybe<T> = T | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Datetime: any;
  UUID: any;
  Url: any;
  _FieldSet: any;
};

export type Article = {
  __typename?: 'Article';
  author: Author;
  body: Scalars['String'];
  bodyEn?: Maybe<Scalars['String']>;
  header: Scalars['String'];
  headerEn?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  imageUrl?: Maybe<Scalars['Url']>;
  isLikedByMe: Scalars['Boolean'];
  latestEditDatetime?: Maybe<Scalars['Datetime']>;
  likes: Scalars['Int'];
  publishedDatetime: Scalars['Datetime'];
  tags: Array<Maybe<Tag>>;
};

export type ArticleMutations = {
  __typename?: 'ArticleMutations';
  create?: Maybe<CreateArticlePayload>;
  dislike?: Maybe<ArticlePayload>;
  like?: Maybe<ArticlePayload>;
  presignedPutUrl?: Maybe<Scalars['String']>;
  remove?: Maybe<ArticlePayload>;
  update?: Maybe<UpdateArticlePayload>;
};


export type ArticleMutationsCreateArgs = {
  input: CreateArticle;
};


export type ArticleMutationsDislikeArgs = {
  id: Scalars['UUID'];
};


export type ArticleMutationsLikeArgs = {
  id: Scalars['UUID'];
};


export type ArticleMutationsPresignedPutUrlArgs = {
  fileName: Scalars['String'];
};


export type ArticleMutationsRemoveArgs = {
  id: Scalars['UUID'];
};


export type ArticleMutationsUpdateArgs = {
  id: Scalars['UUID'];
  input: UpdateArticle;
};

export type ArticlePagination = {
  __typename?: 'ArticlePagination';
  articles: Array<Maybe<Article>>;
  pageInfo: PaginationInfo;
};

export type ArticlePayload = {
  __typename?: 'ArticlePayload';
  article: Article;
};

export type Author = Mandate | Member;

export type CreateArticle = {
  body: Scalars['String'];
  bodyEn?: InputMaybe<Scalars['String']>;
  header: Scalars['String'];
  headerEn?: InputMaybe<Scalars['String']>;
  imageName?: InputMaybe<Scalars['String']>;
  mandateId?: InputMaybe<Scalars['UUID']>;
  sendNotification?: InputMaybe<Scalars['Boolean']>;
  tagIds?: InputMaybe<Array<Scalars['UUID']>>;
};

export type CreateArticlePayload = {
  __typename?: 'CreateArticlePayload';
  article: Article;
  uploadUrl?: Maybe<Scalars['Url']>;
};

export type CreateMarkdown = {
  markdown?: InputMaybe<Scalars['String']>;
  markdown_en?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
};

export type CreateTag = {
  color?: InputMaybe<Scalars['String']>;
  icon?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  nameEn?: InputMaybe<Scalars['String']>;
};

export type Mandate = {
  __typename?: 'Mandate';
  id: Scalars['UUID'];
};

export type Markdown = {
  __typename?: 'Markdown';
  markdown: Scalars['String'];
  markdown_en?: Maybe<Scalars['String']>;
  name: Scalars['String'];
};

export type MarkdownMutations = {
  __typename?: 'MarkdownMutations';
  create?: Maybe<Markdown>;
  update?: Maybe<Markdown>;
};


export type MarkdownMutationsCreateArgs = {
  input: CreateMarkdown;
};


export type MarkdownMutationsUpdateArgs = {
  input: UpdateMarkdown;
  name: Scalars['String'];
};

export type MarkdownPayload = {
  __typename?: 'MarkdownPayload';
  markdown: Markdown;
};

export type Member = {
  __typename?: 'Member';
  id: Scalars['UUID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  article?: Maybe<ArticleMutations>;
  markdown?: Maybe<MarkdownMutations>;
  tags?: Maybe<TagMutations>;
  token?: Maybe<TokenMutations>;
};

export type PaginationInfo = {
  __typename?: 'PaginationInfo';
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  page: Scalars['Int'];
  perPage: Scalars['Int'];
  totalItems: Scalars['Int'];
  totalPages: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  article?: Maybe<Article>;
  markdown?: Maybe<Markdown>;
  markdowns: Array<Maybe<Markdown>>;
  news?: Maybe<ArticlePagination>;
  tag?: Maybe<Tag>;
  tags: Array<Maybe<Tag>>;
  token?: Maybe<Token>;
};


export type QueryArticleArgs = {
  id: Scalars['UUID'];
};


export type QueryMarkdownArgs = {
  name: Scalars['String'];
};


export type QueryNewsArgs = {
  page?: Scalars['Int'];
  perPage?: Scalars['Int'];
};


export type QueryTagArgs = {
  id: Scalars['UUID'];
};


export type QueryTokenArgs = {
  expoToken: Scalars['String'];
};

export type Tag = {
  __typename?: 'Tag';
  color?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  name: Scalars['String'];
  nameEn: Scalars['String'];
};

export type TagMutations = {
  __typename?: 'TagMutations';
  create?: Maybe<Tag>;
  update?: Maybe<Tag>;
};


export type TagMutationsCreateArgs = {
  input: CreateTag;
};


export type TagMutationsUpdateArgs = {
  id: Scalars['UUID'];
  input: UpdateTag;
};

export type Token = {
  __typename?: 'Token';
  expoToken: Scalars['String'];
  id: Scalars['UUID'];
  memberId?: Maybe<Scalars['UUID']>;
  tagSubscriptions: Array<Maybe<Tag>>;
};

export type TokenMutations = {
  __typename?: 'TokenMutations';
  register?: Maybe<Token>;
  subscribe?: Maybe<Array<Scalars['UUID']>>;
  unsubscribe?: Maybe<Scalars['Int']>;
};


export type TokenMutationsRegisterArgs = {
  expoToken: Scalars['String'];
};


export type TokenMutationsSubscribeArgs = {
  expoToken: Scalars['String'];
  tagIds: Array<Scalars['UUID']>;
};


export type TokenMutationsUnsubscribeArgs = {
  expoToken: Scalars['String'];
  tagIds: Array<Scalars['UUID']>;
};

export type UpdateArticle = {
  body?: InputMaybe<Scalars['String']>;
  bodyEn?: InputMaybe<Scalars['String']>;
  header?: InputMaybe<Scalars['String']>;
  headerEn?: InputMaybe<Scalars['String']>;
  imageName?: InputMaybe<Scalars['String']>;
  mandateId?: InputMaybe<Scalars['UUID']>;
  tagIds?: InputMaybe<Array<Scalars['UUID']>>;
};

export type UpdateArticlePayload = {
  __typename?: 'UpdateArticlePayload';
  article: Article;
  uploadUrl?: Maybe<Scalars['Url']>;
};

export type UpdateMarkdown = {
  markdown?: InputMaybe<Scalars['String']>;
  markdown_en?: InputMaybe<Scalars['String']>;
};

export type UpdateTag = {
  color?: InputMaybe<Scalars['String']>;
  icon?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  nameEn?: InputMaybe<Scalars['String']>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Article: ResolverTypeWrapper<Omit<Article, 'author'> & { author: ResolversTypes['Author'] }>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  ArticleMutations: ResolverTypeWrapper<ArticleMutations>;
  ArticlePagination: ResolverTypeWrapper<ArticlePagination>;
  ArticlePayload: ResolverTypeWrapper<ArticlePayload>;
  Author: ResolversTypes['Mandate'] | ResolversTypes['Member'];
  CreateArticle: CreateArticle;
  CreateArticlePayload: ResolverTypeWrapper<CreateArticlePayload>;
  CreateMarkdown: CreateMarkdown;
  CreateTag: CreateTag;
  Datetime: ResolverTypeWrapper<Scalars['Datetime']>;
  Mandate: ResolverTypeWrapper<Mandate>;
  Markdown: ResolverTypeWrapper<Markdown>;
  MarkdownMutations: ResolverTypeWrapper<MarkdownMutations>;
  MarkdownPayload: ResolverTypeWrapper<MarkdownPayload>;
  Member: ResolverTypeWrapper<Member>;
  Mutation: ResolverTypeWrapper<{}>;
  PaginationInfo: ResolverTypeWrapper<PaginationInfo>;
  Query: ResolverTypeWrapper<{}>;
  Tag: ResolverTypeWrapper<Tag>;
  TagMutations: ResolverTypeWrapper<TagMutations>;
  Token: ResolverTypeWrapper<Token>;
  TokenMutations: ResolverTypeWrapper<TokenMutations>;
  UUID: ResolverTypeWrapper<Scalars['UUID']>;
  UpdateArticle: UpdateArticle;
  UpdateArticlePayload: ResolverTypeWrapper<UpdateArticlePayload>;
  UpdateMarkdown: UpdateMarkdown;
  UpdateTag: UpdateTag;
  Url: ResolverTypeWrapper<Scalars['Url']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Article: Omit<Article, 'author'> & { author: ResolversParentTypes['Author'] };
  String: Scalars['String'];
  Boolean: Scalars['Boolean'];
  Int: Scalars['Int'];
  ArticleMutations: ArticleMutations;
  ArticlePagination: ArticlePagination;
  ArticlePayload: ArticlePayload;
  Author: ResolversParentTypes['Mandate'] | ResolversParentTypes['Member'];
  CreateArticle: CreateArticle;
  CreateArticlePayload: CreateArticlePayload;
  CreateMarkdown: CreateMarkdown;
  CreateTag: CreateTag;
  Datetime: Scalars['Datetime'];
  Mandate: Mandate;
  Markdown: Markdown;
  MarkdownMutations: MarkdownMutations;
  MarkdownPayload: MarkdownPayload;
  Member: Member;
  Mutation: {};
  PaginationInfo: PaginationInfo;
  Query: {};
  Tag: Tag;
  TagMutations: TagMutations;
  Token: Token;
  TokenMutations: TokenMutations;
  UUID: Scalars['UUID'];
  UpdateArticle: UpdateArticle;
  UpdateArticlePayload: UpdateArticlePayload;
  UpdateMarkdown: UpdateMarkdown;
  UpdateTag: UpdateTag;
  Url: Scalars['Url'];
}>;

export type ArticleResolvers<ContextType = any, ParentType extends ResolversParentTypes['Article'] = ResolversParentTypes['Article']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Article']>, { __typename: 'Article' } & GraphQLRecursivePick<ParentType, { "id": true }>, ContextType>;
  author?: Resolver<ResolversTypes['Author'], ParentType, ContextType>;
  body?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  bodyEn?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  header?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  headerEn?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  imageUrl?: Resolver<Maybe<ResolversTypes['Url']>, ParentType, ContextType>;
  isLikedByMe?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  latestEditDatetime?: Resolver<Maybe<ResolversTypes['Datetime']>, ParentType, ContextType>;
  likes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  publishedDatetime?: Resolver<ResolversTypes['Datetime'], ParentType, ContextType>;
  tags?: Resolver<Array<Maybe<ResolversTypes['Tag']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ArticleMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['ArticleMutations'] = ResolversParentTypes['ArticleMutations']> = ResolversObject<{
  create?: Resolver<Maybe<ResolversTypes['CreateArticlePayload']>, ParentType, ContextType, RequireFields<ArticleMutationsCreateArgs, 'input'>>;
  dislike?: Resolver<Maybe<ResolversTypes['ArticlePayload']>, ParentType, ContextType, RequireFields<ArticleMutationsDislikeArgs, 'id'>>;
  like?: Resolver<Maybe<ResolversTypes['ArticlePayload']>, ParentType, ContextType, RequireFields<ArticleMutationsLikeArgs, 'id'>>;
  presignedPutUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<ArticleMutationsPresignedPutUrlArgs, 'fileName'>>;
  remove?: Resolver<Maybe<ResolversTypes['ArticlePayload']>, ParentType, ContextType, RequireFields<ArticleMutationsRemoveArgs, 'id'>>;
  update?: Resolver<Maybe<ResolversTypes['UpdateArticlePayload']>, ParentType, ContextType, RequireFields<ArticleMutationsUpdateArgs, 'id' | 'input'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ArticlePaginationResolvers<ContextType = any, ParentType extends ResolversParentTypes['ArticlePagination'] = ResolversParentTypes['ArticlePagination']> = ResolversObject<{
  articles?: Resolver<Array<Maybe<ResolversTypes['Article']>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PaginationInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ArticlePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['ArticlePayload'] = ResolversParentTypes['ArticlePayload']> = ResolversObject<{
  article?: Resolver<ResolversTypes['Article'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Author'] = ResolversParentTypes['Author']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Mandate' | 'Member', ParentType, ContextType>;
}>;

export type CreateArticlePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateArticlePayload'] = ResolversParentTypes['CreateArticlePayload']> = ResolversObject<{
  article?: Resolver<ResolversTypes['Article'], ParentType, ContextType>;
  uploadUrl?: Resolver<Maybe<ResolversTypes['Url']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DatetimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Datetime'], any> {
  name: 'Datetime';
}

export type MandateResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mandate'] = ResolversParentTypes['Mandate']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Mandate']>, { __typename: 'Mandate' } & GraphQLRecursivePick<ParentType, { "id": true }>, ContextType>;

  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MarkdownResolvers<ContextType = any, ParentType extends ResolversParentTypes['Markdown'] = ResolversParentTypes['Markdown']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Markdown']>, { __typename: 'Markdown' } & GraphQLRecursivePick<ParentType, { "name": true }>, ContextType>;
  markdown?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  markdown_en?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MarkdownMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['MarkdownMutations'] = ResolversParentTypes['MarkdownMutations']> = ResolversObject<{
  create?: Resolver<Maybe<ResolversTypes['Markdown']>, ParentType, ContextType, RequireFields<MarkdownMutationsCreateArgs, 'input'>>;
  update?: Resolver<Maybe<ResolversTypes['Markdown']>, ParentType, ContextType, RequireFields<MarkdownMutationsUpdateArgs, 'input' | 'name'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MarkdownPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['MarkdownPayload'] = ResolversParentTypes['MarkdownPayload']> = ResolversObject<{
  markdown?: Resolver<ResolversTypes['Markdown'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MemberResolvers<ContextType = any, ParentType extends ResolversParentTypes['Member'] = ResolversParentTypes['Member']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Member']>, { __typename: 'Member' } & GraphQLRecursivePick<ParentType, { "id": true }>, ContextType>;

  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  article?: Resolver<Maybe<ResolversTypes['ArticleMutations']>, ParentType, ContextType>;
  markdown?: Resolver<Maybe<ResolversTypes['MarkdownMutations']>, ParentType, ContextType>;
  tags?: Resolver<Maybe<ResolversTypes['TagMutations']>, ParentType, ContextType>;
  token?: Resolver<Maybe<ResolversTypes['TokenMutations']>, ParentType, ContextType>;
}>;

export type PaginationInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['PaginationInfo'] = ResolversParentTypes['PaginationInfo']> = ResolversObject<{
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  page?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  perPage?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalPages?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  article?: Resolver<Maybe<ResolversTypes['Article']>, ParentType, ContextType, RequireFields<QueryArticleArgs, 'id'>>;
  markdown?: Resolver<Maybe<ResolversTypes['Markdown']>, ParentType, ContextType, RequireFields<QueryMarkdownArgs, 'name'>>;
  markdowns?: Resolver<Array<Maybe<ResolversTypes['Markdown']>>, ParentType, ContextType>;
  news?: Resolver<Maybe<ResolversTypes['ArticlePagination']>, ParentType, ContextType, RequireFields<QueryNewsArgs, 'page' | 'perPage'>>;
  tag?: Resolver<Maybe<ResolversTypes['Tag']>, ParentType, ContextType, RequireFields<QueryTagArgs, 'id'>>;
  tags?: Resolver<Array<Maybe<ResolversTypes['Tag']>>, ParentType, ContextType>;
  token?: Resolver<Maybe<ResolversTypes['Token']>, ParentType, ContextType, RequireFields<QueryTokenArgs, 'expoToken'>>;
}>;

export type TagResolvers<ContextType = any, ParentType extends ResolversParentTypes['Tag'] = ResolversParentTypes['Tag']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Tag']>, { __typename: 'Tag' } & GraphQLRecursivePick<ParentType, { "id": true }>, ContextType>;
  color?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nameEn?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TagMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['TagMutations'] = ResolversParentTypes['TagMutations']> = ResolversObject<{
  create?: Resolver<Maybe<ResolversTypes['Tag']>, ParentType, ContextType, RequireFields<TagMutationsCreateArgs, 'input'>>;
  update?: Resolver<Maybe<ResolversTypes['Tag']>, ParentType, ContextType, RequireFields<TagMutationsUpdateArgs, 'id' | 'input'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TokenResolvers<ContextType = any, ParentType extends ResolversParentTypes['Token'] = ResolversParentTypes['Token']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Token']>, { __typename: 'Token' } & GraphQLRecursivePick<ParentType, { "id": true }>, ContextType>;
  expoToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  memberId?: Resolver<Maybe<ResolversTypes['UUID']>, ParentType, ContextType>;
  tagSubscriptions?: Resolver<Array<Maybe<ResolversTypes['Tag']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TokenMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['TokenMutations'] = ResolversParentTypes['TokenMutations']> = ResolversObject<{
  register?: Resolver<Maybe<ResolversTypes['Token']>, ParentType, ContextType, RequireFields<TokenMutationsRegisterArgs, 'expoToken'>>;
  subscribe?: Resolver<Maybe<Array<ResolversTypes['UUID']>>, ParentType, ContextType, RequireFields<TokenMutationsSubscribeArgs, 'expoToken' | 'tagIds'>>;
  unsubscribe?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, RequireFields<TokenMutationsUnsubscribeArgs, 'expoToken' | 'tagIds'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface UuidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['UUID'], any> {
  name: 'UUID';
}

export type UpdateArticlePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateArticlePayload'] = ResolversParentTypes['UpdateArticlePayload']> = ResolversObject<{
  article?: Resolver<ResolversTypes['Article'], ParentType, ContextType>;
  uploadUrl?: Resolver<Maybe<ResolversTypes['Url']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface UrlScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Url'], any> {
  name: 'Url';
}

export type Resolvers<ContextType = any> = ResolversObject<{
  Query?: QueryResolvers<ContextType>;
  Tag?: TagResolvers<ContextType>;
  TagMutations?: TagMutationsResolvers<ContextType>;
  Token?: TokenResolvers<ContextType>;
  TokenMutations?: TokenMutationsResolvers<ContextType>;
  UUID?: GraphQLScalarType;
  UpdateArticlePayload?: UpdateArticlePayloadResolvers<ContextType>;
  Url?: GraphQLScalarType;
}>;

