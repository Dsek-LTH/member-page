import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
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
  Datetime: any;
  _FieldSet: any;
};





export type Query = {
  __typename?: 'Query';
  bookingRequests?: Maybe<Array<BookingRequest>>;
};


export type QueryBookingRequestsArgs = {
  filter?: Maybe<BookingFilter>;
};

export type Mutation = {
  __typename?: 'Mutation';
  bookingRequests?: Maybe<BookingRequestMutations>;
};

export type Member = {
  __typename?: 'Member';
  id: Scalars['Int'];
};


export type BookingRequest = {
  __typename?: 'BookingRequest';
  id: Scalars['Int'];
  start: Scalars['Datetime'];
  end: Scalars['Datetime'];
  event: Scalars['String'];
  booker?: Maybe<Member>;
  what: Scalars['String'];
  status: BookingStatus;
  created: Scalars['Datetime'];
  last_modified?: Maybe<Scalars['Datetime']>;
};

export enum BookingStatus {
  Waiting = 'WAITING',
  Accepted = 'ACCEPTED',
  Denied = 'DENIED'
}

export type BookingFilter = {
  id?: Maybe<Scalars['Int']>;
  from?: Maybe<Scalars['Datetime']>;
  to?: Maybe<Scalars['Datetime']>;
  status?: Maybe<BookingStatus>;
};

export type BookingRequestMutations = {
  __typename?: 'BookingRequestMutations';
  accept?: Maybe<Scalars['Boolean']>;
  deny?: Maybe<Scalars['Boolean']>;
  remove?: Maybe<Scalars['Boolean']>;
  update?: Maybe<Scalars['Boolean']>;
  create?: Maybe<Scalars['Int']>;
};


export type BookingRequestMutationsAcceptArgs = {
  id: Scalars['Int'];
};


export type BookingRequestMutationsDenyArgs = {
  id: Scalars['Int'];
};


export type BookingRequestMutationsRemoveArgs = {
  id: Scalars['Int'];
};


export type BookingRequestMutationsUpdateArgs = {
  id: Scalars['Int'];
  input?: Maybe<UpdateBookingRequest>;
};


export type BookingRequestMutationsCreateArgs = {
  input?: Maybe<CreateBookingRequest>;
};

export type UpdateBookingRequest = {
  start?: Maybe<Scalars['Datetime']>;
  end?: Maybe<Scalars['Datetime']>;
  what?: Maybe<Scalars['String']>;
  event?: Maybe<Scalars['String']>;
};

export type CreateBookingRequest = {
  start: Scalars['Datetime'];
  end: Scalars['Datetime'];
  what: Scalars['String'];
  event: Scalars['String'];
  booker_id: Scalars['Int'];
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
  Datetime: ResolverTypeWrapper<Scalars['Datetime']>;
  BookingRequest: ResolverTypeWrapper<BookingRequest>;
  String: ResolverTypeWrapper<Scalars['String']>;
  BookingStatus: BookingStatus;
  BookingFilter: BookingFilter;
  BookingRequestMutations: ResolverTypeWrapper<BookingRequestMutations>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  UpdateBookingRequest: UpdateBookingRequest;
  CreateBookingRequest: CreateBookingRequest;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {};
  Mutation: {};
  Member: Member;
  Int: Scalars['Int'];
  Datetime: Scalars['Datetime'];
  BookingRequest: BookingRequest;
  String: Scalars['String'];
  BookingFilter: BookingFilter;
  BookingRequestMutations: BookingRequestMutations;
  Boolean: Scalars['Boolean'];
  UpdateBookingRequest: UpdateBookingRequest;
  CreateBookingRequest: CreateBookingRequest;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  bookingRequests?: Resolver<Maybe<Array<ResolversTypes['BookingRequest']>>, ParentType, ContextType, RequireFields<QueryBookingRequestsArgs, never>>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  bookingRequests?: Resolver<Maybe<ResolversTypes['BookingRequestMutations']>, ParentType, ContextType>;
}>;

export type MemberResolvers<ContextType = any, ParentType extends ResolversParentTypes['Member'] = ResolversParentTypes['Member']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Member']>, { __typename: 'Member' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;

  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DatetimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Datetime'], any> {
  name: 'Datetime';
}

export type BookingRequestResolvers<ContextType = any, ParentType extends ResolversParentTypes['BookingRequest'] = ResolversParentTypes['BookingRequest']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['BookingRequest']>, { __typename: 'BookingRequest' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  start?: Resolver<ResolversTypes['Datetime'], ParentType, ContextType>;
  end?: Resolver<ResolversTypes['Datetime'], ParentType, ContextType>;
  event?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  booker?: Resolver<Maybe<ResolversTypes['Member']>, ParentType, ContextType>;
  what?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['BookingStatus'], ParentType, ContextType>;
  created?: Resolver<ResolversTypes['Datetime'], ParentType, ContextType>;
  last_modified?: Resolver<Maybe<ResolversTypes['Datetime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BookingRequestMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['BookingRequestMutations'] = ResolversParentTypes['BookingRequestMutations']> = ResolversObject<{
  accept?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<BookingRequestMutationsAcceptArgs, 'id'>>;
  deny?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<BookingRequestMutationsDenyArgs, 'id'>>;
  remove?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<BookingRequestMutationsRemoveArgs, 'id'>>;
  update?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<BookingRequestMutationsUpdateArgs, 'id'>>;
  create?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, RequireFields<BookingRequestMutationsCreateArgs, never>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Member?: MemberResolvers<ContextType>;
  Datetime?: GraphQLScalarType;
  BookingRequest?: BookingRequestResolvers<ContextType>;
  BookingRequestMutations?: BookingRequestMutationsResolvers<ContextType>;
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
