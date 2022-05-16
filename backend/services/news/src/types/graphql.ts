import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | undefined;
export type InputMaybe<T> = T | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  _FieldSet: any;
  Datetime: any;
  UUID: any;
  Url: any;
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

export type Token = {
  __typename?: 'Token';
  expo_token: Scalars['String'];
  id: Scalars['UUID'];
  member_id?: Maybe<Scalars['UUID']>;
};

export type TokenMutations = {
  __typename?: 'TokenMutations';
  register?: Maybe<Token>;
};


export type TokenMutationsRegisterArgs = {
  expo_token: Scalars['String'];
};

export type UpdateArticle = {
  body?: InputMaybe<Scalars['String']>;
  bodyEn?: InputMaybe<Scalars['String']>;
  header?: InputMaybe<Scalars['String']>;
  headerEn?: InputMaybe<Scalars['String']>;
  imageName?: InputMaybe<Scalars['String']>;
  mandateId?: InputMaybe<Scalars['UUID']>;
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

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ReferenceResolver<TResult, TReference, TContext> = (
      reference: TReference,
      context: TContext,
      info: GraphQLResolveInfo
    ) => Promise<TResult> | TResult;

      type ScalarCheck<T, S> = S extends true ? T : NullableCheck<T, S>;
      type NullableCheck<T, S> = Maybe<T> extends T ? Maybe<ListCheck<NonNullable<T>, S>> : ListCheck<T, S>;
      type ListCheck<T, S> = T extends (infer U)[] ? NullableCheck<U, S>[] : GraphQLRecursivePick<T, S>;
      export type GraphQLRecursivePick<T, S> = { [K in keyof T & keyof S]: ScalarCheck<T[K], S[K]> };
    

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
  Datetime: ResolverTypeWrapper<Scalars['Datetime']>;
  Mandate: ResolverTypeWrapper<Mandate>;
  Markdown: ResolverTypeWrapper<Markdown>;
  MarkdownMutations: ResolverTypeWrapper<MarkdownMutations>;
  MarkdownPayload: ResolverTypeWrapper<MarkdownPayload>;
  Member: ResolverTypeWrapper<Member>;
  Mutation: ResolverTypeWrapper<{}>;
  PaginationInfo: ResolverTypeWrapper<PaginationInfo>;
  Query: ResolverTypeWrapper<{}>;
  Token: ResolverTypeWrapper<Token>;
  TokenMutations: ResolverTypeWrapper<TokenMutations>;
  UUID: ResolverTypeWrapper<Scalars['UUID']>;
  UpdateArticle: UpdateArticle;
  UpdateArticlePayload: ResolverTypeWrapper<UpdateArticlePayload>;
  UpdateMarkdown: UpdateMarkdown;
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
  Datetime: Scalars['Datetime'];
  Mandate: Mandate;
  Markdown: Markdown;
  MarkdownMutations: MarkdownMutations;
  MarkdownPayload: MarkdownPayload;
  Member: Member;
  Mutation: {};
  PaginationInfo: PaginationInfo;
  Query: {};
  Token: Token;
  TokenMutations: TokenMutations;
  UUID: Scalars['UUID'];
  UpdateArticle: UpdateArticle;
  UpdateArticlePayload: UpdateArticlePayload;
  UpdateMarkdown: UpdateMarkdown;
  Url: Scalars['Url'];
}>;

export type ArticleResolvers<ContextType = any, ParentType extends ResolversParentTypes['Article'] = ResolversParentTypes['Article']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Article']>, { __typename: 'Article' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
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
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Mandate']>, { __typename: 'Mandate' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;

  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MarkdownResolvers<ContextType = any, ParentType extends ResolversParentTypes['Markdown'] = ResolversParentTypes['Markdown']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Markdown']>, { __typename: 'Markdown' } & GraphQLRecursivePick<ParentType, {"name":true}>, ContextType>;
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
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Member']>, { __typename: 'Member' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;

  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  article?: Resolver<Maybe<ResolversTypes['ArticleMutations']>, ParentType, ContextType>;
  markdown?: Resolver<Maybe<ResolversTypes['MarkdownMutations']>, ParentType, ContextType>;
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
}>;

export type TokenResolvers<ContextType = any, ParentType extends ResolversParentTypes['Token'] = ResolversParentTypes['Token']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Token']>, { __typename: 'Token' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  expo_token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  member_id?: Resolver<Maybe<ResolversTypes['UUID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TokenMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['TokenMutations'] = ResolversParentTypes['TokenMutations']> = ResolversObject<{
  register?: Resolver<Maybe<ResolversTypes['Token']>, ParentType, ContextType, RequireFields<TokenMutationsRegisterArgs, 'expo_token'>>;
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
  Article?: ArticleResolvers<ContextType>;
  ArticleMutations?: ArticleMutationsResolvers<ContextType>;
  ArticlePagination?: ArticlePaginationResolvers<ContextType>;
  ArticlePayload?: ArticlePayloadResolvers<ContextType>;
  Author?: AuthorResolvers<ContextType>;
  CreateArticlePayload?: CreateArticlePayloadResolvers<ContextType>;
  Datetime?: GraphQLScalarType;
  Mandate?: MandateResolvers<ContextType>;
  Markdown?: MarkdownResolvers<ContextType>;
  MarkdownMutations?: MarkdownMutationsResolvers<ContextType>;
  MarkdownPayload?: MarkdownPayloadResolvers<ContextType>;
  Member?: MemberResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PaginationInfo?: PaginationInfoResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Token?: TokenResolvers<ContextType>;
  TokenMutations?: TokenMutationsResolvers<ContextType>;
  UUID?: GraphQLScalarType;
  UpdateArticlePayload?: UpdateArticlePayloadResolvers<ContextType>;
  Url?: GraphQLScalarType;
}>;

