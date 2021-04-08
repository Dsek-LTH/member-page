import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Datetime: any;
  _FieldSet: any;
};





export type Query = {
  __typename?: 'Query';
  news?: Maybe<ArticlePagination>;
  article?: Maybe<Article>;
};


export type QueryNewsArgs = {
  page?: Scalars['Int'];
  perPage?: Scalars['Int'];
};


export type QueryArticleArgs = {
  id: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  article?: Maybe<ArticleMutations>;
};

export type Article = {
  __typename?: 'Article';
  id: Scalars['Int'];
  body: Scalars['String'];
  body_en?: Maybe<Scalars['String']>;
  header: Scalars['String'];
  header_en?: Maybe<Scalars['String']>;
  author: Member;
  published_datetime: Scalars['Datetime'];
  latest_edit_datetime?: Maybe<Scalars['Datetime']>;
};

export type PaginationInfo = {
  __typename?: 'PaginationInfo';
  totalPages: Scalars['Int'];
  totalItems: Scalars['Int'];
  page: Scalars['Int'];
  perPage: Scalars['Int'];
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
};

export type ArticlePagination = {
  __typename?: 'ArticlePagination';
  articles: Array<Maybe<Article>>;
  pageInfo: PaginationInfo;
};


export type Member = {
  __typename?: 'Member';
  id: Scalars['Int'];
};

export type ArticleMutations = {
  __typename?: 'ArticleMutations';
  create?: Maybe<Article>;
  update?: Maybe<Article>;
  remove?: Maybe<Article>;
};


export type ArticleMutationsCreateArgs = {
  input: CreateArticle;
};


export type ArticleMutationsUpdateArgs = {
  id: Scalars['Int'];
  input: UpdateArticle;
};


export type ArticleMutationsRemoveArgs = {
  id: Scalars['Int'];
};

export type CreateArticle = {
  header: Scalars['String'];
  header_en?: Maybe<Scalars['String']>;
  body: Scalars['String'];
  body_en?: Maybe<Scalars['String']>;
};

export type UpdateArticle = {
  header?: Maybe<Scalars['String']>;
  header_en?: Maybe<Scalars['String']>;
  body?: Maybe<Scalars['String']>;
  body_en?: Maybe<Scalars['String']>;
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
    

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

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
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

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
  Query: ResolverTypeWrapper<{}>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Mutation: ResolverTypeWrapper<{}>;
  Article: ResolverTypeWrapper<Article>;
  String: ResolverTypeWrapper<Scalars['String']>;
  PaginationInfo: ResolverTypeWrapper<PaginationInfo>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  ArticlePagination: ResolverTypeWrapper<ArticlePagination>;
  Datetime: ResolverTypeWrapper<Scalars['Datetime']>;
  Member: ResolverTypeWrapper<Member>;
  ArticleMutations: ResolverTypeWrapper<ArticleMutations>;
  CreateArticle: CreateArticle;
  UpdateArticle: UpdateArticle;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {};
  Int: Scalars['Int'];
  Mutation: {};
  Article: Article;
  String: Scalars['String'];
  PaginationInfo: PaginationInfo;
  Boolean: Scalars['Boolean'];
  ArticlePagination: ArticlePagination;
  Datetime: Scalars['Datetime'];
  Member: Member;
  ArticleMutations: ArticleMutations;
  CreateArticle: CreateArticle;
  UpdateArticle: UpdateArticle;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  news?: Resolver<Maybe<ResolversTypes['ArticlePagination']>, ParentType, ContextType, RequireFields<QueryNewsArgs, 'page' | 'perPage'>>;
  article?: Resolver<Maybe<ResolversTypes['Article']>, ParentType, ContextType, RequireFields<QueryArticleArgs, 'id'>>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  article?: Resolver<Maybe<ResolversTypes['ArticleMutations']>, ParentType, ContextType>;
}>;

export type ArticleResolvers<ContextType = any, ParentType extends ResolversParentTypes['Article'] = ResolversParentTypes['Article']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Article']>, { __typename: 'Article' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  body?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  body_en?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  header?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  header_en?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  author?: Resolver<ResolversTypes['Member'], ParentType, ContextType>;
  published_datetime?: Resolver<ResolversTypes['Datetime'], ParentType, ContextType>;
  latest_edit_datetime?: Resolver<Maybe<ResolversTypes['Datetime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PaginationInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['PaginationInfo'] = ResolversParentTypes['PaginationInfo']> = ResolversObject<{
  totalPages?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  page?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  perPage?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ArticlePaginationResolvers<ContextType = any, ParentType extends ResolversParentTypes['ArticlePagination'] = ResolversParentTypes['ArticlePagination']> = ResolversObject<{
  articles?: Resolver<Array<Maybe<ResolversTypes['Article']>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PaginationInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DatetimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Datetime'], any> {
  name: 'Datetime';
}

export type MemberResolvers<ContextType = any, ParentType extends ResolversParentTypes['Member'] = ResolversParentTypes['Member']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Member']>, { __typename: 'Member' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;

  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ArticleMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['ArticleMutations'] = ResolversParentTypes['ArticleMutations']> = ResolversObject<{
  create?: Resolver<Maybe<ResolversTypes['Article']>, ParentType, ContextType, RequireFields<ArticleMutationsCreateArgs, 'input'>>;
  update?: Resolver<Maybe<ResolversTypes['Article']>, ParentType, ContextType, RequireFields<ArticleMutationsUpdateArgs, 'id' | 'input'>>;
  remove?: Resolver<Maybe<ResolversTypes['Article']>, ParentType, ContextType, RequireFields<ArticleMutationsRemoveArgs, 'id'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Article?: ArticleResolvers<ContextType>;
  PaginationInfo?: PaginationInfoResolvers<ContextType>;
  ArticlePagination?: ArticlePaginationResolvers<ContextType>;
  Datetime?: GraphQLScalarType;
  Member?: MemberResolvers<ContextType>;
  ArticleMutations?: ArticleMutationsResolvers<ContextType>;
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
