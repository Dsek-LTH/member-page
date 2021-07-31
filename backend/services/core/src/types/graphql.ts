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
  Date: any;
  _FieldSet: any;
};





export type Committee = {
  __typename?: 'Committee';
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type CommitteeFilter = {
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
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

export type CommitteePagination = {
  __typename?: 'CommitteePagination';
  committees: Array<Maybe<Committee>>;
  pageInfo: PaginationInfo;
};

export type CreateCommittee = {
  name: Scalars['String'];
};

export type CreateMandate = {
  position_id: Scalars['Int'];
  member_id: Scalars['Int'];
  start_date: Scalars['Date'];
  end_date: Scalars['Date'];
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

export type CreatePosition = {
  name: Scalars['String'];
  committee_id?: Maybe<Scalars['Int']>;
};


export type Mandate = {
  __typename?: 'Mandate';
  id: Scalars['Int'];
  start_date: Scalars['Date'];
  end_date: Scalars['Date'];
  position?: Maybe<Position>;
  member?: Maybe<Member>;
};

export type MandateFilter = {
  id?: Maybe<Scalars['Int']>;
  position_id?: Maybe<Scalars['Int']>;
  member_id?: Maybe<Scalars['Int']>;
  start_date?: Maybe<Scalars['Date']>;
  end_date?: Maybe<Scalars['Date']>;
};

export type MandateMutations = {
  __typename?: 'MandateMutations';
  create?: Maybe<Mandate>;
  update?: Maybe<Mandate>;
  remove?: Maybe<Mandate>;
};


export type MandateMutationsCreateArgs = {
  input: CreateMandate;
};


export type MandateMutationsUpdateArgs = {
  id: Scalars['Int'];
  input: UpdateMandate;
};


export type MandateMutationsRemoveArgs = {
  id: Scalars['Int'];
};

export type MandatePagination = {
  __typename?: 'MandatePagination';
  mandates: Array<Maybe<Mandate>>;
  pageInfo: PaginationInfo;
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

export type MemberFilter = {
  id?: Maybe<Scalars['Int']>;
  student_id?: Maybe<Scalars['String']>;
  first_name?: Maybe<Scalars['String']>;
  nickname?: Maybe<Scalars['String']>;
  last_name?: Maybe<Scalars['String']>;
  class_programme?: Maybe<Scalars['String']>;
  class_year?: Maybe<Scalars['Int']>;
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

export type MemberPagination = {
  __typename?: 'MemberPagination';
  members: Array<Maybe<Member>>;
  pageInfo: PaginationInfo;
};

export type Mutation = {
  __typename?: 'Mutation';
  member?: Maybe<MemberMutations>;
  position?: Maybe<PositionMutations>;
  committee?: Maybe<CommitteeMutations>;
  mandate?: Maybe<MandateMutations>;
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

export type Position = {
  __typename?: 'Position';
  id: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
  committee?: Maybe<Committee>;
};

export type PositionFilter = {
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  committee_id?: Maybe<Scalars['Int']>;
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

export type PositionPagination = {
  __typename?: 'PositionPagination';
  positions: Array<Maybe<Position>>;
  pageInfo: PaginationInfo;
};

export type Query = {
  __typename?: 'Query';
  me?: Maybe<Member>;
  members?: Maybe<MemberPagination>;
  memberById?: Maybe<Member>;
  memberByStudentId?: Maybe<Member>;
  positions?: Maybe<PositionPagination>;
  committees?: Maybe<CommitteePagination>;
  mandates?: Maybe<MandatePagination>;
};


export type QueryMembersArgs = {
  page?: Scalars['Int'];
  perPage?: Scalars['Int'];
  filter?: Maybe<MemberFilter>;
};


export type QueryMemberByIdArgs = {
  id: Scalars['Int'];
};


export type QueryMemberByStudentIdArgs = {
  student_id: Scalars['String'];
};


export type QueryPositionsArgs = {
  page?: Scalars['Int'];
  perPage?: Scalars['Int'];
  filter?: Maybe<PositionFilter>;
};


export type QueryCommitteesArgs = {
  page?: Scalars['Int'];
  perPage?: Scalars['Int'];
  filter?: Maybe<CommitteeFilter>;
};


export type QueryMandatesArgs = {
  page?: Scalars['Int'];
  perPage?: Scalars['Int'];
  filter?: Maybe<MandateFilter>;
};

export type UpdateCommittee = {
  name?: Maybe<Scalars['String']>;
};

export type UpdateMandate = {
  position_id?: Maybe<Scalars['Int']>;
  member_id?: Maybe<Scalars['Int']>;
  start_date?: Maybe<Scalars['Date']>;
  end_date?: Maybe<Scalars['Date']>;
};

export type UpdateMember = {
  first_name?: Maybe<Scalars['String']>;
  nickname?: Maybe<Scalars['String']>;
  last_name?: Maybe<Scalars['String']>;
  class_programme?: Maybe<Scalars['String']>;
  class_year?: Maybe<Scalars['Int']>;
  picture_path?: Maybe<Scalars['String']>;
};

export type UpdatePosition = {
  name?: Maybe<Scalars['String']>;
  committee_id?: Maybe<Scalars['Int']>;
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
  Committee: ResolverTypeWrapper<Committee>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  CommitteeFilter: CommitteeFilter;
  CommitteeMutations: ResolverTypeWrapper<CommitteeMutations>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CommitteePagination: ResolverTypeWrapper<CommitteePagination>;
  CreateCommittee: CreateCommittee;
  CreateMandate: CreateMandate;
  CreateMember: CreateMember;
  CreatePosition: CreatePosition;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  Mandate: ResolverTypeWrapper<Mandate>;
  MandateFilter: MandateFilter;
  MandateMutations: ResolverTypeWrapper<MandateMutations>;
  MandatePagination: ResolverTypeWrapper<MandatePagination>;
  Member: ResolverTypeWrapper<Member>;
  MemberFilter: MemberFilter;
  MemberMutations: ResolverTypeWrapper<MemberMutations>;
  MemberPagination: ResolverTypeWrapper<MemberPagination>;
  Mutation: ResolverTypeWrapper<{}>;
  PaginationInfo: ResolverTypeWrapper<PaginationInfo>;
  Position: ResolverTypeWrapper<Position>;
  PositionFilter: PositionFilter;
  PositionMutations: ResolverTypeWrapper<PositionMutations>;
  PositionPagination: ResolverTypeWrapper<PositionPagination>;
  Query: ResolverTypeWrapper<{}>;
  UpdateCommittee: UpdateCommittee;
  UpdateMandate: UpdateMandate;
  UpdateMember: UpdateMember;
  UpdatePosition: UpdatePosition;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Committee: Committee;
  Int: Scalars['Int'];
  String: Scalars['String'];
  CommitteeFilter: CommitteeFilter;
  CommitteeMutations: CommitteeMutations;
  Boolean: Scalars['Boolean'];
  CommitteePagination: CommitteePagination;
  CreateCommittee: CreateCommittee;
  CreateMandate: CreateMandate;
  CreateMember: CreateMember;
  CreatePosition: CreatePosition;
  Date: Scalars['Date'];
  Mandate: Mandate;
  MandateFilter: MandateFilter;
  MandateMutations: MandateMutations;
  MandatePagination: MandatePagination;
  Member: Member;
  MemberFilter: MemberFilter;
  MemberMutations: MemberMutations;
  MemberPagination: MemberPagination;
  Mutation: {};
  PaginationInfo: PaginationInfo;
  Position: Position;
  PositionFilter: PositionFilter;
  PositionMutations: PositionMutations;
  PositionPagination: PositionPagination;
  Query: {};
  UpdateCommittee: UpdateCommittee;
  UpdateMandate: UpdateMandate;
  UpdateMember: UpdateMember;
  UpdatePosition: UpdatePosition;
}>;

export type CommitteeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Committee'] = ResolversParentTypes['Committee']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Committee']>, { __typename: 'Committee' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CommitteeMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['CommitteeMutations'] = ResolversParentTypes['CommitteeMutations']> = ResolversObject<{
  create?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<CommitteeMutationsCreateArgs, 'input'>>;
  update?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<CommitteeMutationsUpdateArgs, 'id' | 'input'>>;
  remove?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<CommitteeMutationsRemoveArgs, 'id'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CommitteePaginationResolvers<ContextType = any, ParentType extends ResolversParentTypes['CommitteePagination'] = ResolversParentTypes['CommitteePagination']> = ResolversObject<{
  committees?: Resolver<Array<Maybe<ResolversTypes['Committee']>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PaginationInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type MandateResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mandate'] = ResolversParentTypes['Mandate']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Mandate']>, { __typename: 'Mandate' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  start_date?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  end_date?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  position?: Resolver<Maybe<ResolversTypes['Position']>, ParentType, ContextType>;
  member?: Resolver<Maybe<ResolversTypes['Member']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MandateMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['MandateMutations'] = ResolversParentTypes['MandateMutations']> = ResolversObject<{
  create?: Resolver<Maybe<ResolversTypes['Mandate']>, ParentType, ContextType, RequireFields<MandateMutationsCreateArgs, 'input'>>;
  update?: Resolver<Maybe<ResolversTypes['Mandate']>, ParentType, ContextType, RequireFields<MandateMutationsUpdateArgs, 'id' | 'input'>>;
  remove?: Resolver<Maybe<ResolversTypes['Mandate']>, ParentType, ContextType, RequireFields<MandateMutationsRemoveArgs, 'id'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MandatePaginationResolvers<ContextType = any, ParentType extends ResolversParentTypes['MandatePagination'] = ResolversParentTypes['MandatePagination']> = ResolversObject<{
  mandates?: Resolver<Array<Maybe<ResolversTypes['Mandate']>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PaginationInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
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

export type MemberMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['MemberMutations'] = ResolversParentTypes['MemberMutations']> = ResolversObject<{
  create?: Resolver<Maybe<ResolversTypes['Member']>, ParentType, ContextType, RequireFields<MemberMutationsCreateArgs, 'input'>>;
  update?: Resolver<Maybe<ResolversTypes['Member']>, ParentType, ContextType, RequireFields<MemberMutationsUpdateArgs, 'id' | 'input'>>;
  remove?: Resolver<Maybe<ResolversTypes['Member']>, ParentType, ContextType, RequireFields<MemberMutationsRemoveArgs, 'id'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MemberPaginationResolvers<ContextType = any, ParentType extends ResolversParentTypes['MemberPagination'] = ResolversParentTypes['MemberPagination']> = ResolversObject<{
  members?: Resolver<Array<Maybe<ResolversTypes['Member']>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PaginationInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  member?: Resolver<Maybe<ResolversTypes['MemberMutations']>, ParentType, ContextType>;
  position?: Resolver<Maybe<ResolversTypes['PositionMutations']>, ParentType, ContextType>;
  committee?: Resolver<Maybe<ResolversTypes['CommitteeMutations']>, ParentType, ContextType>;
  mandate?: Resolver<Maybe<ResolversTypes['MandateMutations']>, ParentType, ContextType>;
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

export type PositionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Position'] = ResolversParentTypes['Position']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Position']>, { __typename: 'Position' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  committee?: Resolver<Maybe<ResolversTypes['Committee']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PositionMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['PositionMutations'] = ResolversParentTypes['PositionMutations']> = ResolversObject<{
  create?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<PositionMutationsCreateArgs, 'input'>>;
  update?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<PositionMutationsUpdateArgs, 'id' | 'input'>>;
  remove?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<PositionMutationsRemoveArgs, 'id'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PositionPaginationResolvers<ContextType = any, ParentType extends ResolversParentTypes['PositionPagination'] = ResolversParentTypes['PositionPagination']> = ResolversObject<{
  positions?: Resolver<Array<Maybe<ResolversTypes['Position']>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PaginationInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  me?: Resolver<Maybe<ResolversTypes['Member']>, ParentType, ContextType>;
  members?: Resolver<Maybe<ResolversTypes['MemberPagination']>, ParentType, ContextType, RequireFields<QueryMembersArgs, 'page' | 'perPage'>>;
  memberById?: Resolver<Maybe<ResolversTypes['Member']>, ParentType, ContextType, RequireFields<QueryMemberByIdArgs, 'id'>>;
  memberByStudentId?: Resolver<Maybe<ResolversTypes['Member']>, ParentType, ContextType, RequireFields<QueryMemberByStudentIdArgs, 'student_id'>>;
  positions?: Resolver<Maybe<ResolversTypes['PositionPagination']>, ParentType, ContextType, RequireFields<QueryPositionsArgs, 'page' | 'perPage'>>;
  committees?: Resolver<Maybe<ResolversTypes['CommitteePagination']>, ParentType, ContextType, RequireFields<QueryCommitteesArgs, 'page' | 'perPage'>>;
  mandates?: Resolver<Maybe<ResolversTypes['MandatePagination']>, ParentType, ContextType, RequireFields<QueryMandatesArgs, 'page' | 'perPage'>>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Committee?: CommitteeResolvers<ContextType>;
  CommitteeMutations?: CommitteeMutationsResolvers<ContextType>;
  CommitteePagination?: CommitteePaginationResolvers<ContextType>;
  Date?: GraphQLScalarType;
  Mandate?: MandateResolvers<ContextType>;
  MandateMutations?: MandateMutationsResolvers<ContextType>;
  MandatePagination?: MandatePaginationResolvers<ContextType>;
  Member?: MemberResolvers<ContextType>;
  MemberMutations?: MemberMutationsResolvers<ContextType>;
  MemberPagination?: MemberPaginationResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PaginationInfo?: PaginationInfoResolvers<ContextType>;
  Position?: PositionResolvers<ContextType>;
  PositionMutations?: PositionMutationsResolvers<ContextType>;
  PositionPagination?: PositionPaginationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
