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






export type DocumentsFileMutations = {
  __typename?: 'DocumentsFileMutations';
  move?: Maybe<Array<Maybe<FileChange>>>;
  remove?: Maybe<Array<Maybe<Scalars['String']>>>;
  rename?: Maybe<FileChange>;
};


export type DocumentsFileMutationsMoveArgs = {
  fileNames: Array<Scalars['String']>;
  newFolder: Scalars['String'];
};


export type DocumentsFileMutationsRemoveArgs = {
  fileNames: Array<Scalars['String']>;
};


export type DocumentsFileMutationsRenameArgs = {
  fileName: Scalars['String'];
  newFileName: Scalars['String'];
};

export type FileData = {
  __typename?: 'FileData';
  id: Scalars['String'];
  name: Scalars['String'];
  ext?: Maybe<Scalars['String']>;
  isDir?: Maybe<Scalars['Boolean']>;
  isHidden?: Maybe<Scalars['Boolean']>;
  isSymlink?: Maybe<Scalars['Boolean']>;
  isEncrypted?: Maybe<Scalars['Boolean']>;
  openable?: Maybe<Scalars['Boolean']>;
  selectable?: Maybe<Scalars['Boolean']>;
  draggable?: Maybe<Scalars['Boolean']>;
  droppable?: Maybe<Scalars['Boolean']>;
  dndOpenable?: Maybe<Scalars['Boolean']>;
  size?: Maybe<Scalars['Int']>;
  modDate?: Maybe<Scalars['Date']>;
  childrenCount?: Maybe<Scalars['Int']>;
  color?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  thumbnailUrl?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  document?: Maybe<DocumentsFileMutations>;
};

export type Query = {
  __typename?: 'Query';
  bucket?: Maybe<Array<FileData>>;
  presignedPutDocumentUrl?: Maybe<Scalars['String']>;
};


export type QueryBucketArgs = {
  name: Scalars['String'];
  prefix: Scalars['String'];
};


export type QueryPresignedPutDocumentUrlArgs = {
  fileName: Scalars['String'];
};

export type FileChange = {
  __typename?: 'fileChange';
  oldFile?: Maybe<FileData>;
  file: FileData;
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
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>
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
  Date: ResolverTypeWrapper<Scalars['Date']>;
  DocumentsFileMutations: ResolverTypeWrapper<DocumentsFileMutations>;
  String: ResolverTypeWrapper<Scalars['String']>;
  FileData: ResolverTypeWrapper<FileData>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  fileChange: ResolverTypeWrapper<FileChange>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Date: Scalars['Date'];
  DocumentsFileMutations: DocumentsFileMutations;
  String: Scalars['String'];
  FileData: FileData;
  Boolean: Scalars['Boolean'];
  Int: Scalars['Int'];
  Mutation: {};
  Query: {};
  fileChange: FileChange;
}>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type DocumentsFileMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['DocumentsFileMutations'] = ResolversParentTypes['DocumentsFileMutations']> = ResolversObject<{
  move?: Resolver<Maybe<Array<Maybe<ResolversTypes['fileChange']>>>, ParentType, ContextType, RequireFields<DocumentsFileMutationsMoveArgs, 'fileNames' | 'newFolder'>>;
  remove?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType, RequireFields<DocumentsFileMutationsRemoveArgs, 'fileNames'>>;
  rename?: Resolver<Maybe<ResolversTypes['fileChange']>, ParentType, ContextType, RequireFields<DocumentsFileMutationsRenameArgs, 'fileName' | 'newFileName'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FileDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['FileData'] = ResolversParentTypes['FileData']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['FileData']>, { __typename: 'FileData' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ext?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isDir?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isHidden?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isSymlink?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isEncrypted?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  openable?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  selectable?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  draggable?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  droppable?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  dndOpenable?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  size?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  modDate?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  childrenCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  color?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  thumbnailUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  document?: Resolver<Maybe<ResolversTypes['DocumentsFileMutations']>, ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  bucket?: Resolver<Maybe<Array<ResolversTypes['FileData']>>, ParentType, ContextType, RequireFields<QueryBucketArgs, 'name' | 'prefix'>>;
  presignedPutDocumentUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<QueryPresignedPutDocumentUrlArgs, 'fileName'>>;
}>;

export type FileChangeResolvers<ContextType = any, ParentType extends ResolversParentTypes['fileChange'] = ResolversParentTypes['fileChange']> = ResolversObject<{
  oldFile?: Resolver<Maybe<ResolversTypes['FileData']>, ParentType, ContextType>;
  file?: Resolver<ResolversTypes['FileData'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Date?: GraphQLScalarType;
  DocumentsFileMutations?: DocumentsFileMutationsResolvers<ContextType>;
  FileData?: FileDataResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  fileChange?: FileChangeResolvers<ContextType>;
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
