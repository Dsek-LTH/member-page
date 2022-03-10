import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | undefined;
export type InputMaybe<T> = T | undefined;
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
  _FieldSet: any;
  Datetime: any;
  UUID: any;
};

export type Category = {
  __typename?: 'Category';
  description?: Maybe<Scalars['String']>;
  slug: Scalars['String'];
  title: Scalars['String'];
};

export type CategoryMutations = {
  __typename?: 'CategoryMutations';
  create?: Maybe<Category>;
  remove?: Maybe<Category>;
  update?: Maybe<Category>;
};


export type CategoryMutationsCreateArgs = {
  input: CreateCategory;
};


export type CategoryMutationsRemoveArgs = {
  id: Scalars['UUID'];
};


export type CategoryMutationsUpdateArgs = {
  id: Scalars['UUID'];
  input?: InputMaybe<UpdateCategory>;
};

export type CategoryPagination = {
  __typename?: 'CategoryPagination';
  categories: Array<Maybe<Category>>;
  pageInfo: PaginationInfo;
};

export type CreateCategory = {
  description?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
};

export type CreateSong = {
  categorySlug: Scalars['String'];
  lyrics: Scalars['String'];
  melody: Scalars['String'];
  title: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  category?: Maybe<CategoryMutations>;
  song?: Maybe<SongMutations>;
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
  categories?: Maybe<CategoryPagination>;
  category?: Maybe<Category>;
  song?: Maybe<Song>;
  songs?: Maybe<SongPagination>;
};


export type QueryCategoriesArgs = {
  page?: Scalars['Int'];
  perPage?: Scalars['Int'];
};


export type QueryCategoryArgs = {
  slug: Scalars['String'];
};


export type QuerySongArgs = {
  id: Scalars['UUID'];
};


export type QuerySongsArgs = {
  page?: Scalars['Int'];
  perPage?: Scalars['Int'];
};

export type Song = {
  __typename?: 'Song';
  category: Category;
  createdAt: Scalars['Datetime'];
  id: Scalars['UUID'];
  lyrics: Scalars['String'];
  melody: Scalars['String'];
  title: Scalars['String'];
  updatedAt: Scalars['Datetime'];
};

export type SongMutations = {
  __typename?: 'SongMutations';
  create?: Maybe<Song>;
  remove?: Maybe<Song>;
  update?: Maybe<Song>;
};


export type SongMutationsCreateArgs = {
  input: CreateSong;
};


export type SongMutationsRemoveArgs = {
  id: Scalars['UUID'];
};


export type SongMutationsUpdateArgs = {
  id: Scalars['UUID'];
  input?: InputMaybe<UpdateSong>;
};

export type SongPagination = {
  __typename?: 'SongPagination';
  pageInfo: PaginationInfo;
  songs: Array<Maybe<Song>>;
};

export type UpdateCategory = {
  description?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type UpdateSong = {
  categorySlug?: InputMaybe<Scalars['String']>;
  lyrics?: InputMaybe<Scalars['String']>;
  melody?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
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
  Category: ResolverTypeWrapper<Category>;
  String: ResolverTypeWrapper<Scalars['String']>;
  CategoryMutations: ResolverTypeWrapper<CategoryMutations>;
  CategoryPagination: ResolverTypeWrapper<CategoryPagination>;
  CreateCategory: CreateCategory;
  CreateSong: CreateSong;
  Datetime: ResolverTypeWrapper<Scalars['Datetime']>;
  Mutation: ResolverTypeWrapper<{}>;
  PaginationInfo: ResolverTypeWrapper<PaginationInfo>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Query: ResolverTypeWrapper<{}>;
  Song: ResolverTypeWrapper<Song>;
  SongMutations: ResolverTypeWrapper<SongMutations>;
  SongPagination: ResolverTypeWrapper<SongPagination>;
  UUID: ResolverTypeWrapper<Scalars['UUID']>;
  UpdateCategory: UpdateCategory;
  UpdateSong: UpdateSong;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Category: Category;
  String: Scalars['String'];
  CategoryMutations: CategoryMutations;
  CategoryPagination: CategoryPagination;
  CreateCategory: CreateCategory;
  CreateSong: CreateSong;
  Datetime: Scalars['Datetime'];
  Mutation: {};
  PaginationInfo: PaginationInfo;
  Boolean: Scalars['Boolean'];
  Int: Scalars['Int'];
  Query: {};
  Song: Song;
  SongMutations: SongMutations;
  SongPagination: SongPagination;
  UUID: Scalars['UUID'];
  UpdateCategory: UpdateCategory;
  UpdateSong: UpdateSong;
}>;

export type CategoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Category'] = ResolversParentTypes['Category']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Category']>, { __typename: 'Category' } & GraphQLRecursivePick<ParentType, {"slug":true}>, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CategoryMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['CategoryMutations'] = ResolversParentTypes['CategoryMutations']> = ResolversObject<{
  create?: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType, RequireFields<CategoryMutationsCreateArgs, 'input'>>;
  remove?: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType, RequireFields<CategoryMutationsRemoveArgs, 'id'>>;
  update?: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType, RequireFields<CategoryMutationsUpdateArgs, 'id'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CategoryPaginationResolvers<ContextType = any, ParentType extends ResolversParentTypes['CategoryPagination'] = ResolversParentTypes['CategoryPagination']> = ResolversObject<{
  categories?: Resolver<Array<Maybe<ResolversTypes['Category']>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PaginationInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DatetimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Datetime'], any> {
  name: 'Datetime';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  category?: Resolver<Maybe<ResolversTypes['CategoryMutations']>, ParentType, ContextType>;
  song?: Resolver<Maybe<ResolversTypes['SongMutations']>, ParentType, ContextType>;
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
  categories?: Resolver<Maybe<ResolversTypes['CategoryPagination']>, ParentType, ContextType, RequireFields<QueryCategoriesArgs, 'page' | 'perPage'>>;
  category?: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType, RequireFields<QueryCategoryArgs, 'slug'>>;
  song?: Resolver<Maybe<ResolversTypes['Song']>, ParentType, ContextType, RequireFields<QuerySongArgs, 'id'>>;
  songs?: Resolver<Maybe<ResolversTypes['SongPagination']>, ParentType, ContextType, RequireFields<QuerySongsArgs, 'page' | 'perPage'>>;
}>;

export type SongResolvers<ContextType = any, ParentType extends ResolversParentTypes['Song'] = ResolversParentTypes['Song']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Song']>, { __typename: 'Song' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  category?: Resolver<ResolversTypes['Category'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Datetime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  lyrics?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  melody?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Datetime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SongMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['SongMutations'] = ResolversParentTypes['SongMutations']> = ResolversObject<{
  create?: Resolver<Maybe<ResolversTypes['Song']>, ParentType, ContextType, RequireFields<SongMutationsCreateArgs, 'input'>>;
  remove?: Resolver<Maybe<ResolversTypes['Song']>, ParentType, ContextType, RequireFields<SongMutationsRemoveArgs, 'id'>>;
  update?: Resolver<Maybe<ResolversTypes['Song']>, ParentType, ContextType, RequireFields<SongMutationsUpdateArgs, 'id'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SongPaginationResolvers<ContextType = any, ParentType extends ResolversParentTypes['SongPagination'] = ResolversParentTypes['SongPagination']> = ResolversObject<{
  pageInfo?: Resolver<ResolversTypes['PaginationInfo'], ParentType, ContextType>;
  songs?: Resolver<Array<Maybe<ResolversTypes['Song']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface UuidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['UUID'], any> {
  name: 'UUID';
}

export type Resolvers<ContextType = any> = ResolversObject<{
  Category?: CategoryResolvers<ContextType>;
  CategoryMutations?: CategoryMutationsResolvers<ContextType>;
  CategoryPagination?: CategoryPaginationResolvers<ContextType>;
  Datetime?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  PaginationInfo?: PaginationInfoResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Song?: SongResolvers<ContextType>;
  SongMutations?: SongMutationsResolvers<ContextType>;
  SongPagination?: SongPaginationResolvers<ContextType>;
  UUID?: GraphQLScalarType;
}>;

