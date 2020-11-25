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

export type Member = {
  __typename?: 'Member';
  id: Scalars['Int'];
  student_id?: Maybe<Scalars['String']>;
  first_name?: Maybe<Scalars['String']>;
  nickname?: Maybe<Scalars['String']>;
  last_name?: Maybe<Scalars['String']>;
  class_programme?: Maybe<Scalars['String']>;
  class_year?: Maybe<Scalars['Int']>;
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


export type Query = {
  __typename?: 'Query';
  me?: Maybe<Member>;
  news: Array<Article>;
};

export type MeHeaderQueryVariables = Exact<{ [key: string]: never; }>;


export type MeHeaderQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'Member' }
    & Pick<Member, 'first_name' | 'last_name' | 'student_id'>
  )> }
);

export type AllNewsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllNewsQuery = (
  { __typename?: 'Query' }
  & { news: Array<(
    { __typename?: 'Article' }
    & Pick<Article, 'id' | 'header' | 'body' | 'published_datetime' | 'latest_edit_datetime'>
    & { author: (
      { __typename?: 'Member' }
      & Pick<Member, 'first_name' | 'last_name'>
    ) }
  )> }
);


export const MeHeaderDocument = gql`
    query MeHeader {
  me {
    first_name
    last_name
    student_id
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
  news {
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