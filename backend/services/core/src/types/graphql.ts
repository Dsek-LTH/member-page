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
  _FieldSet: any;
  Date: any;
  UUID: string;
};






export type AccessMutations = {
  __typename?: 'AccessMutations';
  door?: Maybe<DoorMutations>;
  policy?: Maybe<PolicyMutations>;
};

export type AccessPolicy = {
  __typename?: 'AccessPolicy';
  accessor: Scalars['String'];
  id: Scalars['UUID'];
};

export type Api = {
  __typename?: 'Api';
  accessPolicies?: Maybe<Array<AccessPolicy>>;
  name: Scalars['String'];
};

export type Committee = {
  __typename?: 'Committee';
  id: Scalars['UUID'];
  name?: Maybe<Scalars['String']>;
  shortName?: Maybe<Scalars['String']>;
};

export type CommitteeFilter = {
  id?: Maybe<Scalars['UUID']>;
  name?: Maybe<Scalars['String']>;
};

export type CommitteeMutations = {
  __typename?: 'CommitteeMutations';
  create?: Maybe<Committee>;
  remove?: Maybe<Committee>;
  update?: Maybe<Committee>;
};


export type CommitteeMutationsCreateArgs = {
  input: CreateCommittee;
};


export type CommitteeMutationsRemoveArgs = {
  id: Scalars['UUID'];
};


export type CommitteeMutationsUpdateArgs = {
  id: Scalars['UUID'];
  input: UpdateCommittee;
};

export type CommitteePagination = {
  __typename?: 'CommitteePagination';
  committees: Array<Maybe<Committee>>;
  pageInfo: PaginationInfo;
};

export type CreateApiAccessPolicy = {
  apiName: Scalars['String'];
  who: Scalars['String'];
};

export type CreateCommittee = {
  name: Scalars['String'];
};

export type CreateDoor = {
  id?: Maybe<Scalars['String']>;
  name: Scalars['String'];
};

export type CreateDoorAccessPolicy = {
  doorName: Scalars['String'];
  who: Scalars['String'];
};

export type CreateMandate = {
  end_date: Scalars['Date'];
  member_id: Scalars['UUID'];
  position_id: Scalars['String'];
  start_date: Scalars['Date'];
};

export type CreateMember = {
  class_programme: Scalars['String'];
  class_year: Scalars['Int'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  nickname?: Maybe<Scalars['String']>;
  picture_path?: Maybe<Scalars['String']>;
  student_id: Scalars['String'];
};

export type CreatePosition = {
  active?: Maybe<Scalars['Boolean']>;
  boardMember?: Maybe<Scalars['Boolean']>;
  committee_id?: Maybe<Scalars['UUID']>;
  email?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  name: Scalars['String'];
};


export type Door = {
  __typename?: 'Door';
  accessPolicies?: Maybe<Array<AccessPolicy>>;
  id?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  studentIds?: Maybe<Array<Scalars['String']>>;
};

export type DoorMutations = {
  __typename?: 'DoorMutations';
  create?: Maybe<Door>;
  remove?: Maybe<Door>;
};


export type DoorMutationsCreateArgs = {
  input: CreateDoor;
};


export type DoorMutationsRemoveArgs = {
  name: Scalars['String'];
};

export type Mandate = {
  __typename?: 'Mandate';
  end_date: Scalars['Date'];
  id: Scalars['UUID'];
  member?: Maybe<Member>;
  position?: Maybe<Position>;
  start_date: Scalars['Date'];
};

export type MandateFilter = {
  end_date?: Maybe<Scalars['Date']>;
  id?: Maybe<Scalars['UUID']>;
  member_id?: Maybe<Scalars['UUID']>;
  position_id?: Maybe<Scalars['String']>;
  start_date?: Maybe<Scalars['Date']>;
};

export type MandateMutations = {
  __typename?: 'MandateMutations';
  create?: Maybe<Mandate>;
  remove?: Maybe<Mandate>;
  update?: Maybe<Mandate>;
};


export type MandateMutationsCreateArgs = {
  input: CreateMandate;
};


export type MandateMutationsRemoveArgs = {
  id: Scalars['UUID'];
};


export type MandateMutationsUpdateArgs = {
  id: Scalars['UUID'];
  input: UpdateMandate;
};

export type MandatePagination = {
  __typename?: 'MandatePagination';
  mandates: Array<Maybe<Mandate>>;
  pageInfo: PaginationInfo;
};

export type Member = {
  __typename?: 'Member';
  class_programme?: Maybe<Scalars['String']>;
  class_year?: Maybe<Scalars['Int']>;
  first_name?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  last_name?: Maybe<Scalars['String']>;
  nickname?: Maybe<Scalars['String']>;
  picture_path?: Maybe<Scalars['String']>;
  student_id?: Maybe<Scalars['String']>;
};

export type MemberFilter = {
  class_programme?: Maybe<Scalars['String']>;
  class_year?: Maybe<Scalars['Int']>;
  first_name?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['UUID']>;
  last_name?: Maybe<Scalars['String']>;
  nickname?: Maybe<Scalars['String']>;
  student_id?: Maybe<Scalars['String']>;
};

export type MemberMutations = {
  __typename?: 'MemberMutations';
  create?: Maybe<Member>;
  remove?: Maybe<Member>;
  update?: Maybe<Member>;
};


export type MemberMutationsCreateArgs = {
  input: CreateMember;
};


export type MemberMutationsRemoveArgs = {
  id: Scalars['UUID'];
};


export type MemberMutationsUpdateArgs = {
  id: Scalars['UUID'];
  input: UpdateMember;
};

export type MemberPagination = {
  __typename?: 'MemberPagination';
  members: Array<Maybe<Member>>;
  pageInfo: PaginationInfo;
};

export type Mutation = {
  __typename?: 'Mutation';
  access?: Maybe<AccessMutations>;
  committee?: Maybe<CommitteeMutations>;
  mandate?: Maybe<MandateMutations>;
  member?: Maybe<MemberMutations>;
  position?: Maybe<PositionMutations>;
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

export type PolicyMutations = {
  __typename?: 'PolicyMutations';
  createApiAccessPolicy?: Maybe<AccessPolicy>;
  createDoorAccessPolicy?: Maybe<AccessPolicy>;
  remove?: Maybe<AccessPolicy>;
};


export type PolicyMutationsCreateApiAccessPolicyArgs = {
  input: CreateApiAccessPolicy;
};


export type PolicyMutationsCreateDoorAccessPolicyArgs = {
  input: CreateDoorAccessPolicy;
};


export type PolicyMutationsRemoveArgs = {
  id: Scalars['UUID'];
};

export type Position = {
  __typename?: 'Position';
  active?: Maybe<Scalars['Boolean']>;
  boardMember?: Maybe<Scalars['Boolean']>;
  committee?: Maybe<Committee>;
  email?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  nameEn?: Maybe<Scalars['String']>;
};

export type PositionFilter = {
  committee_id?: Maybe<Scalars['UUID']>;
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type PositionMutations = {
  __typename?: 'PositionMutations';
  create?: Maybe<Position>;
  remove?: Maybe<Position>;
  update?: Maybe<Position>;
};


export type PositionMutationsCreateArgs = {
  input: CreatePosition;
};


export type PositionMutationsRemoveArgs = {
  id: Scalars['String'];
};


export type PositionMutationsUpdateArgs = {
  id: Scalars['String'];
  input: UpdatePosition;
};

export type PositionPagination = {
  __typename?: 'PositionPagination';
  pageInfo: PaginationInfo;
  positions: Array<Maybe<Position>>;
};

export type Query = {
  __typename?: 'Query';
  accessPolicies?: Maybe<Array<AccessPolicy>>;
  accessPolicy?: Maybe<AccessPolicy>;
  /** returns all apis the singed in member has access to. */
  apiAccess?: Maybe<Array<Api>>;
  committees?: Maybe<CommitteePagination>;
  door?: Maybe<Door>;
  doors?: Maybe<Array<Door>>;
  mandates?: Maybe<MandatePagination>;
  me?: Maybe<Member>;
  memberById?: Maybe<Member>;
  memberByStudentId?: Maybe<Member>;
  members?: Maybe<MemberPagination>;
  positions?: Maybe<PositionPagination>;
};


export type QueryAccessPolicyArgs = {
  name: Scalars['String'];
};


export type QueryCommitteesArgs = {
  filter?: Maybe<CommitteeFilter>;
  page?: Scalars['Int'];
  perPage?: Scalars['Int'];
};


export type QueryDoorArgs = {
  name: Scalars['String'];
};


export type QueryMandatesArgs = {
  filter?: Maybe<MandateFilter>;
  page?: Scalars['Int'];
  perPage?: Scalars['Int'];
};


export type QueryMemberByIdArgs = {
  id: Scalars['UUID'];
};


export type QueryMemberByStudentIdArgs = {
  student_id: Scalars['String'];
};


export type QueryMembersArgs = {
  filter?: Maybe<MemberFilter>;
  page?: Scalars['Int'];
  perPage?: Scalars['Int'];
};


export type QueryPositionsArgs = {
  filter?: Maybe<PositionFilter>;
  page?: Scalars['Int'];
  perPage?: Scalars['Int'];
};


export type UpdateCommittee = {
  name?: Maybe<Scalars['String']>;
};

export type UpdateMandate = {
  end_date?: Maybe<Scalars['Date']>;
  member_id?: Maybe<Scalars['UUID']>;
  position_id?: Maybe<Scalars['String']>;
  start_date?: Maybe<Scalars['Date']>;
};

export type UpdateMember = {
  class_programme?: Maybe<Scalars['String']>;
  class_year?: Maybe<Scalars['Int']>;
  first_name?: Maybe<Scalars['String']>;
  last_name?: Maybe<Scalars['String']>;
  nickname?: Maybe<Scalars['String']>;
  picture_path?: Maybe<Scalars['String']>;
};

export type UpdatePosition = {
  committee_id?: Maybe<Scalars['UUID']>;
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
  AccessMutations: ResolverTypeWrapper<AccessMutations>;
  AccessPolicy: ResolverTypeWrapper<AccessPolicy>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Api: ResolverTypeWrapper<Api>;
  Committee: ResolverTypeWrapper<Committee>;
  CommitteeFilter: CommitteeFilter;
  CommitteeMutations: ResolverTypeWrapper<CommitteeMutations>;
  CommitteePagination: ResolverTypeWrapper<CommitteePagination>;
  CreateApiAccessPolicy: CreateApiAccessPolicy;
  CreateCommittee: CreateCommittee;
  CreateDoor: CreateDoor;
  CreateDoorAccessPolicy: CreateDoorAccessPolicy;
  CreateMandate: CreateMandate;
  CreateMember: CreateMember;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  CreatePosition: CreatePosition;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  Door: ResolverTypeWrapper<Door>;
  DoorMutations: ResolverTypeWrapper<DoorMutations>;
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
  PolicyMutations: ResolverTypeWrapper<PolicyMutations>;
  Position: ResolverTypeWrapper<Position>;
  PositionFilter: PositionFilter;
  PositionMutations: ResolverTypeWrapper<PositionMutations>;
  PositionPagination: ResolverTypeWrapper<PositionPagination>;
  Query: ResolverTypeWrapper<{}>;
  UUID: ResolverTypeWrapper<Scalars['UUID']>;
  UpdateCommittee: UpdateCommittee;
  UpdateMandate: UpdateMandate;
  UpdateMember: UpdateMember;
  UpdatePosition: UpdatePosition;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AccessMutations: AccessMutations;
  AccessPolicy: AccessPolicy;
  String: Scalars['String'];
  Api: Api;
  Committee: Committee;
  CommitteeFilter: CommitteeFilter;
  CommitteeMutations: CommitteeMutations;
  CommitteePagination: CommitteePagination;
  CreateApiAccessPolicy: CreateApiAccessPolicy;
  CreateCommittee: CreateCommittee;
  CreateDoor: CreateDoor;
  CreateDoorAccessPolicy: CreateDoorAccessPolicy;
  CreateMandate: CreateMandate;
  CreateMember: CreateMember;
  Int: Scalars['Int'];
  CreatePosition: CreatePosition;
  Boolean: Scalars['Boolean'];
  Date: Scalars['Date'];
  Door: Door;
  DoorMutations: DoorMutations;
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
  PolicyMutations: PolicyMutations;
  Position: Position;
  PositionFilter: PositionFilter;
  PositionMutations: PositionMutations;
  PositionPagination: PositionPagination;
  Query: {};
  UUID: Scalars['UUID'];
  UpdateCommittee: UpdateCommittee;
  UpdateMandate: UpdateMandate;
  UpdateMember: UpdateMember;
  UpdatePosition: UpdatePosition;
}>;

export type AccessMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['AccessMutations'] = ResolversParentTypes['AccessMutations']> = ResolversObject<{
  door?: Resolver<Maybe<ResolversTypes['DoorMutations']>, ParentType, ContextType>;
  policy?: Resolver<Maybe<ResolversTypes['PolicyMutations']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AccessPolicyResolvers<ContextType = any, ParentType extends ResolversParentTypes['AccessPolicy'] = ResolversParentTypes['AccessPolicy']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['AccessPolicy']>, { __typename: 'AccessPolicy' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  accessor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ApiResolvers<ContextType = any, ParentType extends ResolversParentTypes['Api'] = ResolversParentTypes['Api']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Api']>, { __typename: 'Api' } & GraphQLRecursivePick<ParentType, {"name":true}>, ContextType>;
  accessPolicies?: Resolver<Maybe<Array<ResolversTypes['AccessPolicy']>>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CommitteeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Committee'] = ResolversParentTypes['Committee']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Committee']>, { __typename: 'Committee' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  shortName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CommitteeMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['CommitteeMutations'] = ResolversParentTypes['CommitteeMutations']> = ResolversObject<{
  create?: Resolver<Maybe<ResolversTypes['Committee']>, ParentType, ContextType, RequireFields<CommitteeMutationsCreateArgs, 'input'>>;
  remove?: Resolver<Maybe<ResolversTypes['Committee']>, ParentType, ContextType, RequireFields<CommitteeMutationsRemoveArgs, 'id'>>;
  update?: Resolver<Maybe<ResolversTypes['Committee']>, ParentType, ContextType, RequireFields<CommitteeMutationsUpdateArgs, 'id' | 'input'>>;
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

export type DoorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Door'] = ResolversParentTypes['Door']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Door']>, { __typename: 'Door' } & GraphQLRecursivePick<ParentType, {"name":true}>, ContextType>;
  accessPolicies?: Resolver<Maybe<Array<ResolversTypes['AccessPolicy']>>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  studentIds?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DoorMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['DoorMutations'] = ResolversParentTypes['DoorMutations']> = ResolversObject<{
  create?: Resolver<Maybe<ResolversTypes['Door']>, ParentType, ContextType, RequireFields<DoorMutationsCreateArgs, 'input'>>;
  remove?: Resolver<Maybe<ResolversTypes['Door']>, ParentType, ContextType, RequireFields<DoorMutationsRemoveArgs, 'name'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MandateResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mandate'] = ResolversParentTypes['Mandate']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Mandate']>, { __typename: 'Mandate' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  end_date?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  member?: Resolver<Maybe<ResolversTypes['Member']>, ParentType, ContextType>;
  position?: Resolver<Maybe<ResolversTypes['Position']>, ParentType, ContextType>;
  start_date?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MandateMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['MandateMutations'] = ResolversParentTypes['MandateMutations']> = ResolversObject<{
  create?: Resolver<Maybe<ResolversTypes['Mandate']>, ParentType, ContextType, RequireFields<MandateMutationsCreateArgs, 'input'>>;
  remove?: Resolver<Maybe<ResolversTypes['Mandate']>, ParentType, ContextType, RequireFields<MandateMutationsRemoveArgs, 'id'>>;
  update?: Resolver<Maybe<ResolversTypes['Mandate']>, ParentType, ContextType, RequireFields<MandateMutationsUpdateArgs, 'id' | 'input'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MandatePaginationResolvers<ContextType = any, ParentType extends ResolversParentTypes['MandatePagination'] = ResolversParentTypes['MandatePagination']> = ResolversObject<{
  mandates?: Resolver<Array<Maybe<ResolversTypes['Mandate']>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PaginationInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MemberResolvers<ContextType = any, ParentType extends ResolversParentTypes['Member'] = ResolversParentTypes['Member']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Member']>, { __typename: 'Member' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  class_programme?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  class_year?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  first_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  last_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  nickname?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  picture_path?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  student_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MemberMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['MemberMutations'] = ResolversParentTypes['MemberMutations']> = ResolversObject<{
  create?: Resolver<Maybe<ResolversTypes['Member']>, ParentType, ContextType, RequireFields<MemberMutationsCreateArgs, 'input'>>;
  remove?: Resolver<Maybe<ResolversTypes['Member']>, ParentType, ContextType, RequireFields<MemberMutationsRemoveArgs, 'id'>>;
  update?: Resolver<Maybe<ResolversTypes['Member']>, ParentType, ContextType, RequireFields<MemberMutationsUpdateArgs, 'id' | 'input'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MemberPaginationResolvers<ContextType = any, ParentType extends ResolversParentTypes['MemberPagination'] = ResolversParentTypes['MemberPagination']> = ResolversObject<{
  members?: Resolver<Array<Maybe<ResolversTypes['Member']>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PaginationInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  access?: Resolver<Maybe<ResolversTypes['AccessMutations']>, ParentType, ContextType>;
  committee?: Resolver<Maybe<ResolversTypes['CommitteeMutations']>, ParentType, ContextType>;
  mandate?: Resolver<Maybe<ResolversTypes['MandateMutations']>, ParentType, ContextType>;
  member?: Resolver<Maybe<ResolversTypes['MemberMutations']>, ParentType, ContextType>;
  position?: Resolver<Maybe<ResolversTypes['PositionMutations']>, ParentType, ContextType>;
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

export type PolicyMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['PolicyMutations'] = ResolversParentTypes['PolicyMutations']> = ResolversObject<{
  createApiAccessPolicy?: Resolver<Maybe<ResolversTypes['AccessPolicy']>, ParentType, ContextType, RequireFields<PolicyMutationsCreateApiAccessPolicyArgs, 'input'>>;
  createDoorAccessPolicy?: Resolver<Maybe<ResolversTypes['AccessPolicy']>, ParentType, ContextType, RequireFields<PolicyMutationsCreateDoorAccessPolicyArgs, 'input'>>;
  remove?: Resolver<Maybe<ResolversTypes['AccessPolicy']>, ParentType, ContextType, RequireFields<PolicyMutationsRemoveArgs, 'id'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PositionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Position'] = ResolversParentTypes['Position']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Position']>, { __typename: 'Position' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  active?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  boardMember?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  committee?: Resolver<Maybe<ResolversTypes['Committee']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  nameEn?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PositionMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['PositionMutations'] = ResolversParentTypes['PositionMutations']> = ResolversObject<{
  create?: Resolver<Maybe<ResolversTypes['Position']>, ParentType, ContextType, RequireFields<PositionMutationsCreateArgs, 'input'>>;
  remove?: Resolver<Maybe<ResolversTypes['Position']>, ParentType, ContextType, RequireFields<PositionMutationsRemoveArgs, 'id'>>;
  update?: Resolver<Maybe<ResolversTypes['Position']>, ParentType, ContextType, RequireFields<PositionMutationsUpdateArgs, 'id' | 'input'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PositionPaginationResolvers<ContextType = any, ParentType extends ResolversParentTypes['PositionPagination'] = ResolversParentTypes['PositionPagination']> = ResolversObject<{
  pageInfo?: Resolver<ResolversTypes['PaginationInfo'], ParentType, ContextType>;
  positions?: Resolver<Array<Maybe<ResolversTypes['Position']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  accessPolicies?: Resolver<Maybe<Array<ResolversTypes['AccessPolicy']>>, ParentType, ContextType>;
  accessPolicy?: Resolver<Maybe<ResolversTypes['AccessPolicy']>, ParentType, ContextType, RequireFields<QueryAccessPolicyArgs, 'name'>>;
  apiAccess?: Resolver<Maybe<Array<ResolversTypes['Api']>>, ParentType, ContextType>;
  committees?: Resolver<Maybe<ResolversTypes['CommitteePagination']>, ParentType, ContextType, RequireFields<QueryCommitteesArgs, 'page' | 'perPage'>>;
  door?: Resolver<Maybe<ResolversTypes['Door']>, ParentType, ContextType, RequireFields<QueryDoorArgs, 'name'>>;
  doors?: Resolver<Maybe<Array<ResolversTypes['Door']>>, ParentType, ContextType>;
  mandates?: Resolver<Maybe<ResolversTypes['MandatePagination']>, ParentType, ContextType, RequireFields<QueryMandatesArgs, 'page' | 'perPage'>>;
  me?: Resolver<Maybe<ResolversTypes['Member']>, ParentType, ContextType>;
  memberById?: Resolver<Maybe<ResolversTypes['Member']>, ParentType, ContextType, RequireFields<QueryMemberByIdArgs, 'id'>>;
  memberByStudentId?: Resolver<Maybe<ResolversTypes['Member']>, ParentType, ContextType, RequireFields<QueryMemberByStudentIdArgs, 'student_id'>>;
  members?: Resolver<Maybe<ResolversTypes['MemberPagination']>, ParentType, ContextType, RequireFields<QueryMembersArgs, 'page' | 'perPage'>>;
  positions?: Resolver<Maybe<ResolversTypes['PositionPagination']>, ParentType, ContextType, RequireFields<QueryPositionsArgs, 'page' | 'perPage'>>;
}>;

export interface UuidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['UUID'], any> {
  name: 'UUID';
}

export type Resolvers<ContextType = any> = ResolversObject<{
  AccessMutations?: AccessMutationsResolvers<ContextType>;
  AccessPolicy?: AccessPolicyResolvers<ContextType>;
  Api?: ApiResolvers<ContextType>;
  Committee?: CommitteeResolvers<ContextType>;
  CommitteeMutations?: CommitteeMutationsResolvers<ContextType>;
  CommitteePagination?: CommitteePaginationResolvers<ContextType>;
  Date?: GraphQLScalarType;
  Door?: DoorResolvers<ContextType>;
  DoorMutations?: DoorMutationsResolvers<ContextType>;
  Mandate?: MandateResolvers<ContextType>;
  MandateMutations?: MandateMutationsResolvers<ContextType>;
  MandatePagination?: MandatePaginationResolvers<ContextType>;
  Member?: MemberResolvers<ContextType>;
  MemberMutations?: MemberMutationsResolvers<ContextType>;
  MemberPagination?: MemberPaginationResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PaginationInfo?: PaginationInfoResolvers<ContextType>;
  PolicyMutations?: PolicyMutationsResolvers<ContextType>;
  Position?: PositionResolvers<ContextType>;
  PositionMutations?: PositionMutationsResolvers<ContextType>;
  PositionPagination?: PositionPaginationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  UUID?: GraphQLScalarType;
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
