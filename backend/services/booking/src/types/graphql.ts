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
  Datetime: any;
};






export type Bookable = {
  __typename?: 'Bookable';
  id: Scalars['String'];
  name: Scalars['String'];
  name_en: Scalars['String'];
};

export type BookingFilter = {
  from?: Maybe<Scalars['Datetime']>;
  status?: Maybe<BookingStatus>;
  to?: Maybe<Scalars['Datetime']>;
  what?: Maybe<Scalars['String']>;
};

export type BookingRequest = {
  __typename?: 'BookingRequest';
  booker: Member;
  created: Scalars['Datetime'];
  end: Scalars['Datetime'];
  event: Scalars['String'];
  id: Scalars['Int'];
  last_modified?: Maybe<Scalars['Datetime']>;
  start: Scalars['Datetime'];
  status: BookingStatus;
  what: Array<Maybe<Bookable>>;
};

export type BookingRequestMutations = {
  __typename?: 'BookingRequestMutations';
  accept?: Maybe<Scalars['Boolean']>;
  create?: Maybe<BookingRequest>;
  deny?: Maybe<Scalars['Boolean']>;
  remove?: Maybe<BookingRequest>;
  update?: Maybe<BookingRequest>;
};


export type BookingRequestMutationsAcceptArgs = {
  id: Scalars['Int'];
};


export type BookingRequestMutationsCreateArgs = {
  input: CreateBookingRequest;
};


export type BookingRequestMutationsDenyArgs = {
  id: Scalars['Int'];
};


export type BookingRequestMutationsRemoveArgs = {
  id: Scalars['Int'];
};


export type BookingRequestMutationsUpdateArgs = {
  id: Scalars['Int'];
  input: UpdateBookingRequest;
};

export enum BookingStatus {
  Accepted = 'ACCEPTED',
  Denied = 'DENIED',
  Pending = 'PENDING'
}

export type CreateBookingRequest = {
  booker_id: Scalars['Int'];
  end: Scalars['Datetime'];
  event: Scalars['String'];
  start: Scalars['Datetime'];
  what: Array<Scalars['String']>;
};


export type Member = {
  __typename?: 'Member';
  id: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  bookingRequest?: Maybe<BookingRequestMutations>;
};

export type Query = {
  __typename?: 'Query';
  bookables?: Maybe<Array<Bookable>>;
  bookingRequest?: Maybe<BookingRequest>;
  bookingRequests?: Maybe<Array<BookingRequest>>;
};


export type QueryBookingRequestArgs = {
  id: Scalars['Int'];
};


export type QueryBookingRequestsArgs = {
  filter?: Maybe<BookingFilter>;
};

export type UpdateBookingRequest = {
  end?: Maybe<Scalars['Datetime']>;
  event?: Maybe<Scalars['String']>;
  start?: Maybe<Scalars['Datetime']>;
  what?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type UpdateBookingRequestStatus = {
  status?: Maybe<BookingStatus>;
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
  Bookable: ResolverTypeWrapper<Bookable>;
  String: ResolverTypeWrapper<Scalars['String']>;
  BookingFilter: BookingFilter;
  BookingRequest: ResolverTypeWrapper<BookingRequest>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  BookingRequestMutations: ResolverTypeWrapper<BookingRequestMutations>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  BookingStatus: BookingStatus;
  CreateBookingRequest: CreateBookingRequest;
  Datetime: ResolverTypeWrapper<Scalars['Datetime']>;
  Member: ResolverTypeWrapper<Member>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  UpdateBookingRequest: UpdateBookingRequest;
  UpdateBookingRequestStatus: UpdateBookingRequestStatus;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Bookable: Bookable;
  String: Scalars['String'];
  BookingFilter: BookingFilter;
  BookingRequest: BookingRequest;
  Int: Scalars['Int'];
  BookingRequestMutations: BookingRequestMutations;
  Boolean: Scalars['Boolean'];
  CreateBookingRequest: CreateBookingRequest;
  Datetime: Scalars['Datetime'];
  Member: Member;
  Mutation: {};
  Query: {};
  UpdateBookingRequest: UpdateBookingRequest;
  UpdateBookingRequestStatus: UpdateBookingRequestStatus;
}>;

export type BookableResolvers<ContextType = any, ParentType extends ResolversParentTypes['Bookable'] = ResolversParentTypes['Bookable']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Bookable']>, { __typename: 'Bookable' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name_en?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BookingRequestResolvers<ContextType = any, ParentType extends ResolversParentTypes['BookingRequest'] = ResolversParentTypes['BookingRequest']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['BookingRequest']>, { __typename: 'BookingRequest' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  booker?: Resolver<ResolversTypes['Member'], ParentType, ContextType>;
  created?: Resolver<ResolversTypes['Datetime'], ParentType, ContextType>;
  end?: Resolver<ResolversTypes['Datetime'], ParentType, ContextType>;
  event?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  last_modified?: Resolver<Maybe<ResolversTypes['Datetime']>, ParentType, ContextType>;
  start?: Resolver<ResolversTypes['Datetime'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['BookingStatus'], ParentType, ContextType>;
  what?: Resolver<Array<Maybe<ResolversTypes['Bookable']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BookingRequestMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['BookingRequestMutations'] = ResolversParentTypes['BookingRequestMutations']> = ResolversObject<{
  accept?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<BookingRequestMutationsAcceptArgs, 'id'>>;
  create?: Resolver<Maybe<ResolversTypes['BookingRequest']>, ParentType, ContextType, RequireFields<BookingRequestMutationsCreateArgs, 'input'>>;
  deny?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<BookingRequestMutationsDenyArgs, 'id'>>;
  remove?: Resolver<Maybe<ResolversTypes['BookingRequest']>, ParentType, ContextType, RequireFields<BookingRequestMutationsRemoveArgs, 'id'>>;
  update?: Resolver<Maybe<ResolversTypes['BookingRequest']>, ParentType, ContextType, RequireFields<BookingRequestMutationsUpdateArgs, 'id' | 'input'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DatetimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Datetime'], any> {
  name: 'Datetime';
}

export type MemberResolvers<ContextType = any, ParentType extends ResolversParentTypes['Member'] = ResolversParentTypes['Member']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Member']>, { __typename: 'Member' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;

  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  bookingRequest?: Resolver<Maybe<ResolversTypes['BookingRequestMutations']>, ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  bookables?: Resolver<Maybe<Array<ResolversTypes['Bookable']>>, ParentType, ContextType>;
  bookingRequest?: Resolver<Maybe<ResolversTypes['BookingRequest']>, ParentType, ContextType, RequireFields<QueryBookingRequestArgs, 'id'>>;
  bookingRequests?: Resolver<Maybe<Array<ResolversTypes['BookingRequest']>>, ParentType, ContextType, RequireFields<QueryBookingRequestsArgs, never>>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Bookable?: BookableResolvers<ContextType>;
  BookingRequest?: BookingRequestResolvers<ContextType>;
  BookingRequestMutations?: BookingRequestMutationsResolvers<ContextType>;
  Datetime?: GraphQLScalarType;
  Member?: MemberResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
