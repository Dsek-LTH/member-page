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
  author: Member;
  body: Scalars['String'];
  bodyEn?: Maybe<Scalars['String']>;
  header: Scalars['String'];
  headerEn?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  imageUrl?: Maybe<Scalars['Url']>;
  latestEditDatetime?: Maybe<Scalars['Datetime']>;
  publishedDatetime: Scalars['Datetime'];
};

export type ArticleMutations = {
  __typename?: 'ArticleMutations';
  create?: Maybe<CreateArticlePayload>;
  presignedPutUrl?: Maybe<Scalars['String']>;
  remove?: Maybe<RemoveArticlePayload>;
  update?: Maybe<UpdateArticlePayload>;
};


export type ArticleMutationsCreateArgs = {
  input: CreateArticle;
};


export type ArticleMutationsPresignedPutUrlArgs = {
  fileName: Scalars['String'];
};


export type ArticleMutationsRemoveArgs = {
  id: Scalars['Int'];
};


export type ArticleMutationsUpdateArgs = {
  id: Scalars['Int'];
  input: UpdateArticle;
};

export type ArticlePagination = {
  __typename?: 'ArticlePagination';
  articles: Array<Maybe<Article>>;
  pageInfo: PaginationInfo;
};

export type BookingFilter = {
  from?: Maybe<Scalars['Datetime']>;
  status?: Maybe<BookingStatus>;
  to?: Maybe<Scalars['Datetime']>;
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
  what: Scalars['String'];
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

export type Committee = {
  __typename?: 'Committee';
  id: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
};

export type CommitteeFilter = {
  id?: Maybe<Scalars['Int']>;
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
  id: Scalars['Int'];
};


export type CommitteeMutationsUpdateArgs = {
  id: Scalars['Int'];
  input: UpdateCommittee;
};

export type CommitteePagination = {
  __typename?: 'CommitteePagination';
  committees: Array<Maybe<Committee>>;
  pageInfo: PaginationInfo;
};

export type CreateArticle = {
  body: Scalars['String'];
  bodyEn?: Maybe<Scalars['String']>;
  header: Scalars['String'];
  headerEn?: Maybe<Scalars['String']>;
  imageName?: Maybe<Scalars['String']>;
};

export type CreateArticlePayload = {
  __typename?: 'CreateArticlePayload';
  article: Article;
  uploadUrl?: Maybe<Scalars['Url']>;
};

export type CreateBookingRequest = {
  booker_id: Scalars['Int'];
  end: Scalars['Datetime'];
  event: Scalars['String'];
  start: Scalars['Datetime'];
  what: Scalars['String'];
};

export type CreateCommittee = {
  name: Scalars['String'];
};

export type CreateEvent = {
  description: Scalars['String'];
  end_datetime?: Maybe<Scalars['Datetime']>;
  link?: Maybe<Scalars['String']>;
  start_datetime: Scalars['Datetime'];
  title: Scalars['String'];
};

export type CreateMandate = {
  end_date: Scalars['Date'];
  member_id: Scalars['Int'];
  position_id: Scalars['Int'];
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
  committee_id?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
};



export type Event = {
  __typename?: 'Event';
  description?: Maybe<Scalars['String']>;
  end_datetime?: Maybe<Scalars['Datetime']>;
  id?: Maybe<Scalars['Int']>;
  link?: Maybe<Scalars['String']>;
  start_datetime?: Maybe<Scalars['Datetime']>;
  title?: Maybe<Scalars['String']>;
};

export type EventFilter = {
  end_datetime?: Maybe<Scalars['Datetime']>;
  id?: Maybe<Scalars['Int']>;
  start_datetime?: Maybe<Scalars['Datetime']>;
};

export type EventMutations = {
  __typename?: 'EventMutations';
  create?: Maybe<Event>;
  remove?: Maybe<Event>;
  update?: Maybe<Event>;
};


export type EventMutationsCreateArgs = {
  input: CreateEvent;
};


export type EventMutationsRemoveArgs = {
  id: Scalars['Int'];
};


export type EventMutationsUpdateArgs = {
  id: Scalars['Int'];
  input: UpdateEvent;
};

export type Mandate = {
  __typename?: 'Mandate';
  end_date: Scalars['Date'];
  id: Scalars['Int'];
  member?: Maybe<Member>;
  position?: Maybe<Position>;
  start_date: Scalars['Date'];
};

export type MandateFilter = {
  end_date?: Maybe<Scalars['Date']>;
  id?: Maybe<Scalars['Int']>;
  member_id?: Maybe<Scalars['Int']>;
  position_id?: Maybe<Scalars['Int']>;
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
  id: Scalars['Int'];
};


export type MandateMutationsUpdateArgs = {
  id: Scalars['Int'];
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
  id: Scalars['Int'];
  last_name?: Maybe<Scalars['String']>;
  nickname?: Maybe<Scalars['String']>;
  picture_path?: Maybe<Scalars['String']>;
  student_id?: Maybe<Scalars['String']>;
};

export type MemberFilter = {
  class_programme?: Maybe<Scalars['String']>;
  class_year?: Maybe<Scalars['Int']>;
  first_name?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
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
  id: Scalars['Int'];
};


export type MemberMutationsUpdateArgs = {
  id: Scalars['Int'];
  input: UpdateMember;
};

export type MemberPagination = {
  __typename?: 'MemberPagination';
  members: Array<Maybe<Member>>;
  pageInfo: PaginationInfo;
};

export type Mutation = {
  __typename?: 'Mutation';
  article?: Maybe<ArticleMutations>;
  bookingRequest?: Maybe<BookingRequestMutations>;
  committee?: Maybe<CommitteeMutations>;
  event?: Maybe<EventMutations>;
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

export type Position = {
  __typename?: 'Position';
  committee?: Maybe<Committee>;
  id: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
};

export type PositionFilter = {
  committee_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
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
  id: Scalars['Int'];
};


export type PositionMutationsUpdateArgs = {
  id: Scalars['Int'];
  input: UpdatePosition;
};

export type PositionPagination = {
  __typename?: 'PositionPagination';
  pageInfo: PaginationInfo;
  positions: Array<Maybe<Position>>;
};

export type Query = {
  __typename?: 'Query';
  article?: Maybe<Article>;
  bookingRequest?: Maybe<BookingRequest>;
  bookingRequests?: Maybe<Array<BookingRequest>>;
  committees?: Maybe<CommitteePagination>;
  event?: Maybe<Event>;
  events: Array<Event>;
  mandates?: Maybe<MandatePagination>;
  me?: Maybe<Member>;
  memberById?: Maybe<Member>;
  memberByStudentId?: Maybe<Member>;
  members?: Maybe<MemberPagination>;
  news?: Maybe<ArticlePagination>;
  positions?: Maybe<PositionPagination>;
};


export type QueryArticleArgs = {
  id: Scalars['Int'];
};


export type QueryBookingRequestArgs = {
  id: Scalars['Int'];
};


export type QueryBookingRequestsArgs = {
  filter?: Maybe<BookingFilter>;
};


export type QueryCommitteesArgs = {
  filter?: Maybe<CommitteeFilter>;
  page?: Scalars['Int'];
  perPage?: Scalars['Int'];
};


export type QueryEventArgs = {
  id: Scalars['Int'];
};


export type QueryEventsArgs = {
  filter?: Maybe<EventFilter>;
};


export type QueryMandatesArgs = {
  filter?: Maybe<MandateFilter>;
  page?: Scalars['Int'];
  perPage?: Scalars['Int'];
};


export type QueryMemberByIdArgs = {
  id: Scalars['Int'];
};


export type QueryMemberByStudentIdArgs = {
  student_id: Scalars['String'];
};


export type QueryMembersArgs = {
  filter?: Maybe<MemberFilter>;
  page?: Scalars['Int'];
  perPage?: Scalars['Int'];
};


export type QueryNewsArgs = {
  page?: Scalars['Int'];
  perPage?: Scalars['Int'];
};


export type QueryPositionsArgs = {
  filter?: Maybe<PositionFilter>;
  page?: Scalars['Int'];
  perPage?: Scalars['Int'];
};

export type RemoveArticlePayload = {
  __typename?: 'RemoveArticlePayload';
  article: Article;
};

export type UpdateArticle = {
  body?: Maybe<Scalars['String']>;
  bodyEn?: Maybe<Scalars['String']>;
  header?: Maybe<Scalars['String']>;
  headerEn?: Maybe<Scalars['String']>;
  imageName?: Maybe<Scalars['String']>;
};

export type UpdateArticlePayload = {
  __typename?: 'UpdateArticlePayload';
  article: Article;
  uploadUrl?: Maybe<Scalars['Url']>;
};

export type UpdateBookingRequest = {
  end?: Maybe<Scalars['Datetime']>;
  event?: Maybe<Scalars['String']>;
  start?: Maybe<Scalars['Datetime']>;
  what?: Maybe<Scalars['String']>;
};

export type UpdateBookingRequestStatus = {
  status?: Maybe<BookingStatus>;
};

export type UpdateCommittee = {
  name?: Maybe<Scalars['String']>;
};

export type UpdateEvent = {
  description?: Maybe<Scalars['String']>;
  end_datetime?: Maybe<Scalars['Datetime']>;
  link?: Maybe<Scalars['String']>;
  start_datetime?: Maybe<Scalars['Datetime']>;
  title?: Maybe<Scalars['String']>;
};

export type UpdateMandate = {
  end_date?: Maybe<Scalars['Date']>;
  member_id?: Maybe<Scalars['Int']>;
  position_id?: Maybe<Scalars['Int']>;
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
  committee_id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
};


export type GetBookingsQueryVariables = Exact<{
  from?: Maybe<Scalars['Datetime']>;
  to?: Maybe<Scalars['Datetime']>;
  status?: Maybe<BookingStatus>;
}>;


export type GetBookingsQuery = (
  { __typename?: 'Query' }
  & { bookingRequests?: Maybe<Array<(
    { __typename?: 'BookingRequest' }
    & Pick<BookingRequest, 'id' | 'start' | 'end' | 'event' | 'what' | 'status' | 'created' | 'last_modified'>
    & { booker: (
      { __typename?: 'Member' }
      & Pick<Member, 'id' | 'first_name' | 'nickname' | 'last_name'>
    ) }
  )>> }
);

export type CreateBookingRequestMutationVariables = Exact<{
  bookerId: Scalars['Int'];
  start: Scalars['Datetime'];
  end: Scalars['Datetime'];
  what: Scalars['String'];
  event: Scalars['String'];
}>;


export type CreateBookingRequestMutation = (
  { __typename?: 'Mutation' }
  & { bookingRequest?: Maybe<(
    { __typename?: 'BookingRequestMutations' }
    & { create?: Maybe<(
      { __typename?: 'BookingRequest' }
      & Pick<BookingRequest, 'start' | 'end' | 'what' | 'event'>
    )> }
  )> }
);

export type AcceptBookingRequestMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type AcceptBookingRequestMutation = (
  { __typename?: 'Mutation' }
  & { bookingRequest?: Maybe<(
    { __typename?: 'BookingRequestMutations' }
    & Pick<BookingRequestMutations, 'accept'>
  )> }
);

export type DenyBookingRequestMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DenyBookingRequestMutation = (
  { __typename?: 'Mutation' }
  & { bookingRequest?: Maybe<(
    { __typename?: 'BookingRequestMutations' }
    & Pick<BookingRequestMutations, 'deny'>
  )> }
);

export type EventsQueryVariables = Exact<{ [key: string]: never; }>;


export type EventsQuery = (
  { __typename?: 'Query' }
  & { events: Array<(
    { __typename?: 'Event' }
    & Pick<Event, 'title' | 'description' | 'start_datetime' | 'end_datetime' | 'link' | 'id'>
  )> }
);

export type MeHeaderQueryVariables = Exact<{ [key: string]: never; }>;


export type MeHeaderQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'Member' }
    & Pick<Member, 'id' | 'first_name' | 'nickname' | 'last_name' | 'student_id' | 'picture_path'>
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

export type CreateMemberMutationVariables = Exact<{
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  classProgramme: Scalars['String'];
  classYear: Scalars['Int'];
  studentId: Scalars['String'];
}>;


export type CreateMemberMutation = (
  { __typename?: 'Mutation' }
  & { member?: Maybe<(
    { __typename?: 'MemberMutations' }
    & { create?: Maybe<(
      { __typename?: 'Member' }
      & Pick<Member, 'first_name' | 'last_name' | 'class_programme' | 'class_year' | 'student_id'>
    )> }
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
        & Pick<Member, 'id' | 'first_name' | 'nickname' | 'last_name'>
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
      & Pick<Member, 'id' | 'first_name' | 'nickname' | 'last_name'>
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


export const GetBookingsDocument = gql`
    query GetBookings($from: Datetime, $to: Datetime, $status: BookingStatus) {
  bookingRequests(filter: {from: $from, to: $to, status: $status}) {
    id
    start
    end
    event
    booker {
      id
      first_name
      nickname
      last_name
    }
    what
    status
    created
    last_modified
  }
}
    `;

/**
 * __useGetBookingsQuery__
 *
 * To run a query within a React component, call `useGetBookingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBookingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBookingsQuery({
 *   variables: {
 *      from: // value for 'from'
 *      to: // value for 'to'
 *      status: // value for 'status'
 *   },
 * });
 */
export function useGetBookingsQuery(baseOptions?: Apollo.QueryHookOptions<GetBookingsQuery, GetBookingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBookingsQuery, GetBookingsQueryVariables>(GetBookingsDocument, options);
      }
export function useGetBookingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBookingsQuery, GetBookingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBookingsQuery, GetBookingsQueryVariables>(GetBookingsDocument, options);
        }
export type GetBookingsQueryHookResult = ReturnType<typeof useGetBookingsQuery>;
export type GetBookingsLazyQueryHookResult = ReturnType<typeof useGetBookingsLazyQuery>;
export type GetBookingsQueryResult = Apollo.QueryResult<GetBookingsQuery, GetBookingsQueryVariables>;
export const CreateBookingRequestDocument = gql`
    mutation CreateBookingRequest($bookerId: Int!, $start: Datetime!, $end: Datetime!, $what: String!, $event: String!) {
  bookingRequest {
    create(
      input: {start: $start, end: $end, what: $what, event: $event, booker_id: $bookerId}
    ) {
      start
      end
      what
      event
    }
  }
}
    `;
export type CreateBookingRequestMutationFn = Apollo.MutationFunction<CreateBookingRequestMutation, CreateBookingRequestMutationVariables>;

/**
 * __useCreateBookingRequestMutation__
 *
 * To run a mutation, you first call `useCreateBookingRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateBookingRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createBookingRequestMutation, { data, loading, error }] = useCreateBookingRequestMutation({
 *   variables: {
 *      bookerId: // value for 'bookerId'
 *      start: // value for 'start'
 *      end: // value for 'end'
 *      what: // value for 'what'
 *      event: // value for 'event'
 *   },
 * });
 */
export function useCreateBookingRequestMutation(baseOptions?: Apollo.MutationHookOptions<CreateBookingRequestMutation, CreateBookingRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateBookingRequestMutation, CreateBookingRequestMutationVariables>(CreateBookingRequestDocument, options);
      }
export type CreateBookingRequestMutationHookResult = ReturnType<typeof useCreateBookingRequestMutation>;
export type CreateBookingRequestMutationResult = Apollo.MutationResult<CreateBookingRequestMutation>;
export type CreateBookingRequestMutationOptions = Apollo.BaseMutationOptions<CreateBookingRequestMutation, CreateBookingRequestMutationVariables>;
export const AcceptBookingRequestDocument = gql`
    mutation acceptBookingRequest($id: Int!) {
  bookingRequest {
    accept(id: $id)
  }
}
    `;
export type AcceptBookingRequestMutationFn = Apollo.MutationFunction<AcceptBookingRequestMutation, AcceptBookingRequestMutationVariables>;

/**
 * __useAcceptBookingRequestMutation__
 *
 * To run a mutation, you first call `useAcceptBookingRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptBookingRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptBookingRequestMutation, { data, loading, error }] = useAcceptBookingRequestMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useAcceptBookingRequestMutation(baseOptions?: Apollo.MutationHookOptions<AcceptBookingRequestMutation, AcceptBookingRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AcceptBookingRequestMutation, AcceptBookingRequestMutationVariables>(AcceptBookingRequestDocument, options);
      }
export type AcceptBookingRequestMutationHookResult = ReturnType<typeof useAcceptBookingRequestMutation>;
export type AcceptBookingRequestMutationResult = Apollo.MutationResult<AcceptBookingRequestMutation>;
export type AcceptBookingRequestMutationOptions = Apollo.BaseMutationOptions<AcceptBookingRequestMutation, AcceptBookingRequestMutationVariables>;
export const DenyBookingRequestDocument = gql`
    mutation denyBookingRequest($id: Int!) {
  bookingRequest {
    deny(id: $id)
  }
}
    `;
export type DenyBookingRequestMutationFn = Apollo.MutationFunction<DenyBookingRequestMutation, DenyBookingRequestMutationVariables>;

/**
 * __useDenyBookingRequestMutation__
 *
 * To run a mutation, you first call `useDenyBookingRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDenyBookingRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [denyBookingRequestMutation, { data, loading, error }] = useDenyBookingRequestMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDenyBookingRequestMutation(baseOptions?: Apollo.MutationHookOptions<DenyBookingRequestMutation, DenyBookingRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DenyBookingRequestMutation, DenyBookingRequestMutationVariables>(DenyBookingRequestDocument, options);
      }
export type DenyBookingRequestMutationHookResult = ReturnType<typeof useDenyBookingRequestMutation>;
export type DenyBookingRequestMutationResult = Apollo.MutationResult<DenyBookingRequestMutation>;
export type DenyBookingRequestMutationOptions = Apollo.BaseMutationOptions<DenyBookingRequestMutation, DenyBookingRequestMutationVariables>;
export const EventsDocument = gql`
    query Events {
  events {
    title
    description
    start_datetime
    end_datetime
    link
    id
  }
}
    `;

/**
 * __useEventsQuery__
 *
 * To run a query within a React component, call `useEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventsQuery({
 *   variables: {
 *   },
 * });
 */
export function useEventsQuery(baseOptions?: Apollo.QueryHookOptions<EventsQuery, EventsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EventsQuery, EventsQueryVariables>(EventsDocument, options);
      }
export function useEventsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EventsQuery, EventsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EventsQuery, EventsQueryVariables>(EventsDocument, options);
        }
export type EventsQueryHookResult = ReturnType<typeof useEventsQuery>;
export type EventsLazyQueryHookResult = ReturnType<typeof useEventsLazyQuery>;
export type EventsQueryResult = Apollo.QueryResult<EventsQuery, EventsQueryVariables>;
export const MeHeaderDocument = gql`
    query MeHeader {
  me {
    id
    first_name
    nickname
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
export const CreateMemberDocument = gql`
    mutation CreateMember($firstName: String!, $lastName: String!, $classProgramme: String!, $classYear: Int!, $studentId: String!) {
  member {
    create(
      input: {first_name: $firstName, last_name: $lastName, class_programme: $classProgramme, class_year: $classYear, student_id: $studentId}
    ) {
      first_name
      last_name
      class_programme
      class_year
      student_id
    }
  }
}
    `;
export type CreateMemberMutationFn = Apollo.MutationFunction<CreateMemberMutation, CreateMemberMutationVariables>;

/**
 * __useCreateMemberMutation__
 *
 * To run a mutation, you first call `useCreateMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMemberMutation, { data, loading, error }] = useCreateMemberMutation({
 *   variables: {
 *      firstName: // value for 'firstName'
 *      lastName: // value for 'lastName'
 *      classProgramme: // value for 'classProgramme'
 *      classYear: // value for 'classYear'
 *      studentId: // value for 'studentId'
 *   },
 * });
 */
export function useCreateMemberMutation(baseOptions?: Apollo.MutationHookOptions<CreateMemberMutation, CreateMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMemberMutation, CreateMemberMutationVariables>(CreateMemberDocument, options);
      }
export type CreateMemberMutationHookResult = ReturnType<typeof useCreateMemberMutation>;
export type CreateMemberMutationResult = Apollo.MutationResult<CreateMemberMutation>;
export type CreateMemberMutationOptions = Apollo.BaseMutationOptions<CreateMemberMutation, CreateMemberMutationVariables>;
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
        nickname
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
      nickname
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