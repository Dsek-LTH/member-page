import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Datetime: any;
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

export type CreateCommittee = {
  name: Scalars['String'];
};

export type CreatePosition = {
  name: Scalars['String'];
  committee_id?: Maybe<Scalars['Int']>;
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

export type UpdateCommittee = {
  name?: Maybe<Scalars['String']>;
};

export type UpdatePosition = {
  name?: Maybe<Scalars['String']>;
  committee_id?: Maybe<Scalars['Int']>;
};

export type Article = {
  __typename?: 'Article';
  id: Scalars['Int'];
  body: Scalars['String'];
  header: Scalars['String'];
  author: Member;
  published_datetime: Scalars['Datetime'];
  latest_edit_datetime?: Maybe<Scalars['Datetime']>;
};

export type ArticlePagination = {
  __typename?: 'ArticlePagination';
  articles: Array<Maybe<Article>>;
  pageInfo: PaginationInfo;
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

export type Query = {
  __typename?: 'Query';
  me?: Maybe<Member>;
  positions: Array<Position>;
  committees: Array<Committee>;
  news?: Maybe<ArticlePagination>;
};


export type QueryPositionsArgs = {
  filter?: Maybe<PositionFilter>;
};


export type QueryCommitteesArgs = {
  filter?: Maybe<CommitteeFilter>;
};


export type QueryNewsArgs = {
  page?: Scalars['Int'];
  perPage?: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  position?: Maybe<PositionMutations>;
  committee?: Maybe<CommitteeMutations>;
  createArticle?: Maybe<Article>;
  updateArticle?: Maybe<Article>;
  removeArticle?: Maybe<Scalars['Boolean']>;
};


export type MutationCreateArticleArgs = {
  header: Scalars['String'];
  body: Scalars['String'];
};


export type MutationUpdateArticleArgs = {
  id: Scalars['Int'];
  header?: Maybe<Scalars['String']>;
  body?: Maybe<Scalars['String']>;
};


export type MutationRemoveArticleArgs = {
  id: Scalars['Int'];
};

export type MeHeaderQueryVariables = Exact<{ [key: string]: never; }>;


export type MeHeaderQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'Member' }
    & Pick<Member, 'first_name' | 'last_name' | 'student_id' | 'picture_path'>
  )> }
);

export type AllNewsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllNewsQuery = (
  { __typename?: 'Query' }
  & { news?: Maybe<(
    { __typename?: 'ArticlePagination' }
    & { articles: Array<Maybe<(
      { __typename?: 'Article' }
      & Pick<Article, 'id' | 'header' | 'body' | 'published_datetime' | 'latest_edit_datetime'>
      & { author: (
        { __typename?: 'Member' }
        & Pick<Member, 'first_name' | 'last_name'>
      ) }
    )>> }
  )> }
);


export const MeHeaderDocument = gql`
    query MeHeader {
  me {
    first_name
    last_name
    student_id
    picture_path
  }
}
    `;

/**
 * __useMeHeaderQuery__
 *
 * To run a query within a React component, call `useMeHeaderQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeHeaderQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeHeaderQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeHeaderQuery(baseOptions?: Apollo.QueryHookOptions<MeHeaderQuery, MeHeaderQueryVariables>) {
        return Apollo.useQuery<MeHeaderQuery, MeHeaderQueryVariables>(MeHeaderDocument, baseOptions);
      }
export function useMeHeaderLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeHeaderQuery, MeHeaderQueryVariables>) {
          return Apollo.useLazyQuery<MeHeaderQuery, MeHeaderQueryVariables>(MeHeaderDocument, baseOptions);
        }
export type MeHeaderQueryHookResult = ReturnType<typeof useMeHeaderQuery>;
export type MeHeaderLazyQueryHookResult = ReturnType<typeof useMeHeaderLazyQuery>;
export type MeHeaderQueryResult = Apollo.QueryResult<MeHeaderQuery, MeHeaderQueryVariables>;
export const AllNewsDocument = gql`
    query AllNews {
  news(page: 0, perPage: 10) {
    articles {
      id
      header
      body
      author {
        first_name
        last_name
      }
      published_datetime
      latest_edit_datetime
    }
  }
}
    `;

/**
 * __useAllNewsQuery__
 *
 * To run a query within a React component, call `useAllNewsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllNewsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllNewsQuery({
 *   variables: {
 *   },
 * });
 */
export function useAllNewsQuery(baseOptions?: Apollo.QueryHookOptions<AllNewsQuery, AllNewsQueryVariables>) {
        return Apollo.useQuery<AllNewsQuery, AllNewsQueryVariables>(AllNewsDocument, baseOptions);
      }
export function useAllNewsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllNewsQuery, AllNewsQueryVariables>) {
          return Apollo.useLazyQuery<AllNewsQuery, AllNewsQueryVariables>(AllNewsDocument, baseOptions);
        }
export type AllNewsQueryHookResult = ReturnType<typeof useAllNewsQuery>;
export type AllNewsLazyQueryHookResult = ReturnType<typeof useAllNewsLazyQuery>;
export type AllNewsQueryResult = Apollo.QueryResult<AllNewsQuery, AllNewsQueryVariables>;