import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
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
  songs?: Maybe<Array<Song>>;
};


export type QuerySongsArgs = {
  filter?: Maybe<SongFilter>;
};

export type Mutation = {
  __typename?: 'Mutation';
  song?: Maybe<SongMutations>;
};

export type Member = {
  __typename?: 'Member';
  id: Scalars['Int'];
};

export type Writer = {
  __typename?: 'Writer';
  name?: Maybe<Scalars['String']>;
};

export type Person = Writer | Member;


export type Song = {
  __typename?: 'Song';
  id: Scalars['Int'];
  name: Scalars['String'];
  lyrics: Scalars['String'];
  writer?: Maybe<Person>;
  category?: Maybe<Scalars['String']>;
  melody?: Maybe<Scalars['String']>;
  created?: Maybe<Scalars['Datetime']>;
  edited?: Maybe<Scalars['Datetime']>;
};

export type SongFilter = {
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  writer_id?: Maybe<Scalars['Int']>;
  writer_name?: Maybe<Scalars['String']>;
  category?: Maybe<Scalars['String']>;
  melody?: Maybe<Scalars['String']>;
};

export type SongMutations = {
  __typename?: 'SongMutations';
  create?: Maybe<Scalars['Boolean']>;
  update?: Maybe<Scalars['Boolean']>;
  remove?: Maybe<Scalars['Boolean']>;
};


export type SongMutationsCreateArgs = {
  input: CreatePosition;
};


export type SongMutationsUpdateArgs = {
  id: Scalars['Int'];
  input: UpdatePosition;
};


export type SongMutationsRemoveArgs = {
  id: Scalars['Int'];
};

export type CreatePosition = {
  name: Scalars['String'];
  lyrics: Scalars['String'];
  writer_id?: Maybe<Scalars['Int']>;
  writer_name?: Maybe<Scalars['String']>;
  category?: Maybe<Scalars['String']>;
  melody?: Maybe<Scalars['String']>;
};

export type UpdatePosition = {
  name?: Maybe<Scalars['String']>;
  lyrics?: Maybe<Scalars['String']>;
  writer_id?: Maybe<Scalars['Int']>;
  writer_name?: Maybe<Scalars['String']>;
  category?: Maybe<Scalars['String']>;
  melody?: Maybe<Scalars['String']>;
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
  Mutation: ResolverTypeWrapper<{}>;
  Member: ResolverTypeWrapper<Member>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Writer: ResolverTypeWrapper<Writer>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Person: ResolversTypes['Writer'] | ResolversTypes['Member'];
  Datetime: ResolverTypeWrapper<Scalars['Datetime']>;
  Song: ResolverTypeWrapper<Omit<Song, 'writer'> & { writer?: Maybe<ResolversTypes['Person']> }>;
  SongFilter: SongFilter;
  SongMutations: ResolverTypeWrapper<SongMutations>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CreatePosition: CreatePosition;
  UpdatePosition: UpdatePosition;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {};
  Mutation: {};
  Member: Member;
  Int: Scalars['Int'];
  Writer: Writer;
  String: Scalars['String'];
  Person: ResolversParentTypes['Writer'] | ResolversParentTypes['Member'];
  Datetime: Scalars['Datetime'];
  Song: Omit<Song, 'writer'> & { writer?: Maybe<ResolversParentTypes['Person']> };
  SongFilter: SongFilter;
  SongMutations: SongMutations;
  Boolean: Scalars['Boolean'];
  CreatePosition: CreatePosition;
  UpdatePosition: UpdatePosition;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  songs?: Resolver<Maybe<Array<ResolversTypes['Song']>>, ParentType, ContextType, RequireFields<QuerySongsArgs, never>>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  song?: Resolver<Maybe<ResolversTypes['SongMutations']>, ParentType, ContextType>;
}>;

export type MemberResolvers<ContextType = any, ParentType extends ResolversParentTypes['Member'] = ResolversParentTypes['Member']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Member']>, { __typename: 'Member' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;

  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type WriterResolvers<ContextType = any, ParentType extends ResolversParentTypes['Writer'] = ResolversParentTypes['Writer']> = ResolversObject<{
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PersonResolvers<ContextType = any, ParentType extends ResolversParentTypes['Person'] = ResolversParentTypes['Person']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Writer' | 'Member', ParentType, ContextType>;
}>;

export interface DatetimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Datetime'], any> {
  name: 'Datetime';
}

export type SongResolvers<ContextType = any, ParentType extends ResolversParentTypes['Song'] = ResolversParentTypes['Song']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Song']>, { __typename: 'Song' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lyrics?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  writer?: Resolver<Maybe<ResolversTypes['Person']>, ParentType, ContextType>;
  category?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  melody?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  created?: Resolver<Maybe<ResolversTypes['Datetime']>, ParentType, ContextType>;
  edited?: Resolver<Maybe<ResolversTypes['Datetime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SongMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['SongMutations'] = ResolversParentTypes['SongMutations']> = ResolversObject<{
  create?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<SongMutationsCreateArgs, 'input'>>;
  update?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<SongMutationsUpdateArgs, 'id' | 'input'>>;
  remove?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<SongMutationsRemoveArgs, 'id'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Member?: MemberResolvers<ContextType>;
  Writer?: WriterResolvers<ContextType>;
  Person?: PersonResolvers<ContextType>;
  Datetime?: GraphQLScalarType;
  Song?: SongResolvers<ContextType>;
  SongMutations?: SongMutationsResolvers<ContextType>;
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
