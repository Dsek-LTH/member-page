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





export type Event = {
  __typename?: 'Event';
  id?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  link?: Maybe<Scalars['String']>;
  start_datetime?: Maybe<Scalars['Datetime']>;
  end_datetime?: Maybe<Scalars['Datetime']>;
};


export type EventFilter = {
  id?: Maybe<Scalars['Int']>;
  start_datetime?: Maybe<Scalars['Datetime']>;
  end_datetime?: Maybe<Scalars['Datetime']>;
};

export type Query = {
  __typename?: 'Query';
  event?: Maybe<Event>;
  events: Array<Event>;
};


export type QueryEventArgs = {
  id: Scalars['Int'];
};


export type QueryEventsArgs = {
  filter?: Maybe<EventFilter>;
};

export type Mutation = {
  __typename?: 'Mutation';
  event?: Maybe<EventMutations>;
};

export type EventMutations = {
  __typename?: 'EventMutations';
  create?: Maybe<Event>;
  update?: Maybe<Event>;
  remove?: Maybe<Event>;
};


export type EventMutationsCreateArgs = {
  input: CreateEvent;
};


export type EventMutationsUpdateArgs = {
  id: Scalars['Int'];
  input: UpdateEvent;
};


export type EventMutationsRemoveArgs = {
  id: Scalars['Int'];
};

export type CreateEvent = {
  title: Scalars['String'];
  description: Scalars['String'];
  link?: Maybe<Scalars['String']>;
  start_datetime: Scalars['Datetime'];
  end_datetime?: Maybe<Scalars['Datetime']>;
};

export type UpdateEvent = {
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  link?: Maybe<Scalars['String']>;
  start_datetime?: Maybe<Scalars['Datetime']>;
  end_datetime?: Maybe<Scalars['Datetime']>;
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
  Event: ResolverTypeWrapper<Event>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Datetime: ResolverTypeWrapper<Scalars['Datetime']>;
  EventFilter: EventFilter;
  Query: ResolverTypeWrapper<{}>;
  Mutation: ResolverTypeWrapper<{}>;
  EventMutations: ResolverTypeWrapper<EventMutations>;
  CreateEvent: CreateEvent;
  UpdateEvent: UpdateEvent;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Event: Event;
  Int: Scalars['Int'];
  String: Scalars['String'];
  Datetime: Scalars['Datetime'];
  EventFilter: EventFilter;
  Query: {};
  Mutation: {};
  EventMutations: EventMutations;
  CreateEvent: CreateEvent;
  UpdateEvent: UpdateEvent;
  Boolean: Scalars['Boolean'];
}>;

export type EventResolvers<ContextType = any, ParentType extends ResolversParentTypes['Event'] = ResolversParentTypes['Event']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Event']>, { __typename: 'Event' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  link?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  start_datetime?: Resolver<Maybe<ResolversTypes['Datetime']>, ParentType, ContextType>;
  end_datetime?: Resolver<Maybe<ResolversTypes['Datetime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DatetimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Datetime'], any> {
  name: 'Datetime';
}

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  event?: Resolver<Maybe<ResolversTypes['Event']>, ParentType, ContextType, RequireFields<QueryEventArgs, 'id'>>;
  events?: Resolver<Array<ResolversTypes['Event']>, ParentType, ContextType, RequireFields<QueryEventsArgs, never>>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  event?: Resolver<Maybe<ResolversTypes['EventMutations']>, ParentType, ContextType>;
}>;

export type EventMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['EventMutations'] = ResolversParentTypes['EventMutations']> = ResolversObject<{
  create?: Resolver<Maybe<ResolversTypes['Event']>, ParentType, ContextType, RequireFields<EventMutationsCreateArgs, 'input'>>;
  update?: Resolver<Maybe<ResolversTypes['Event']>, ParentType, ContextType, RequireFields<EventMutationsUpdateArgs, 'id' | 'input'>>;
  remove?: Resolver<Maybe<ResolversTypes['Event']>, ParentType, ContextType, RequireFields<EventMutationsRemoveArgs, 'id'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Event?: EventResolvers<ContextType>;
  Datetime?: GraphQLScalarType;
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  EventMutations?: EventMutationsResolvers<ContextType>;
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
