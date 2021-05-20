import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  Datetime: any;
  Url: any;
};

export type Article = {
  __typename?: 'Article';
  id: Scalars['Int'];
  body: Scalars['String'];
  bodyEn?: Maybe<Scalars['String']>;
  header: Scalars['String'];
  headerEn?: Maybe<Scalars['String']>;
  author: Member;
  publishedDatetime: Scalars['Datetime'];
  imageUrl?: Maybe<Scalars['Url']>;
  latestEditDatetime?: Maybe<Scalars['Datetime']>;
};

export type ArticleMutations = {
  __typename?: 'ArticleMutations';
  create?: Maybe<CreateArticlePayload>;
  update?: Maybe<UpdateArticlePayload>;
  remove?: Maybe<RemoveArticlePayload>;
  presignedPutUrl?: Maybe<Scalars['String']>;
};


export type ArticleMutationsCreateArgs = {
  input: CreateArticle;
};


export type ArticleMutationsUpdateArgs = {
  id: Scalars['Int'];
  input: UpdateArticle;
};


export type ArticleMutationsRemoveArgs = {
  id: Scalars['Int'];
};


export type ArticleMutationsPresignedPutUrlArgs = {
  fileName: Scalars['String'];
};

export type ArticlePagination = {
  __typename?: 'ArticlePagination';
  articles: Array<Maybe<Article>>;
  pageInfo: PaginationInfo;
};

export type BookingFilter = {
  from?: Maybe<Scalars['Datetime']>;
  to?: Maybe<Scalars['Datetime']>;
  status?: Maybe<BookingStatus>;
};

export type BookingRequest = {
  __typename?: 'BookingRequest';
  id: Scalars['Int'];
  start: Scalars['Datetime'];
  end: Scalars['Datetime'];
  event: Scalars['String'];
  booker: Member;
  what: Scalars['String'];
  status: BookingStatus;
  created: Scalars['Datetime'];
  last_modified?: Maybe<Scalars['Datetime']>;
};

export type BookingRequestMutations = {
  __typename?: 'BookingRequestMutations';
  accept?: Maybe<Scalars['Boolean']>;
  deny?: Maybe<Scalars['Boolean']>;
  remove?: Maybe<BookingRequest>;
  update?: Maybe<BookingRequest>;
  create?: Maybe<BookingRequest>;
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
  input: UpdateBookingRequest;
};


export type BookingRequestMutationsCreateArgs = {
  input: CreateBookingRequest;
};

export enum BookingStatus {
  Pending = 'PENDING',
  Accepted = 'ACCEPTED',
  Denied = 'DENIED'
}

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

export type CreateArticle = {
  header: Scalars['String'];
  headerEn?: Maybe<Scalars['String']>;
  body: Scalars['String'];
  bodyEn?: Maybe<Scalars['String']>;
  imageName?: Maybe<Scalars['String']>;
};

export type CreateArticlePayload = {
  __typename?: 'CreateArticlePayload';
  article: Article;
  uploadUrl?: Maybe<Scalars['Url']>;
};

export type CreateBookingRequest = {
  start: Scalars['Datetime'];
  end: Scalars['Datetime'];
  what: Scalars['String'];
  event: Scalars['String'];
  booker_id: Scalars['Int'];
};

export type CreateCommittee = {
  name: Scalars['String'];
};

export type CreateEvent = {
  title: Scalars['String'];
  description: Scalars['String'];
  link?: Maybe<Scalars['String']>;
  start_datetime: Scalars['Datetime'];
  end_datetime?: Maybe<Scalars['Datetime']>;
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

export type Mutation = {
  __typename?: 'Mutation';
  member?: Maybe<MemberMutations>;
  position?: Maybe<PositionMutations>;
  committee?: Maybe<CommitteeMutations>;
  mandate?: Maybe<MandateMutations>;
  article?: Maybe<ArticleMutations>;
  event?: Maybe<EventMutations>;
  bookingRequest?: Maybe<BookingRequestMutations>;
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

export type Query = {
  __typename?: 'Query';
  me?: Maybe<Member>;
  members: Array<Member>;
  memberById?: Maybe<Member>;
  memberByStudentId?: Maybe<Member>;
  positions: Array<Position>;
  committees: Array<Committee>;
  mandates: Array<Mandate>;
  news?: Maybe<ArticlePagination>;
  article?: Maybe<Article>;
  event?: Maybe<Event>;
  events: Array<Event>;
  bookingRequests?: Maybe<Array<BookingRequest>>;
  bookingRequest?: Maybe<BookingRequest>;
};


export type QueryMembersArgs = {
  filter?: Maybe<MemberFilter>;
};


export type QueryMemberByIdArgs = {
  id: Scalars['Int'];
};


export type QueryMemberByStudentIdArgs = {
  student_id: Scalars['String'];
};


export type QueryPositionsArgs = {
  filter?: Maybe<PositionFilter>;
};


export type QueryCommitteesArgs = {
  filter?: Maybe<CommitteeFilter>;
};


export type QueryMandatesArgs = {
  filter?: Maybe<MandateFilter>;
};


export type QueryNewsArgs = {
  page?: Scalars['Int'];
  perPage?: Scalars['Int'];
};


export type QueryArticleArgs = {
  id: Scalars['Int'];
};


export type QueryEventArgs = {
  id: Scalars['Int'];
};


export type QueryEventsArgs = {
  filter?: Maybe<EventFilter>;
};


export type QueryBookingRequestsArgs = {
  filter?: Maybe<BookingFilter>;
};


export type QueryBookingRequestArgs = {
  id: Scalars['Int'];
};

export type RemoveArticlePayload = {
  __typename?: 'RemoveArticlePayload';
  article: Article;
};

export type UpdateArticle = {
  header?: Maybe<Scalars['String']>;
  headerEn?: Maybe<Scalars['String']>;
  body?: Maybe<Scalars['String']>;
  bodyEn?: Maybe<Scalars['String']>;
  imageName?: Maybe<Scalars['String']>;
};

export type UpdateArticlePayload = {
  __typename?: 'UpdateArticlePayload';
  article: Article;
  uploadUrl?: Maybe<Scalars['Url']>;
};

export type UpdateBookingRequest = {
  start?: Maybe<Scalars['Datetime']>;
  end?: Maybe<Scalars['Datetime']>;
  what?: Maybe<Scalars['String']>;
  event?: Maybe<Scalars['String']>;
};

export type UpdateBookingRequestStatus = {
  status?: Maybe<BookingStatus>;
};

export type UpdateCommittee = {
  name?: Maybe<Scalars['String']>;
};

export type UpdateEvent = {
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  link?: Maybe<Scalars['String']>;
  start_datetime?: Maybe<Scalars['Datetime']>;
  end_datetime?: Maybe<Scalars['Datetime']>;
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


export type MeHeaderQueryVariables = Exact<{ [key: string]: never; }>;


export type MeHeaderQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'Member' }
    & Pick<Member, 'id' | 'first_name' | 'last_name' | 'student_id' | 'picture_path'>
  )> }
);

export type MemberPageQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type MemberPageQuery = (
  { __typename?: 'Query' }
  & { memberById?: Maybe<(
    { __typename?: 'Member' }
    & Pick<Member, 'id' | 'first_name' | 'nickname' | 'last_name' | 'student_id' | 'class_programme' | 'class_year' | 'picture_path'>
  )> }
);

export type UpdateMemberMutationVariables = Exact<{
  id: Scalars['Int'];
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  nickname?: Maybe<Scalars['String']>;
  classProgramme?: Maybe<Scalars['String']>;
  classYear?: Maybe<Scalars['Int']>;
  picturePath?: Maybe<Scalars['String']>;
}>;


export type UpdateMemberMutation = (
  { __typename?: 'Mutation' }
  & { member?: Maybe<(
    { __typename?: 'MemberMutations' }
    & { update?: Maybe<(
      { __typename?: 'Member' }
      & Pick<Member, 'first_name' | 'last_name' | 'nickname' | 'class_programme' | 'class_year' | 'picture_path'>
    )> }
  )> }
);

export type NewsPageQueryVariables = Exact<{
  page_number: Scalars['Int'];
  per_page: Scalars['Int'];
}>;


export type NewsPageQuery = (
  { __typename?: 'Query' }
  & { news?: Maybe<(
    { __typename?: 'ArticlePagination' }
    & { articles: Array<Maybe<(
      { __typename?: 'Article' }
      & Pick<Article, 'id' | 'header' | 'headerEn' | 'body' | 'bodyEn' | 'imageUrl' | 'publishedDatetime' | 'latestEditDatetime'>
      & { author: (
        { __typename?: 'Member' }
        & Pick<Member, 'id' | 'first_name' | 'last_name'>
      ) }
    )>>, pageInfo: (
      { __typename?: 'PaginationInfo' }
      & Pick<PaginationInfo, 'totalPages'>
    ) }
  )> }
);

export type NewsPageInfoQueryVariables = Exact<{
  page_number: Scalars['Int'];
  per_page: Scalars['Int'];
}>;


export type NewsPageInfoQuery = (
  { __typename?: 'Query' }
  & { news?: Maybe<(
    { __typename?: 'ArticlePagination' }
    & { pageInfo: (
      { __typename?: 'PaginationInfo' }
      & Pick<PaginationInfo, 'totalPages' | 'totalItems' | 'hasNextPage' | 'hasPreviousPage'>
    ) }
  )> }
);

export type ArticleQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type ArticleQuery = (
  { __typename?: 'Query' }
  & { article?: Maybe<(
    { __typename?: 'Article' }
    & Pick<Article, 'id' | 'body' | 'bodyEn' | 'header' | 'headerEn' | 'imageUrl' | 'publishedDatetime'>
    & { author: (
      { __typename?: 'Member' }
      & Pick<Member, 'id' | 'first_name' | 'last_name'>
    ) }
  )> }
);

export type UpdateArticleMutationVariables = Exact<{
  id: Scalars['Int'];
  header?: Maybe<Scalars['String']>;
  body?: Maybe<Scalars['String']>;
  headerEn?: Maybe<Scalars['String']>;
  bodyEn?: Maybe<Scalars['String']>;
  imageName?: Maybe<Scalars['String']>;
}>;


export type UpdateArticleMutation = (
  { __typename?: 'Mutation' }
  & { article?: Maybe<(
    { __typename?: 'ArticleMutations' }
    & { update?: Maybe<(
      { __typename?: 'UpdateArticlePayload' }
      & Pick<UpdateArticlePayload, 'uploadUrl'>
      & { article: (
        { __typename?: 'Article' }
        & Pick<Article, 'id' | 'header' | 'body' | 'headerEn' | 'bodyEn' | 'imageUrl'>
      ) }
    )> }
  )> }
);

export type CreateArticleMutationVariables = Exact<{
  header: Scalars['String'];
  body: Scalars['String'];
  headerEn: Scalars['String'];
  bodyEn: Scalars['String'];
  imageName?: Maybe<Scalars['String']>;
}>;


export type CreateArticleMutation = (
  { __typename?: 'Mutation' }
  & { article?: Maybe<(
    { __typename?: 'ArticleMutations' }
    & { create?: Maybe<(
      { __typename?: 'CreateArticlePayload' }
      & Pick<CreateArticlePayload, 'uploadUrl'>
      & { article: (
        { __typename?: 'Article' }
        & Pick<Article, 'id' | 'header' | 'body' | 'headerEn' | 'bodyEn' | 'imageUrl'>
      ) }
    )> }
  )> }
);

export type RemoveArticleMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type RemoveArticleMutation = (
  { __typename?: 'Mutation' }
  & { article?: Maybe<(
    { __typename?: 'ArticleMutations' }
    & { remove?: Maybe<(
      { __typename?: 'RemoveArticlePayload' }
      & { article: (
        { __typename?: 'Article' }
        & Pick<Article, 'id'>
      ) }
    )> }
  )> }
);

export type GetPresignedPutUrlMutationVariables = Exact<{
  fileName: Scalars['String'];
}>;


export type GetPresignedPutUrlMutation = (
  { __typename?: 'Mutation' }
  & { article?: Maybe<(
    { __typename?: 'ArticleMutations' }
    & Pick<ArticleMutations, 'presignedPutUrl'>
  )> }
);


export const MeHeaderDocument = gql`
    query MeHeader {
  me {
    id
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
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeHeaderQuery, MeHeaderQueryVariables>(MeHeaderDocument, options);
      }
export function useMeHeaderLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeHeaderQuery, MeHeaderQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeHeaderQuery, MeHeaderQueryVariables>(MeHeaderDocument, options);
        }
export type MeHeaderQueryHookResult = ReturnType<typeof useMeHeaderQuery>;
export type MeHeaderLazyQueryHookResult = ReturnType<typeof useMeHeaderLazyQuery>;
export type MeHeaderQueryResult = Apollo.QueryResult<MeHeaderQuery, MeHeaderQueryVariables>;
export const MemberPageDocument = gql`
    query MemberPage($id: Int!) {
  memberById(id: $id) {
    id
    first_name
    nickname
    last_name
    student_id
    class_programme
    class_year
    picture_path
  }
}
    `;

/**
 * __useMemberPageQuery__
 *
 * To run a query within a React component, call `useMemberPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useMemberPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMemberPageQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useMemberPageQuery(baseOptions: Apollo.QueryHookOptions<MemberPageQuery, MemberPageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MemberPageQuery, MemberPageQueryVariables>(MemberPageDocument, options);
      }
export function useMemberPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MemberPageQuery, MemberPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MemberPageQuery, MemberPageQueryVariables>(MemberPageDocument, options);
        }
export type MemberPageQueryHookResult = ReturnType<typeof useMemberPageQuery>;
export type MemberPageLazyQueryHookResult = ReturnType<typeof useMemberPageLazyQuery>;
export type MemberPageQueryResult = Apollo.QueryResult<MemberPageQuery, MemberPageQueryVariables>;
export const UpdateMemberDocument = gql`
    mutation UpdateMember($id: Int!, $firstName: String, $lastName: String, $nickname: String, $classProgramme: String, $classYear: Int, $picturePath: String) {
  member {
    update(
      id: $id
      input: {first_name: $firstName, last_name: $lastName, nickname: $nickname, class_programme: $classProgramme, class_year: $classYear, picture_path: $picturePath}
    ) {
      first_name
      last_name
      nickname
      class_programme
      class_year
      picture_path
    }
  }
}
    `;
export type UpdateMemberMutationFn = Apollo.MutationFunction<UpdateMemberMutation, UpdateMemberMutationVariables>;

/**
 * __useUpdateMemberMutation__
 *
 * To run a mutation, you first call `useUpdateMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMemberMutation, { data, loading, error }] = useUpdateMemberMutation({
 *   variables: {
 *      id: // value for 'id'
 *      firstName: // value for 'firstName'
 *      lastName: // value for 'lastName'
 *      nickname: // value for 'nickname'
 *      classProgramme: // value for 'classProgramme'
 *      classYear: // value for 'classYear'
 *      picturePath: // value for 'picturePath'
 *   },
 * });
 */
export function useUpdateMemberMutation(baseOptions?: Apollo.MutationHookOptions<UpdateMemberMutation, UpdateMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateMemberMutation, UpdateMemberMutationVariables>(UpdateMemberDocument, options);
      }
export type UpdateMemberMutationHookResult = ReturnType<typeof useUpdateMemberMutation>;
export type UpdateMemberMutationResult = Apollo.MutationResult<UpdateMemberMutation>;
export type UpdateMemberMutationOptions = Apollo.BaseMutationOptions<UpdateMemberMutation, UpdateMemberMutationVariables>;
export const NewsPageDocument = gql`
    query NewsPage($page_number: Int!, $per_page: Int!) {
  news(page: $page_number, perPage: $per_page) {
    articles {
      id
      header
      headerEn
      body
      bodyEn
      author {
        id
        first_name
        last_name
      }
      imageUrl
      publishedDatetime
      latestEditDatetime
    }
    pageInfo {
      totalPages
    }
  }
}
    `;

/**
 * __useNewsPageQuery__
 *
 * To run a query within a React component, call `useNewsPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useNewsPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewsPageQuery({
 *   variables: {
 *      page_number: // value for 'page_number'
 *      per_page: // value for 'per_page'
 *   },
 * });
 */
export function useNewsPageQuery(baseOptions: Apollo.QueryHookOptions<NewsPageQuery, NewsPageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NewsPageQuery, NewsPageQueryVariables>(NewsPageDocument, options);
      }
export function useNewsPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NewsPageQuery, NewsPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NewsPageQuery, NewsPageQueryVariables>(NewsPageDocument, options);
        }
export type NewsPageQueryHookResult = ReturnType<typeof useNewsPageQuery>;
export type NewsPageLazyQueryHookResult = ReturnType<typeof useNewsPageLazyQuery>;
export type NewsPageQueryResult = Apollo.QueryResult<NewsPageQuery, NewsPageQueryVariables>;
export const NewsPageInfoDocument = gql`
    query NewsPageInfo($page_number: Int!, $per_page: Int!) {
  news(page: $page_number, perPage: $per_page) {
    pageInfo {
      totalPages
      totalItems
      hasNextPage
      hasPreviousPage
    }
  }
}
    `;

/**
 * __useNewsPageInfoQuery__
 *
 * To run a query within a React component, call `useNewsPageInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useNewsPageInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewsPageInfoQuery({
 *   variables: {
 *      page_number: // value for 'page_number'
 *      per_page: // value for 'per_page'
 *   },
 * });
 */
export function useNewsPageInfoQuery(baseOptions: Apollo.QueryHookOptions<NewsPageInfoQuery, NewsPageInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NewsPageInfoQuery, NewsPageInfoQueryVariables>(NewsPageInfoDocument, options);
      }
export function useNewsPageInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NewsPageInfoQuery, NewsPageInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NewsPageInfoQuery, NewsPageInfoQueryVariables>(NewsPageInfoDocument, options);
        }
export type NewsPageInfoQueryHookResult = ReturnType<typeof useNewsPageInfoQuery>;
export type NewsPageInfoLazyQueryHookResult = ReturnType<typeof useNewsPageInfoLazyQuery>;
export type NewsPageInfoQueryResult = Apollo.QueryResult<NewsPageInfoQuery, NewsPageInfoQueryVariables>;
export const ArticleDocument = gql`
    query Article($id: Int!) {
  article(id: $id) {
    id
    body
    bodyEn
    header
    headerEn
    author {
      id
      first_name
      last_name
    }
    imageUrl
    publishedDatetime
  }
}
    `;

/**
 * __useArticleQuery__
 *
 * To run a query within a React component, call `useArticleQuery` and pass it any options that fit your needs.
 * When your component renders, `useArticleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useArticleQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useArticleQuery(baseOptions: Apollo.QueryHookOptions<ArticleQuery, ArticleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ArticleQuery, ArticleQueryVariables>(ArticleDocument, options);
      }
export function useArticleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ArticleQuery, ArticleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ArticleQuery, ArticleQueryVariables>(ArticleDocument, options);
        }
export type ArticleQueryHookResult = ReturnType<typeof useArticleQuery>;
export type ArticleLazyQueryHookResult = ReturnType<typeof useArticleLazyQuery>;
export type ArticleQueryResult = Apollo.QueryResult<ArticleQuery, ArticleQueryVariables>;
export const UpdateArticleDocument = gql`
    mutation UpdateArticle($id: Int!, $header: String, $body: String, $headerEn: String, $bodyEn: String, $imageName: String) {
  article {
    update(
      id: $id
      input: {header: $header, body: $body, headerEn: $headerEn, bodyEn: $bodyEn, imageName: $imageName}
    ) {
      article {
        id
        header
        body
        headerEn
        bodyEn
        imageUrl
      }
      uploadUrl
    }
  }
}
    `;
export type UpdateArticleMutationFn = Apollo.MutationFunction<UpdateArticleMutation, UpdateArticleMutationVariables>;

/**
 * __useUpdateArticleMutation__
 *
 * To run a mutation, you first call `useUpdateArticleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateArticleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateArticleMutation, { data, loading, error }] = useUpdateArticleMutation({
 *   variables: {
 *      id: // value for 'id'
 *      header: // value for 'header'
 *      body: // value for 'body'
 *      headerEn: // value for 'headerEn'
 *      bodyEn: // value for 'bodyEn'
 *      imageName: // value for 'imageName'
 *   },
 * });
 */
export function useUpdateArticleMutation(baseOptions?: Apollo.MutationHookOptions<UpdateArticleMutation, UpdateArticleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateArticleMutation, UpdateArticleMutationVariables>(UpdateArticleDocument, options);
      }
export type UpdateArticleMutationHookResult = ReturnType<typeof useUpdateArticleMutation>;
export type UpdateArticleMutationResult = Apollo.MutationResult<UpdateArticleMutation>;
export type UpdateArticleMutationOptions = Apollo.BaseMutationOptions<UpdateArticleMutation, UpdateArticleMutationVariables>;
export const CreateArticleDocument = gql`
    mutation CreateArticle($header: String!, $body: String!, $headerEn: String!, $bodyEn: String!, $imageName: String) {
  article {
    create(
      input: {header: $header, body: $body, headerEn: $headerEn, bodyEn: $bodyEn, imageName: $imageName}
    ) {
      article {
        id
        header
        body
        headerEn
        bodyEn
        imageUrl
      }
      uploadUrl
    }
  }
}
    `;
export type CreateArticleMutationFn = Apollo.MutationFunction<CreateArticleMutation, CreateArticleMutationVariables>;

/**
 * __useCreateArticleMutation__
 *
 * To run a mutation, you first call `useCreateArticleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateArticleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createArticleMutation, { data, loading, error }] = useCreateArticleMutation({
 *   variables: {
 *      header: // value for 'header'
 *      body: // value for 'body'
 *      headerEn: // value for 'headerEn'
 *      bodyEn: // value for 'bodyEn'
 *      imageName: // value for 'imageName'
 *   },
 * });
 */
export function useCreateArticleMutation(baseOptions?: Apollo.MutationHookOptions<CreateArticleMutation, CreateArticleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateArticleMutation, CreateArticleMutationVariables>(CreateArticleDocument, options);
      }
export type CreateArticleMutationHookResult = ReturnType<typeof useCreateArticleMutation>;
export type CreateArticleMutationResult = Apollo.MutationResult<CreateArticleMutation>;
export type CreateArticleMutationOptions = Apollo.BaseMutationOptions<CreateArticleMutation, CreateArticleMutationVariables>;
export const RemoveArticleDocument = gql`
    mutation RemoveArticle($id: Int!) {
  article {
    remove(id: $id) {
      article {
        id
      }
    }
  }
}
    `;
export type RemoveArticleMutationFn = Apollo.MutationFunction<RemoveArticleMutation, RemoveArticleMutationVariables>;

/**
 * __useRemoveArticleMutation__
 *
 * To run a mutation, you first call `useRemoveArticleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveArticleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeArticleMutation, { data, loading, error }] = useRemoveArticleMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveArticleMutation(baseOptions?: Apollo.MutationHookOptions<RemoveArticleMutation, RemoveArticleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveArticleMutation, RemoveArticleMutationVariables>(RemoveArticleDocument, options);
      }
export type RemoveArticleMutationHookResult = ReturnType<typeof useRemoveArticleMutation>;
export type RemoveArticleMutationResult = Apollo.MutationResult<RemoveArticleMutation>;
export type RemoveArticleMutationOptions = Apollo.BaseMutationOptions<RemoveArticleMutation, RemoveArticleMutationVariables>;
export const GetPresignedPutUrlDocument = gql`
    mutation getPresignedPutUrl($fileName: String!) {
  article {
    presignedPutUrl(fileName: $fileName)
  }
}
    `;
export type GetPresignedPutUrlMutationFn = Apollo.MutationFunction<GetPresignedPutUrlMutation, GetPresignedPutUrlMutationVariables>;

/**
 * __useGetPresignedPutUrlMutation__
 *
 * To run a mutation, you first call `useGetPresignedPutUrlMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGetPresignedPutUrlMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [getPresignedPutUrlMutation, { data, loading, error }] = useGetPresignedPutUrlMutation({
 *   variables: {
 *      fileName: // value for 'fileName'
 *   },
 * });
 */
export function useGetPresignedPutUrlMutation(baseOptions?: Apollo.MutationHookOptions<GetPresignedPutUrlMutation, GetPresignedPutUrlMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GetPresignedPutUrlMutation, GetPresignedPutUrlMutationVariables>(GetPresignedPutUrlDocument, options);
      }
export type GetPresignedPutUrlMutationHookResult = ReturnType<typeof useGetPresignedPutUrlMutation>;
export type GetPresignedPutUrlMutationResult = Apollo.MutationResult<GetPresignedPutUrlMutation>;
export type GetPresignedPutUrlMutationOptions = Apollo.BaseMutationOptions<GetPresignedPutUrlMutation, GetPresignedPutUrlMutationVariables>;