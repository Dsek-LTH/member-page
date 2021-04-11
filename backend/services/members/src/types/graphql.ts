import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  _FieldSet: any;
};





export type Query = {
  __typename?: 'Query';
  me?: Maybe<Member>;
  members: Array<Member>;
  member?: Maybe<Member>;
  positions: Array<Position>;
  committees: Array<Committee>;
};


export type QueryMembersArgs = {
  filter?: Maybe<MemberFilter>;
};


export type QueryMemberArgs = {
  id: Scalars['Int'];
};


export type QueryPositionsArgs = {
  filter?: Maybe<PositionFilter>;
};


export type QueryCommitteesArgs = {
  filter?: Maybe<CommitteeFilter>;
};

export type Mutation = {
  __typename?: 'Mutation';
  member?: Maybe<MemberMutations>;
  position?: Maybe<PositionMutations>;
  committee?: Maybe<CommitteeMutations>;
};

export type Member = {
  __typename?: 'Member';
  id: Scalars['Int'];
  student_id?: Maybe<Scalars['String']>;
  first_name?: Maybe<Scalars['String']>;
  nickname?: Maybe<Scalars['String']>;
  last_name?: Maybe<Scalars['String']>;
  class_programme?: Maybe<Scalars['String']>;
  class_year?: Maybe<Scalars['Int']>;
  picture_path?: Maybe<Scalars['String']>;
};

export type Position = {
  __typename?: 'Position';
  id: Scalars['Int'];
  name: Scalars['String'];
  committee?: Maybe<Committee>;
};

export type Committee = {
  __typename?: 'Committee';
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type MemberFilter = {
  id?: Maybe<Scalars['Int']>;
  student_id?: Maybe<Scalars['String']>;
  first_name?: Maybe<Scalars['String']>;
  nickname?: Maybe<Scalars['String']>;
  last_name?: Maybe<Scalars['String']>;
  class_programme?: Maybe<Scalars['String']>;
  class_year?: Maybe<Scalars['Int']>;
};

export type CommitteeFilter = {
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
};

export type PositionFilter = {
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  committee_id?: Maybe<Scalars['Int']>;
};

export type MemberMutations = {
  __typename?: 'MemberMutations';
  create?: Maybe<Member>;
  update?: Maybe<Member>;
  remove?: Maybe<Member>;
};


export type MemberMutationsCreateArgs = {
  input: CreateMember;
};


export type MemberMutationsUpdateArgs = {
  id: Scalars['Int'];
  input: UpdateMember;
};


export type MemberMutationsRemoveArgs = {
  id: Scalars['Int'];
};

export type PositionMutations = {
  __typename?: 'PositionMutations';
  create?: Maybe<Scalars['Boolean']>;
  update?: Maybe<Scalars['Boolean']>;
  remove?: Maybe<Scalars['Boolean']>;
};


export type PositionMutationsCreateArgs = {
  input: CreatePosition;
};


export type PositionMutationsUpdateArgs = {
  id: Scalars['Int'];
  input: UpdatePosition;
};


export type PositionMutationsRemoveArgs = {
  id: Scalars['Int'];
};

export type CommitteeMutations = {
  __typename?: 'CommitteeMutations';
  create?: Maybe<Scalars['Boolean']>;
  update?: Maybe<Scalars['Boolean']>;
  remove?: Maybe<Scalars['Boolean']>;
};


export type CommitteeMutationsCreateArgs = {
  input: CreateCommittee;
};


export type CommitteeMutationsUpdateArgs = {
  id: Scalars['Int'];
  input: UpdateCommittee;
};


export type CommitteeMutationsRemoveArgs = {
  id: Scalars['Int'];
};

export type CreateMember = {
  student_id: Scalars['String'];
  first_name: Scalars['String'];
  nickname?: Maybe<Scalars['String']>;
  last_name: Scalars['String'];
  class_programme: Scalars['String'];
  class_year: Scalars['Int'];
  picture_path?: Maybe<Scalars['String']>;
};

export type UpdateMember = {
  first_name?: Maybe<Scalars['String']>;
  nickname?: Maybe<Scalars['String']>;
  last_name?: Maybe<Scalars['String']>;
  class_programme?: Maybe<Scalars['String']>;
  class_year?: Maybe<Scalars['Int']>;
  picture_path?: Maybe<Scalars['String']>;
};

export type CreatePosition = {
  name: Scalars['String'];
  committee_id?: Maybe<Scalars['Int']>;
};

export type UpdatePosition = {
  name?: Maybe<Scalars['String']>;
  committee_id?: Maybe<Scalars['Int']>;
};

export type CreateCommittee = {
  name: Scalars['String'];
};

export type UpdateCommittee = {
  name?: Maybe<Scalars['String']>;
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
  Member: ResolverTypeWrapper<Member>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Position: ResolverTypeWrapper<Position>;
  Committee: ResolverTypeWrapper<Committee>;
  MemberFilter: MemberFilter;
  CommitteeFilter: CommitteeFilter;
  PositionFilter: PositionFilter;
  MemberMutations: ResolverTypeWrapper<MemberMutations>;
  PositionMutations: ResolverTypeWrapper<PositionMutations>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CommitteeMutations: ResolverTypeWrapper<CommitteeMutations>;
  CreateMember: CreateMember;
  UpdateMember: UpdateMember;
  CreatePosition: CreatePosition;
  UpdatePosition: UpdatePosition;
  CreateCommittee: CreateCommittee;
  UpdateCommittee: UpdateCommittee;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {};
  Int: Scalars['Int'];
  Mutation: {};
  Member: Member;
  String: Scalars['String'];
  Position: Position;
  Committee: Committee;
  MemberFilter: MemberFilter;
  CommitteeFilter: CommitteeFilter;
  PositionFilter: PositionFilter;
  MemberMutations: MemberMutations;
  PositionMutations: PositionMutations;
  Boolean: Scalars['Boolean'];
  CommitteeMutations: CommitteeMutations;
  CreateMember: CreateMember;
  UpdateMember: UpdateMember;
  CreatePosition: CreatePosition;
  UpdatePosition: UpdatePosition;
  CreateCommittee: CreateCommittee;
  UpdateCommittee: UpdateCommittee;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  me?: Resolver<Maybe<ResolversTypes['Member']>, ParentType, ContextType>;
  members?: Resolver<Array<ResolversTypes['Member']>, ParentType, ContextType, RequireFields<QueryMembersArgs, never>>;
  member?: Resolver<Maybe<ResolversTypes['Member']>, ParentType, ContextType, RequireFields<QueryMemberArgs, 'id'>>;
  positions?: Resolver<Array<ResolversTypes['Position']>, ParentType, ContextType, RequireFields<QueryPositionsArgs, never>>;
  committees?: Resolver<Array<ResolversTypes['Committee']>, ParentType, ContextType, RequireFields<QueryCommitteesArgs, never>>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  member?: Resolver<Maybe<ResolversTypes['MemberMutations']>, ParentType, ContextType>;
  position?: Resolver<Maybe<ResolversTypes['PositionMutations']>, ParentType, ContextType>;
  committee?: Resolver<Maybe<ResolversTypes['CommitteeMutations']>, ParentType, ContextType>;
}>;

export type MemberResolvers<ContextType = any, ParentType extends ResolversParentTypes['Member'] = ResolversParentTypes['Member']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Member']>, { __typename: 'Member' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  student_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  first_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  nickname?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  last_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  class_programme?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  class_year?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  picture_path?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PositionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Position'] = ResolversParentTypes['Position']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Position']>, { __typename: 'Position' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  committee?: Resolver<Maybe<ResolversTypes['Committee']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CommitteeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Committee'] = ResolversParentTypes['Committee']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Committee']>, { __typename: 'Committee' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MemberMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['MemberMutations'] = ResolversParentTypes['MemberMutations']> = ResolversObject<{
  create?: Resolver<Maybe<ResolversTypes['Member']>, ParentType, ContextType, RequireFields<MemberMutationsCreateArgs, 'input'>>;
  update?: Resolver<Maybe<ResolversTypes['Member']>, ParentType, ContextType, RequireFields<MemberMutationsUpdateArgs, 'id' | 'input'>>;
  remove?: Resolver<Maybe<ResolversTypes['Member']>, ParentType, ContextType, RequireFields<MemberMutationsRemoveArgs, 'id'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PositionMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['PositionMutations'] = ResolversParentTypes['PositionMutations']> = ResolversObject<{
  create?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<PositionMutationsCreateArgs, 'input'>>;
  update?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<PositionMutationsUpdateArgs, 'id' | 'input'>>;
  remove?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<PositionMutationsRemoveArgs, 'id'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CommitteeMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['CommitteeMutations'] = ResolversParentTypes['CommitteeMutations']> = ResolversObject<{
  create?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<CommitteeMutationsCreateArgs, 'input'>>;
  update?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<CommitteeMutationsUpdateArgs, 'id' | 'input'>>;
  remove?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<CommitteeMutationsRemoveArgs, 'id'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Member?: MemberResolvers<ContextType>;
  Position?: PositionResolvers<ContextType>;
  Committee?: CommitteeResolvers<ContextType>;
  MemberMutations?: MemberMutationsResolvers<ContextType>;
  PositionMutations?: PositionMutationsResolvers<ContextType>;
  CommitteeMutations?: CommitteeMutationsResolvers<ContextType>;
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
