import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
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
  UUID: any;
  Url: any;
};

export type AccessMutations = {
  __typename?: 'AccessMutations';
  door?: Maybe<DoorMutations>;
  policy?: Maybe<PolicyMutations>;
};

export type AccessPolicy = {
  __typename?: 'AccessPolicy';
  accessor: Scalars['String'];
  end_datetime?: Maybe<Scalars['Date']>;
  id: Scalars['UUID'];
  start_datetime?: Maybe<Scalars['Date']>;
};

export type Api = {
  __typename?: 'Api';
  accessPolicies?: Maybe<Array<AccessPolicy>>;
  name: Scalars['String'];
};

export type Article = {
  __typename?: 'Article';
  author: Author;
  body: Scalars['String'];
  bodyEn?: Maybe<Scalars['String']>;
  header: Scalars['String'];
  headerEn?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  imageUrl?: Maybe<Scalars['Url']>;
  isLikedByMe: Scalars['Boolean'];
  latestEditDatetime?: Maybe<Scalars['Datetime']>;
  likes: Scalars['Int'];
  publishedDatetime: Scalars['Datetime'];
};

export type ArticleMutations = {
  __typename?: 'ArticleMutations';
  create?: Maybe<CreateArticlePayload>;
  dislike?: Maybe<ArticlePayload>;
  like?: Maybe<ArticlePayload>;
  presignedPutUrl?: Maybe<Scalars['String']>;
  remove?: Maybe<ArticlePayload>;
  update?: Maybe<UpdateArticlePayload>;
};


export type ArticleMutationsCreateArgs = {
  input: CreateArticle;
};


export type ArticleMutationsDislikeArgs = {
  id: Scalars['UUID'];
};


export type ArticleMutationsLikeArgs = {
  id: Scalars['UUID'];
};


export type ArticleMutationsPresignedPutUrlArgs = {
  fileName: Scalars['String'];
};


export type ArticleMutationsRemoveArgs = {
  id: Scalars['UUID'];
};


export type ArticleMutationsUpdateArgs = {
  id: Scalars['UUID'];
  input: UpdateArticle;
};

export type ArticlePagination = {
  __typename?: 'ArticlePagination';
  articles: Array<Maybe<Article>>;
  pageInfo: PaginationInfo;
};

export type ArticlePayload = {
  __typename?: 'ArticlePayload';
  article: Article;
};

export type Author = Mandate | Member;

export type Bookable = {
  __typename?: 'Bookable';
  id: Scalars['UUID'];
  name: Scalars['String'];
  name_en: Scalars['String'];
};

export type BookingFilter = {
  from?: InputMaybe<Scalars['Datetime']>;
  status?: InputMaybe<BookingStatus>;
  to?: InputMaybe<Scalars['Datetime']>;
  what?: InputMaybe<Scalars['String']>;
};

export type BookingRequest = {
  __typename?: 'BookingRequest';
  booker: Member;
  created: Scalars['Datetime'];
  end: Scalars['Datetime'];
  event: Scalars['String'];
  id: Scalars['UUID'];
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
  id: Scalars['UUID'];
};


export type BookingRequestMutationsCreateArgs = {
  input: CreateBookingRequest;
};


export type BookingRequestMutationsDenyArgs = {
  id: Scalars['UUID'];
};


export type BookingRequestMutationsRemoveArgs = {
  id: Scalars['UUID'];
};


export type BookingRequestMutationsUpdateArgs = {
  id: Scalars['UUID'];
  input: UpdateBookingRequest;
};

export enum BookingStatus {
  Accepted = 'ACCEPTED',
  Denied = 'DENIED',
  Pending = 'PENDING'
}

export type Committee = {
  __typename?: 'Committee';
  id: Scalars['UUID'];
  name?: Maybe<Scalars['String']>;
  shortName?: Maybe<Scalars['String']>;
};

export type CommitteeFilter = {
  id?: InputMaybe<Scalars['UUID']>;
  name?: InputMaybe<Scalars['String']>;
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

export type CreateArticle = {
  body: Scalars['String'];
  bodyEn?: InputMaybe<Scalars['String']>;
  header: Scalars['String'];
  headerEn?: InputMaybe<Scalars['String']>;
  imageName?: InputMaybe<Scalars['String']>;
  mandateId?: InputMaybe<Scalars['UUID']>;
};

export type CreateArticlePayload = {
  __typename?: 'CreateArticlePayload';
  article: Article;
  uploadUrl?: Maybe<Scalars['Url']>;
};

export type CreateBookingRequest = {
  booker_id: Scalars['UUID'];
  end: Scalars['Datetime'];
  event: Scalars['String'];
  start: Scalars['Datetime'];
  what: Array<Scalars['String']>;
};

export type CreateCommittee = {
  name: Scalars['String'];
};

export type CreateDoor = {
  id?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
};

export type CreateDoorAccessPolicy = {
  doorName: Scalars['String'];
  endDatetime?: InputMaybe<Scalars['Date']>;
  startDatetime?: InputMaybe<Scalars['Date']>;
  who: Scalars['String'];
};

export type CreateEvent = {
  description: Scalars['String'];
  description_en?: InputMaybe<Scalars['String']>;
  end_datetime: Scalars['Datetime'];
  link?: InputMaybe<Scalars['String']>;
  location: Scalars['String'];
  organizer: Scalars['String'];
  short_description: Scalars['String'];
  short_description_en?: InputMaybe<Scalars['String']>;
  start_datetime: Scalars['Datetime'];
  title: Scalars['String'];
  title_en?: InputMaybe<Scalars['String']>;
};

export type CreateMandate = {
  end_date: Scalars['Date'];
  member_id: Scalars['UUID'];
  position_id: Scalars['String'];
  start_date: Scalars['Date'];
};

export type CreateMarkdown = {
  markdown?: InputMaybe<Scalars['String']>;
  markdown_en?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
};

export type CreateMember = {
  class_programme: Scalars['String'];
  class_year: Scalars['Int'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  nickname?: InputMaybe<Scalars['String']>;
  picture_path?: InputMaybe<Scalars['String']>;
  student_id: Scalars['String'];
};

export type CreatePosition = {
  active?: InputMaybe<Scalars['Boolean']>;
  boardMember?: InputMaybe<Scalars['Boolean']>;
  committee_id?: InputMaybe<Scalars['UUID']>;
  email?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  name: Scalars['String'];
};

export type Door = {
  __typename?: 'Door';
  accessPolicies?: Maybe<Array<AccessPolicy>>;
  id?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  /** returns all stundet ids that have active policies for this door. */
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

export type Event = {
  __typename?: 'Event';
  author: Member;
  description: Scalars['String'];
  description_en?: Maybe<Scalars['String']>;
  end_datetime: Scalars['Datetime'];
  id: Scalars['UUID'];
  link?: Maybe<Scalars['String']>;
  location?: Maybe<Scalars['String']>;
  number_of_updates: Scalars['Int'];
  organizer: Scalars['String'];
  short_description: Scalars['String'];
  short_description_en?: Maybe<Scalars['String']>;
  start_datetime: Scalars['Datetime'];
  title: Scalars['String'];
  title_en?: Maybe<Scalars['String']>;
};

export type EventFilter = {
  end_datetime?: InputMaybe<Scalars['Datetime']>;
  id?: InputMaybe<Scalars['UUID']>;
  start_datetime?: InputMaybe<Scalars['Datetime']>;
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
  id: Scalars['UUID'];
};


export type EventMutationsUpdateArgs = {
  id: Scalars['UUID'];
  input: UpdateEvent;
};

export type EventPagination = {
  __typename?: 'EventPagination';
  events: Array<Maybe<Event>>;
  pageInfo?: Maybe<PaginationInfo>;
};

export type FileData = {
  __typename?: 'FileData';
  childrenCount?: Maybe<Scalars['Int']>;
  color?: Maybe<Scalars['String']>;
  dndOpenable?: Maybe<Scalars['Boolean']>;
  draggable?: Maybe<Scalars['Boolean']>;
  droppable?: Maybe<Scalars['Boolean']>;
  ext?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  isDir?: Maybe<Scalars['Boolean']>;
  isEncrypted?: Maybe<Scalars['Boolean']>;
  isHidden?: Maybe<Scalars['Boolean']>;
  isSymlink?: Maybe<Scalars['Boolean']>;
  modDate?: Maybe<Scalars['Date']>;
  name: Scalars['String'];
  openable?: Maybe<Scalars['Boolean']>;
  selectable?: Maybe<Scalars['Boolean']>;
  size?: Maybe<Scalars['Int']>;
  thumbnailUrl?: Maybe<Scalars['String']>;
};

export type FileMutations = {
  __typename?: 'FileMutations';
  move?: Maybe<Array<Maybe<FileChange>>>;
  remove?: Maybe<Array<Maybe<FileData>>>;
  rename?: Maybe<FileChange>;
};


export type FileMutationsMoveArgs = {
  bucket: Scalars['String'];
  fileNames: Array<Scalars['String']>;
  newFolder: Scalars['String'];
};


export type FileMutationsRemoveArgs = {
  bucket: Scalars['String'];
  fileNames: Array<Scalars['String']>;
};


export type FileMutationsRenameArgs = {
  bucket: Scalars['String'];
  fileName: Scalars['String'];
  newFileName: Scalars['String'];
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
  end_date?: InputMaybe<Scalars['Date']>;
  id?: InputMaybe<Scalars['UUID']>;
  member_id?: InputMaybe<Scalars['UUID']>;
  position_id?: InputMaybe<Scalars['String']>;
  position_ids?: InputMaybe<Array<Scalars['String']>>;
  start_date?: InputMaybe<Scalars['Date']>;
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

export type Markdown = {
  __typename?: 'Markdown';
  markdown: Scalars['String'];
  markdown_en?: Maybe<Scalars['String']>;
  name: Scalars['String'];
};

export type MarkdownMutations = {
  __typename?: 'MarkdownMutations';
  create?: Maybe<Markdown>;
  update?: Maybe<Markdown>;
};


export type MarkdownMutationsCreateArgs = {
  input: CreateMarkdown;
};


export type MarkdownMutationsUpdateArgs = {
  input: UpdateMarkdown;
  name: Scalars['String'];
};

export type MarkdownPayload = {
  __typename?: 'MarkdownPayload';
  markdown: Markdown;
};

export type Member = {
  __typename?: 'Member';
  class_programme?: Maybe<Scalars['String']>;
  class_year?: Maybe<Scalars['Int']>;
  first_name?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  last_name?: Maybe<Scalars['String']>;
  mandates?: Maybe<Array<Mandate>>;
  nickname?: Maybe<Scalars['String']>;
  picture_path?: Maybe<Scalars['String']>;
  student_id?: Maybe<Scalars['String']>;
};


export type MemberMandatesArgs = {
  onlyActive?: InputMaybe<Scalars['Boolean']>;
};

export type MemberFilter = {
  class_programme?: InputMaybe<Scalars['String']>;
  class_year?: InputMaybe<Scalars['Int']>;
  first_name?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['UUID']>;
  last_name?: InputMaybe<Scalars['String']>;
  nickname?: InputMaybe<Scalars['String']>;
  student_id?: InputMaybe<Scalars['String']>;
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
  article?: Maybe<ArticleMutations>;
  bookingRequest?: Maybe<BookingRequestMutations>;
  committee?: Maybe<CommitteeMutations>;
  event?: Maybe<EventMutations>;
  files?: Maybe<FileMutations>;
  mandate?: Maybe<MandateMutations>;
  markdown?: Maybe<MarkdownMutations>;
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
  committee_id?: InputMaybe<Scalars['UUID']>;
  id?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
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
  api?: Maybe<Api>;
  /** returns all apis the signed in member has access to. */
  apiAccess?: Maybe<Array<Api>>;
  apis?: Maybe<Array<Api>>;
  article?: Maybe<Article>;
  bookables?: Maybe<Array<Bookable>>;
  bookingRequest?: Maybe<BookingRequest>;
  bookingRequests?: Maybe<Array<BookingRequest>>;
  committees?: Maybe<CommitteePagination>;
  door?: Maybe<Door>;
  doors?: Maybe<Array<Door>>;
  event?: Maybe<Event>;
  events?: Maybe<EventPagination>;
  files?: Maybe<Array<FileData>>;
  mandates?: Maybe<MandatePagination>;
  markdown?: Maybe<Markdown>;
  markdowns: Array<Maybe<Markdown>>;
  me?: Maybe<Member>;
  memberById?: Maybe<Member>;
  memberByStudentId?: Maybe<Member>;
  members?: Maybe<MemberPagination>;
  news?: Maybe<ArticlePagination>;
  positions?: Maybe<PositionPagination>;
  presignedPutUrl?: Maybe<Scalars['String']>;
  resolveAlias?: Maybe<Array<Maybe<Scalars['String']>>>;
};


export type QueryApiArgs = {
  name: Scalars['String'];
};


export type QueryArticleArgs = {
  id: Scalars['UUID'];
};


export type QueryBookingRequestArgs = {
  id: Scalars['UUID'];
};


export type QueryBookingRequestsArgs = {
  filter?: InputMaybe<BookingFilter>;
};


export type QueryCommitteesArgs = {
  filter?: InputMaybe<CommitteeFilter>;
  page?: Scalars['Int'];
  perPage?: Scalars['Int'];
};


export type QueryDoorArgs = {
  name: Scalars['String'];
};


export type QueryEventArgs = {
  id: Scalars['UUID'];
};


export type QueryEventsArgs = {
  filter?: InputMaybe<EventFilter>;
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
};


export type QueryFilesArgs = {
  bucket: Scalars['String'];
  prefix: Scalars['String'];
};


export type QueryMandatesArgs = {
  filter?: InputMaybe<MandateFilter>;
  page?: Scalars['Int'];
  perPage?: Scalars['Int'];
};


export type QueryMarkdownArgs = {
  name: Scalars['String'];
};


export type QueryMemberByIdArgs = {
  id: Scalars['UUID'];
};


export type QueryMemberByStudentIdArgs = {
  student_id: Scalars['String'];
};


export type QueryMembersArgs = {
  filter?: InputMaybe<MemberFilter>;
  page?: Scalars['Int'];
  perPage?: Scalars['Int'];
};


export type QueryNewsArgs = {
  page?: Scalars['Int'];
  perPage?: Scalars['Int'];
};


export type QueryPositionsArgs = {
  filter?: InputMaybe<PositionFilter>;
  page?: Scalars['Int'];
  perPage?: Scalars['Int'];
};


export type QueryPresignedPutUrlArgs = {
  bucket: Scalars['String'];
  fileName: Scalars['String'];
};


export type QueryResolveAliasArgs = {
  alias: Scalars['String'];
};

export type UpdateArticle = {
  body?: InputMaybe<Scalars['String']>;
  bodyEn?: InputMaybe<Scalars['String']>;
  header?: InputMaybe<Scalars['String']>;
  headerEn?: InputMaybe<Scalars['String']>;
  imageName?: InputMaybe<Scalars['String']>;
  mandateId?: InputMaybe<Scalars['UUID']>;
};

export type UpdateArticlePayload = {
  __typename?: 'UpdateArticlePayload';
  article: Article;
  uploadUrl?: Maybe<Scalars['Url']>;
};

export type UpdateBookingRequest = {
  end?: InputMaybe<Scalars['Datetime']>;
  event?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['Datetime']>;
  what?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type UpdateBookingRequestStatus = {
  status?: InputMaybe<BookingStatus>;
};

export type UpdateCommittee = {
  name?: InputMaybe<Scalars['String']>;
};

export type UpdateEvent = {
  description?: InputMaybe<Scalars['String']>;
  description_en?: InputMaybe<Scalars['String']>;
  end_datetime?: InputMaybe<Scalars['Datetime']>;
  link?: InputMaybe<Scalars['String']>;
  location?: InputMaybe<Scalars['String']>;
  organizer?: InputMaybe<Scalars['String']>;
  short_description?: InputMaybe<Scalars['String']>;
  short_description_en?: InputMaybe<Scalars['String']>;
  start_datetime?: InputMaybe<Scalars['Datetime']>;
  title?: InputMaybe<Scalars['String']>;
  title_en?: InputMaybe<Scalars['String']>;
};

export type UpdateMandate = {
  end_date?: InputMaybe<Scalars['Date']>;
  member_id?: InputMaybe<Scalars['UUID']>;
  position_id?: InputMaybe<Scalars['String']>;
  start_date?: InputMaybe<Scalars['Date']>;
};

export type UpdateMarkdown = {
  markdown?: InputMaybe<Scalars['String']>;
  markdown_en?: InputMaybe<Scalars['String']>;
};

export type UpdateMember = {
  class_programme?: InputMaybe<Scalars['String']>;
  class_year?: InputMaybe<Scalars['Int']>;
  first_name?: InputMaybe<Scalars['String']>;
  last_name?: InputMaybe<Scalars['String']>;
  nickname?: InputMaybe<Scalars['String']>;
  picture_path?: InputMaybe<Scalars['String']>;
};

export type UpdatePosition = {
  committee_id?: InputMaybe<Scalars['UUID']>;
  name?: InputMaybe<Scalars['String']>;
};

export type FileChange = {
  __typename?: 'fileChange';
  file: FileData;
  oldFile?: Maybe<FileData>;
};

export type ApiAccessQueryVariables = Exact<{ [key: string]: never; }>;


export type ApiAccessQuery = { __typename?: 'Query', apiAccess?: Array<{ __typename?: 'Api', name: string }> | null | undefined };

export type GetApisQueryVariables = Exact<{ [key: string]: never; }>;


export type GetApisQuery = { __typename?: 'Query', apis?: Array<{ __typename?: 'Api', name: string }> | null | undefined };

export type GetApiQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type GetApiQuery = { __typename?: 'Query', api?: { __typename?: 'Api', name: string, accessPolicies?: Array<{ __typename?: 'AccessPolicy', accessor: string, end_datetime?: any | null | undefined, id: any, start_datetime?: any | null | undefined }> | null | undefined } | null | undefined };

export type CreateApiAccessPolicyMutationVariables = Exact<{
  apiName: Scalars['String'];
  who: Scalars['String'];
}>;


export type CreateApiAccessPolicyMutation = { __typename?: 'Mutation', access?: { __typename?: 'AccessMutations', policy?: { __typename?: 'PolicyMutations', createApiAccessPolicy?: { __typename?: 'AccessPolicy', id: any } | null | undefined } | null | undefined } | null | undefined };

export type RemoveAccessPolicyMutationVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type RemoveAccessPolicyMutation = { __typename?: 'Mutation', access?: { __typename?: 'AccessMutations', policy?: { __typename?: 'PolicyMutations', remove?: { __typename?: 'AccessPolicy', id: any } | null | undefined } | null | undefined } | null | undefined };

export type GetBookablesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBookablesQuery = { __typename?: 'Query', bookables?: Array<{ __typename?: 'Bookable', id: any, name: string, name_en: string }> | null | undefined };

export type GetBookingsQueryVariables = Exact<{
  from?: InputMaybe<Scalars['Datetime']>;
  to?: InputMaybe<Scalars['Datetime']>;
  status?: InputMaybe<BookingStatus>;
}>;


export type GetBookingsQuery = { __typename?: 'Query', bookingRequests?: Array<{ __typename?: 'BookingRequest', id: any, start: any, end: any, event: string, status: BookingStatus, created: any, last_modified?: any | null | undefined, booker: { __typename?: 'Member', id: any, first_name?: string | null | undefined, nickname?: string | null | undefined, last_name?: string | null | undefined }, what: Array<{ __typename?: 'Bookable', id: any, name: string, name_en: string } | null | undefined> }> | null | undefined };

export type CreateBookingRequestMutationVariables = Exact<{
  bookerId: Scalars['UUID'];
  start: Scalars['Datetime'];
  end: Scalars['Datetime'];
  what: Array<Scalars['String']> | Scalars['String'];
  event: Scalars['String'];
}>;


export type CreateBookingRequestMutation = { __typename?: 'Mutation', bookingRequest?: { __typename?: 'BookingRequestMutations', create?: { __typename?: 'BookingRequest', start: any, end: any, event: string, what: Array<{ __typename?: 'Bookable', id: any, name: string, name_en: string } | null | undefined> } | null | undefined } | null | undefined };

export type AcceptBookingRequestMutationVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type AcceptBookingRequestMutation = { __typename?: 'Mutation', bookingRequest?: { __typename?: 'BookingRequestMutations', accept?: boolean | null | undefined } | null | undefined };

export type DenyBookingRequestMutationVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type DenyBookingRequestMutation = { __typename?: 'Mutation', bookingRequest?: { __typename?: 'BookingRequestMutations', deny?: boolean | null | undefined } | null | undefined };

export type GetCommitteesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCommitteesQuery = { __typename?: 'Query', committees?: { __typename?: 'CommitteePagination', committees: Array<{ __typename?: 'Committee', id: any, name?: string | null | undefined } | null | undefined> } | null | undefined };

export type GetDoorsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDoorsQuery = { __typename?: 'Query', doors?: Array<{ __typename?: 'Door', name: string }> | null | undefined };

export type GetDoorQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type GetDoorQuery = { __typename?: 'Query', door?: { __typename?: 'Door', id?: string | null | undefined, name: string, accessPolicies?: Array<{ __typename?: 'AccessPolicy', accessor: string, end_datetime?: any | null | undefined, id: any, start_datetime?: any | null | undefined }> | null | undefined } | null | undefined };

export type CreateDoorAccessPolicyMutationVariables = Exact<{
  doorName: Scalars['String'];
  who: Scalars['String'];
  startDatetime?: InputMaybe<Scalars['Date']>;
  endDatetime?: InputMaybe<Scalars['Date']>;
}>;


export type CreateDoorAccessPolicyMutation = { __typename?: 'Mutation', access?: { __typename?: 'AccessMutations', policy?: { __typename?: 'PolicyMutations', createDoorAccessPolicy?: { __typename?: 'AccessPolicy', id: any } | null | undefined } | null | undefined } | null | undefined };

export type CreateDoorMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type CreateDoorMutation = { __typename?: 'Mutation', access?: { __typename?: 'AccessMutations', door?: { __typename?: 'DoorMutations', create?: { __typename?: 'Door', name: string } | null | undefined } | null | undefined } | null | undefined };

export type RemoveDoorMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type RemoveDoorMutation = { __typename?: 'Mutation', access?: { __typename?: 'AccessMutations', door?: { __typename?: 'DoorMutations', remove?: { __typename?: 'Door', name: string } | null | undefined } | null | undefined } | null | undefined };

export type EventsQueryVariables = Exact<{
  start_datetime?: InputMaybe<Scalars['Datetime']>;
  end_datetime?: InputMaybe<Scalars['Datetime']>;
}>;


export type EventsQuery = { __typename?: 'Query', events?: { __typename?: 'EventPagination', events: Array<{ __typename?: 'Event', title: string, id: any, short_description: string, description: string, start_datetime: any, end_datetime: any, link?: string | null | undefined, location?: string | null | undefined, organizer: string, title_en?: string | null | undefined, description_en?: string | null | undefined, short_description_en?: string | null | undefined } | null | undefined> } | null | undefined };

export type EventQueryVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type EventQuery = { __typename?: 'Query', event?: { __typename?: 'Event', title: string, id: any, short_description: string, description: string, start_datetime: any, end_datetime: any, link?: string | null | undefined, location?: string | null | undefined, organizer: string, title_en?: string | null | undefined, description_en?: string | null | undefined, short_description_en?: string | null | undefined } | null | undefined };

export type UpdateEventMutationVariables = Exact<{
  id: Scalars['UUID'];
  title?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  short_description?: InputMaybe<Scalars['String']>;
  start_datetime?: InputMaybe<Scalars['Datetime']>;
  end_datetime?: InputMaybe<Scalars['Datetime']>;
  link?: InputMaybe<Scalars['String']>;
  location?: InputMaybe<Scalars['String']>;
  organizer?: InputMaybe<Scalars['String']>;
  title_en?: InputMaybe<Scalars['String']>;
  description_en?: InputMaybe<Scalars['String']>;
  short_description_en?: InputMaybe<Scalars['String']>;
}>;


export type UpdateEventMutation = { __typename?: 'Mutation', event?: { __typename?: 'EventMutations', update?: { __typename?: 'Event', title: string, id: any, short_description: string, description: string, start_datetime: any, end_datetime: any, link?: string | null | undefined, location?: string | null | undefined, organizer: string, title_en?: string | null | undefined, description_en?: string | null | undefined, short_description_en?: string | null | undefined } | null | undefined } | null | undefined };

export type CreateEventMutationVariables = Exact<{
  title: Scalars['String'];
  description: Scalars['String'];
  short_description: Scalars['String'];
  start_datetime: Scalars['Datetime'];
  end_datetime: Scalars['Datetime'];
  link?: InputMaybe<Scalars['String']>;
  location: Scalars['String'];
  organizer: Scalars['String'];
  title_en?: InputMaybe<Scalars['String']>;
  description_en?: InputMaybe<Scalars['String']>;
  short_description_en?: InputMaybe<Scalars['String']>;
}>;


export type CreateEventMutation = { __typename?: 'Mutation', event?: { __typename?: 'EventMutations', create?: { __typename?: 'Event', title: string, id: any, short_description: string, description: string, start_datetime: any, end_datetime: any, link?: string | null | undefined, location?: string | null | undefined, organizer: string, title_en?: string | null | undefined, description_en?: string | null | undefined, short_description_en?: string | null | undefined } | null | undefined } | null | undefined };

export type RemoveEventMutationVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type RemoveEventMutation = { __typename?: 'Mutation', event?: { __typename?: 'EventMutations', remove?: { __typename?: 'Event', id: any } | null | undefined } | null | undefined };

export type FilesQueryVariables = Exact<{
  bucket: Scalars['String'];
  prefix: Scalars['String'];
}>;


export type FilesQuery = { __typename?: 'Query', files?: Array<{ __typename?: 'FileData', id: string, name: string, size?: number | null | undefined, isDir?: boolean | null | undefined, thumbnailUrl?: string | null | undefined }> | null | undefined };

export type PresignedPutUrlQueryVariables = Exact<{
  bucket: Scalars['String'];
  fileName: Scalars['String'];
}>;


export type PresignedPutUrlQuery = { __typename?: 'Query', presignedPutUrl?: string | null | undefined };

export type RemoveObjectsMutationVariables = Exact<{
  bucket: Scalars['String'];
  fileNames: Array<Scalars['String']> | Scalars['String'];
}>;


export type RemoveObjectsMutation = { __typename?: 'Mutation', files?: { __typename?: 'FileMutations', remove?: Array<{ __typename?: 'FileData', id: string, name: string } | null | undefined> | null | undefined } | null | undefined };

export type MoveObjectsMutationVariables = Exact<{
  bucket: Scalars['String'];
  fileNames: Array<Scalars['String']> | Scalars['String'];
  destination: Scalars['String'];
}>;


export type MoveObjectsMutation = { __typename?: 'Mutation', files?: { __typename?: 'FileMutations', move?: Array<{ __typename?: 'fileChange', file: { __typename?: 'FileData', id: string, name: string, size?: number | null | undefined, isDir?: boolean | null | undefined, thumbnailUrl?: string | null | undefined }, oldFile?: { __typename?: 'FileData', id: string, name: string, size?: number | null | undefined, isDir?: boolean | null | undefined, thumbnailUrl?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined };

export type RenameObjectMutationVariables = Exact<{
  bucket: Scalars['String'];
  fileName: Scalars['String'];
  newFileName: Scalars['String'];
}>;


export type RenameObjectMutation = { __typename?: 'Mutation', files?: { __typename?: 'FileMutations', rename?: { __typename?: 'fileChange', file: { __typename?: 'FileData', id: string, name: string, size?: number | null | undefined, isDir?: boolean | null | undefined, thumbnailUrl?: string | null | undefined } } | null | undefined } | null | undefined };

export type GetMandatesByPeriodQueryVariables = Exact<{
  page: Scalars['Int'];
  perPage: Scalars['Int'];
  start_date?: InputMaybe<Scalars['Date']>;
  end_date?: InputMaybe<Scalars['Date']>;
}>;


export type GetMandatesByPeriodQuery = { __typename?: 'Query', mandates?: { __typename?: 'MandatePagination', mandates: Array<{ __typename?: 'Mandate', id: any, start_date: any, end_date: any, position?: { __typename?: 'Position', name?: string | null | undefined, nameEn?: string | null | undefined, id: string } | null | undefined, member?: { __typename?: 'Member', id: any, first_name?: string | null | undefined, last_name?: string | null | undefined } | null | undefined } | null | undefined>, pageInfo: { __typename?: 'PaginationInfo', totalPages: number } } | null | undefined };

export type CreateMandateMutationVariables = Exact<{
  memberId: Scalars['UUID'];
  positionId: Scalars['String'];
  startDate: Scalars['Date'];
  endDate: Scalars['Date'];
}>;


export type CreateMandateMutation = { __typename?: 'Mutation', mandate?: { __typename?: 'MandateMutations', create?: { __typename?: 'Mandate', id: any } | null | undefined } | null | undefined };

export type RemoveMandateMutationVariables = Exact<{
  mandateId: Scalars['UUID'];
}>;


export type RemoveMandateMutation = { __typename?: 'Mutation', mandate?: { __typename?: 'MandateMutations', remove?: { __typename?: 'Mandate', id: any } | null | undefined } | null | undefined };

export type GetMarkdownsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMarkdownsQuery = { __typename?: 'Query', markdowns: Array<{ __typename?: 'Markdown', name: string } | null | undefined> };

export type GetMarkdownQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type GetMarkdownQuery = { __typename?: 'Query', markdown?: { __typename?: 'Markdown', name: string, markdown: string, markdown_en?: string | null | undefined } | null | undefined };

export type UpdateMarkdownMutationVariables = Exact<{
  name: Scalars['String'];
  markdown: Scalars['String'];
  markdown_en?: InputMaybe<Scalars['String']>;
}>;


export type UpdateMarkdownMutation = { __typename?: 'Mutation', markdown?: { __typename?: 'MarkdownMutations', update?: { __typename?: 'Markdown', name: string, markdown: string, markdown_en?: string | null | undefined } | null | undefined } | null | undefined };

export type CreateMarkdownMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type CreateMarkdownMutation = { __typename?: 'Mutation', markdown?: { __typename?: 'MarkdownMutations', create?: { __typename?: 'Markdown', name: string } | null | undefined } | null | undefined };

export type MeHeaderQueryVariables = Exact<{ [key: string]: never; }>;


export type MeHeaderQuery = { __typename?: 'Query', me?: { __typename?: 'Member', id: any, first_name?: string | null | undefined, nickname?: string | null | undefined, last_name?: string | null | undefined, student_id?: string | null | undefined, picture_path?: string | null | undefined, mandates?: Array<{ __typename?: 'Mandate', id: any, position?: { __typename?: 'Position', id: string, name?: string | null | undefined, nameEn?: string | null | undefined } | null | undefined }> | null | undefined } | null | undefined };

export type GetMembersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMembersQuery = { __typename?: 'Query', members?: { __typename?: 'MemberPagination', members: Array<{ __typename?: 'Member', id: any, first_name?: string | null | undefined, nickname?: string | null | undefined, last_name?: string | null | undefined, student_id?: string | null | undefined } | null | undefined> } | null | undefined };

export type MemberPageQueryVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type MemberPageQuery = { __typename?: 'Query', memberById?: { __typename?: 'Member', id: any, first_name?: string | null | undefined, nickname?: string | null | undefined, last_name?: string | null | undefined, student_id?: string | null | undefined, class_programme?: string | null | undefined, class_year?: number | null | undefined, picture_path?: string | null | undefined, mandates?: Array<{ __typename?: 'Mandate', id: any, start_date: any, end_date: any, position?: { __typename?: 'Position', id: string, name?: string | null | undefined, nameEn?: string | null | undefined } | null | undefined }> | null | undefined } | null | undefined };

export type CreateMemberMutationVariables = Exact<{
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  classProgramme: Scalars['String'];
  classYear: Scalars['Int'];
  studentId: Scalars['String'];
}>;


export type CreateMemberMutation = { __typename?: 'Mutation', member?: { __typename?: 'MemberMutations', create?: { __typename?: 'Member', id: any, first_name?: string | null | undefined, last_name?: string | null | undefined, class_programme?: string | null | undefined, class_year?: number | null | undefined, student_id?: string | null | undefined } | null | undefined } | null | undefined };

export type UpdateMemberMutationVariables = Exact<{
  id: Scalars['UUID'];
  firstName?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  nickname?: InputMaybe<Scalars['String']>;
  classProgramme?: InputMaybe<Scalars['String']>;
  classYear?: InputMaybe<Scalars['Int']>;
  picturePath?: InputMaybe<Scalars['String']>;
}>;


export type UpdateMemberMutation = { __typename?: 'Mutation', member?: { __typename?: 'MemberMutations', update?: { __typename?: 'Member', first_name?: string | null | undefined, last_name?: string | null | undefined, nickname?: string | null | undefined, class_programme?: string | null | undefined, class_year?: number | null | undefined, picture_path?: string | null | undefined } | null | undefined } | null | undefined };

export type NewsPageQueryVariables = Exact<{
  page_number: Scalars['Int'];
  per_page: Scalars['Int'];
}>;


export type NewsPageQuery = { __typename?: 'Query', news?: { __typename?: 'ArticlePagination', articles: Array<{ __typename?: 'Article', id: any, header: string, headerEn?: string | null | undefined, body: string, bodyEn?: string | null | undefined, likes: number, isLikedByMe: boolean, imageUrl?: any | null | undefined, publishedDatetime: any, latestEditDatetime?: any | null | undefined, author: { __typename: 'Mandate', member?: { __typename?: 'Member', id: any, first_name?: string | null | undefined, nickname?: string | null | undefined, last_name?: string | null | undefined } | null | undefined, position?: { __typename?: 'Position', id: string, name?: string | null | undefined } | null | undefined } | { __typename: 'Member', id: any, first_name?: string | null | undefined, nickname?: string | null | undefined, last_name?: string | null | undefined } } | null | undefined>, pageInfo: { __typename?: 'PaginationInfo', totalPages: number } } | null | undefined };

export type NewsPageInfoQueryVariables = Exact<{
  page_number: Scalars['Int'];
  per_page: Scalars['Int'];
}>;


export type NewsPageInfoQuery = { __typename?: 'Query', news?: { __typename?: 'ArticlePagination', pageInfo: { __typename?: 'PaginationInfo', totalPages: number, totalItems: number, hasNextPage: boolean, hasPreviousPage: boolean } } | null | undefined };

export type ArticleQueryVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type ArticleQuery = { __typename?: 'Query', article?: { __typename?: 'Article', id: any, body: string, bodyEn?: string | null | undefined, header: string, headerEn?: string | null | undefined, likes: number, isLikedByMe: boolean, imageUrl?: any | null | undefined, publishedDatetime: any, author: { __typename: 'Mandate', member?: { __typename?: 'Member', id: any, first_name?: string | null | undefined, nickname?: string | null | undefined, last_name?: string | null | undefined } | null | undefined, position?: { __typename?: 'Position', id: string, name?: string | null | undefined } | null | undefined } | { __typename: 'Member', id: any, first_name?: string | null | undefined, nickname?: string | null | undefined, last_name?: string | null | undefined } } | null | undefined };

export type ArticleToEditQueryVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type ArticleToEditQuery = { __typename?: 'Query', article?: { __typename?: 'Article', id: any, body: string, bodyEn?: string | null | undefined, header: string, headerEn?: string | null | undefined, imageUrl?: any | null | undefined, publishedDatetime: any, author: { __typename: 'Mandate', id: any, member?: { __typename?: 'Member', id: any, first_name?: string | null | undefined, nickname?: string | null | undefined, last_name?: string | null | undefined, mandates?: Array<{ __typename?: 'Mandate', id: any, position?: { __typename?: 'Position', id: string, name?: string | null | undefined, nameEn?: string | null | undefined } | null | undefined }> | null | undefined } | null | undefined, position?: { __typename?: 'Position', id: string, name?: string | null | undefined } | null | undefined } | { __typename: 'Member', id: any, first_name?: string | null | undefined, nickname?: string | null | undefined, last_name?: string | null | undefined, mandates?: Array<{ __typename?: 'Mandate', id: any, position?: { __typename?: 'Position', id: string, name?: string | null | undefined, nameEn?: string | null | undefined } | null | undefined }> | null | undefined } } | null | undefined };

export type UpdateArticleMutationVariables = Exact<{
  id: Scalars['UUID'];
  header?: InputMaybe<Scalars['String']>;
  body?: InputMaybe<Scalars['String']>;
  headerEn?: InputMaybe<Scalars['String']>;
  bodyEn?: InputMaybe<Scalars['String']>;
  imageName?: InputMaybe<Scalars['String']>;
  mandateId?: InputMaybe<Scalars['UUID']>;
}>;


export type UpdateArticleMutation = { __typename?: 'Mutation', article?: { __typename?: 'ArticleMutations', update?: { __typename?: 'UpdateArticlePayload', uploadUrl?: any | null | undefined, article: { __typename?: 'Article', id: any, header: string, body: string, headerEn?: string | null | undefined, bodyEn?: string | null | undefined, imageUrl?: any | null | undefined } } | null | undefined } | null | undefined };

export type CreateArticleMutationVariables = Exact<{
  header: Scalars['String'];
  body: Scalars['String'];
  headerEn: Scalars['String'];
  bodyEn: Scalars['String'];
  imageName?: InputMaybe<Scalars['String']>;
  mandateId?: InputMaybe<Scalars['UUID']>;
}>;


export type CreateArticleMutation = { __typename?: 'Mutation', article?: { __typename?: 'ArticleMutations', create?: { __typename?: 'CreateArticlePayload', uploadUrl?: any | null | undefined, article: { __typename?: 'Article', id: any, header: string, body: string, headerEn?: string | null | undefined, bodyEn?: string | null | undefined, imageUrl?: any | null | undefined } } | null | undefined } | null | undefined };

export type LikeArticleMutationVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type LikeArticleMutation = { __typename?: 'Mutation', article?: { __typename?: 'ArticleMutations', like?: { __typename?: 'ArticlePayload', article: { __typename?: 'Article', id: any } } | null | undefined } | null | undefined };

export type DislikeArticleMutationVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type DislikeArticleMutation = { __typename?: 'Mutation', article?: { __typename?: 'ArticleMutations', dislike?: { __typename?: 'ArticlePayload', article: { __typename?: 'Article', id: any } } | null | undefined } | null | undefined };

export type RemoveArticleMutationVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type RemoveArticleMutation = { __typename?: 'Mutation', article?: { __typename?: 'ArticleMutations', remove?: { __typename?: 'ArticlePayload', article: { __typename?: 'Article', id: any } } | null | undefined } | null | undefined };

export type GetPresignedPutUrlMutationVariables = Exact<{
  fileName: Scalars['String'];
}>;


export type GetPresignedPutUrlMutation = { __typename?: 'Mutation', article?: { __typename?: 'ArticleMutations', presignedPutUrl?: string | null | undefined } | null | undefined };

export type GetPositionsQueryVariables = Exact<{
  committeeId?: InputMaybe<Scalars['UUID']>;
}>;


export type GetPositionsQuery = { __typename?: 'Query', positions?: { __typename?: 'PositionPagination', positions: Array<{ __typename?: 'Position', id: string, name?: string | null | undefined, nameEn?: string | null | undefined, committee?: { __typename?: 'Committee', name?: string | null | undefined } | null | undefined } | null | undefined>, pageInfo: { __typename?: 'PaginationInfo', hasNextPage: boolean } } | null | undefined };


export const ApiAccessDocument = gql`
    query ApiAccess {
  apiAccess {
    name
  }
}
    `;

/**
 * __useApiAccessQuery__
 *
 * To run a query within a React component, call `useApiAccessQuery` and pass it any options that fit your needs.
 * When your component renders, `useApiAccessQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useApiAccessQuery({
 *   variables: {
 *   },
 * });
 */
export function useApiAccessQuery(baseOptions?: Apollo.QueryHookOptions<ApiAccessQuery, ApiAccessQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ApiAccessQuery, ApiAccessQueryVariables>(ApiAccessDocument, options);
      }
export function useApiAccessLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ApiAccessQuery, ApiAccessQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ApiAccessQuery, ApiAccessQueryVariables>(ApiAccessDocument, options);
        }
export type ApiAccessQueryHookResult = ReturnType<typeof useApiAccessQuery>;
export type ApiAccessLazyQueryHookResult = ReturnType<typeof useApiAccessLazyQuery>;
export type ApiAccessQueryResult = Apollo.QueryResult<ApiAccessQuery, ApiAccessQueryVariables>;
export const GetApisDocument = gql`
    query GetApis {
  apis {
    name
  }
}
    `;

/**
 * __useGetApisQuery__
 *
 * To run a query within a React component, call `useGetApisQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetApisQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetApisQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetApisQuery(baseOptions?: Apollo.QueryHookOptions<GetApisQuery, GetApisQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetApisQuery, GetApisQueryVariables>(GetApisDocument, options);
      }
export function useGetApisLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetApisQuery, GetApisQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetApisQuery, GetApisQueryVariables>(GetApisDocument, options);
        }
export type GetApisQueryHookResult = ReturnType<typeof useGetApisQuery>;
export type GetApisLazyQueryHookResult = ReturnType<typeof useGetApisLazyQuery>;
export type GetApisQueryResult = Apollo.QueryResult<GetApisQuery, GetApisQueryVariables>;
export const GetApiDocument = gql`
    query GetApi($name: String!) {
  api(name: $name) {
    accessPolicies {
      accessor
      end_datetime
      id
      start_datetime
    }
    name
  }
}
    `;

/**
 * __useGetApiQuery__
 *
 * To run a query within a React component, call `useGetApiQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetApiQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetApiQuery({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useGetApiQuery(baseOptions: Apollo.QueryHookOptions<GetApiQuery, GetApiQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetApiQuery, GetApiQueryVariables>(GetApiDocument, options);
      }
export function useGetApiLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetApiQuery, GetApiQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetApiQuery, GetApiQueryVariables>(GetApiDocument, options);
        }
export type GetApiQueryHookResult = ReturnType<typeof useGetApiQuery>;
export type GetApiLazyQueryHookResult = ReturnType<typeof useGetApiLazyQuery>;
export type GetApiQueryResult = Apollo.QueryResult<GetApiQuery, GetApiQueryVariables>;
export const CreateApiAccessPolicyDocument = gql`
    mutation CreateApiAccessPolicy($apiName: String!, $who: String!) {
  access {
    policy {
      createApiAccessPolicy(input: {apiName: $apiName, who: $who}) {
        id
      }
    }
  }
}
    `;
export type CreateApiAccessPolicyMutationFn = Apollo.MutationFunction<CreateApiAccessPolicyMutation, CreateApiAccessPolicyMutationVariables>;

/**
 * __useCreateApiAccessPolicyMutation__
 *
 * To run a mutation, you first call `useCreateApiAccessPolicyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateApiAccessPolicyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createApiAccessPolicyMutation, { data, loading, error }] = useCreateApiAccessPolicyMutation({
 *   variables: {
 *      apiName: // value for 'apiName'
 *      who: // value for 'who'
 *   },
 * });
 */
export function useCreateApiAccessPolicyMutation(baseOptions?: Apollo.MutationHookOptions<CreateApiAccessPolicyMutation, CreateApiAccessPolicyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateApiAccessPolicyMutation, CreateApiAccessPolicyMutationVariables>(CreateApiAccessPolicyDocument, options);
      }
export type CreateApiAccessPolicyMutationHookResult = ReturnType<typeof useCreateApiAccessPolicyMutation>;
export type CreateApiAccessPolicyMutationResult = Apollo.MutationResult<CreateApiAccessPolicyMutation>;
export type CreateApiAccessPolicyMutationOptions = Apollo.BaseMutationOptions<CreateApiAccessPolicyMutation, CreateApiAccessPolicyMutationVariables>;
export const RemoveAccessPolicyDocument = gql`
    mutation RemoveAccessPolicy($id: UUID!) {
  access {
    policy {
      remove(id: $id) {
        id
      }
    }
  }
}
    `;
export type RemoveAccessPolicyMutationFn = Apollo.MutationFunction<RemoveAccessPolicyMutation, RemoveAccessPolicyMutationVariables>;

/**
 * __useRemoveAccessPolicyMutation__
 *
 * To run a mutation, you first call `useRemoveAccessPolicyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveAccessPolicyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeAccessPolicyMutation, { data, loading, error }] = useRemoveAccessPolicyMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveAccessPolicyMutation(baseOptions?: Apollo.MutationHookOptions<RemoveAccessPolicyMutation, RemoveAccessPolicyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveAccessPolicyMutation, RemoveAccessPolicyMutationVariables>(RemoveAccessPolicyDocument, options);
      }
export type RemoveAccessPolicyMutationHookResult = ReturnType<typeof useRemoveAccessPolicyMutation>;
export type RemoveAccessPolicyMutationResult = Apollo.MutationResult<RemoveAccessPolicyMutation>;
export type RemoveAccessPolicyMutationOptions = Apollo.BaseMutationOptions<RemoveAccessPolicyMutation, RemoveAccessPolicyMutationVariables>;
export const GetBookablesDocument = gql`
    query GetBookables {
  bookables {
    id
    name
    name_en
  }
}
    `;

/**
 * __useGetBookablesQuery__
 *
 * To run a query within a React component, call `useGetBookablesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBookablesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBookablesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetBookablesQuery(baseOptions?: Apollo.QueryHookOptions<GetBookablesQuery, GetBookablesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBookablesQuery, GetBookablesQueryVariables>(GetBookablesDocument, options);
      }
export function useGetBookablesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBookablesQuery, GetBookablesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBookablesQuery, GetBookablesQueryVariables>(GetBookablesDocument, options);
        }
export type GetBookablesQueryHookResult = ReturnType<typeof useGetBookablesQuery>;
export type GetBookablesLazyQueryHookResult = ReturnType<typeof useGetBookablesLazyQuery>;
export type GetBookablesQueryResult = Apollo.QueryResult<GetBookablesQuery, GetBookablesQueryVariables>;
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
    what {
      id
      name
      name_en
    }
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
    mutation CreateBookingRequest($bookerId: UUID!, $start: Datetime!, $end: Datetime!, $what: [String!]!, $event: String!) {
  bookingRequest {
    create(
      input: {start: $start, end: $end, what: $what, event: $event, booker_id: $bookerId}
    ) {
      start
      end
      what {
        id
        name
        name_en
      }
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
    mutation acceptBookingRequest($id: UUID!) {
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
    mutation denyBookingRequest($id: UUID!) {
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
export const GetCommitteesDocument = gql`
    query GetCommittees {
  committees(perPage: 50) {
    committees {
      id
      name
    }
  }
}
    `;

/**
 * __useGetCommitteesQuery__
 *
 * To run a query within a React component, call `useGetCommitteesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCommitteesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCommitteesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCommitteesQuery(baseOptions?: Apollo.QueryHookOptions<GetCommitteesQuery, GetCommitteesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCommitteesQuery, GetCommitteesQueryVariables>(GetCommitteesDocument, options);
      }
export function useGetCommitteesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCommitteesQuery, GetCommitteesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCommitteesQuery, GetCommitteesQueryVariables>(GetCommitteesDocument, options);
        }
export type GetCommitteesQueryHookResult = ReturnType<typeof useGetCommitteesQuery>;
export type GetCommitteesLazyQueryHookResult = ReturnType<typeof useGetCommitteesLazyQuery>;
export type GetCommitteesQueryResult = Apollo.QueryResult<GetCommitteesQuery, GetCommitteesQueryVariables>;
export const GetDoorsDocument = gql`
    query GetDoors {
  doors {
    name
  }
}
    `;

/**
 * __useGetDoorsQuery__
 *
 * To run a query within a React component, call `useGetDoorsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDoorsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDoorsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetDoorsQuery(baseOptions?: Apollo.QueryHookOptions<GetDoorsQuery, GetDoorsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDoorsQuery, GetDoorsQueryVariables>(GetDoorsDocument, options);
      }
export function useGetDoorsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDoorsQuery, GetDoorsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDoorsQuery, GetDoorsQueryVariables>(GetDoorsDocument, options);
        }
export type GetDoorsQueryHookResult = ReturnType<typeof useGetDoorsQuery>;
export type GetDoorsLazyQueryHookResult = ReturnType<typeof useGetDoorsLazyQuery>;
export type GetDoorsQueryResult = Apollo.QueryResult<GetDoorsQuery, GetDoorsQueryVariables>;
export const GetDoorDocument = gql`
    query GetDoor($name: String!) {
  door(name: $name) {
    accessPolicies {
      accessor
      end_datetime
      id
      start_datetime
    }
    id
    name
  }
}
    `;

/**
 * __useGetDoorQuery__
 *
 * To run a query within a React component, call `useGetDoorQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDoorQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDoorQuery({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useGetDoorQuery(baseOptions: Apollo.QueryHookOptions<GetDoorQuery, GetDoorQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDoorQuery, GetDoorQueryVariables>(GetDoorDocument, options);
      }
export function useGetDoorLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDoorQuery, GetDoorQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDoorQuery, GetDoorQueryVariables>(GetDoorDocument, options);
        }
export type GetDoorQueryHookResult = ReturnType<typeof useGetDoorQuery>;
export type GetDoorLazyQueryHookResult = ReturnType<typeof useGetDoorLazyQuery>;
export type GetDoorQueryResult = Apollo.QueryResult<GetDoorQuery, GetDoorQueryVariables>;
export const CreateDoorAccessPolicyDocument = gql`
    mutation CreateDoorAccessPolicy($doorName: String!, $who: String!, $startDatetime: Date, $endDatetime: Date) {
  access {
    policy {
      createDoorAccessPolicy(
        input: {doorName: $doorName, who: $who, startDatetime: $startDatetime, endDatetime: $endDatetime}
      ) {
        id
      }
    }
  }
}
    `;
export type CreateDoorAccessPolicyMutationFn = Apollo.MutationFunction<CreateDoorAccessPolicyMutation, CreateDoorAccessPolicyMutationVariables>;

/**
 * __useCreateDoorAccessPolicyMutation__
 *
 * To run a mutation, you first call `useCreateDoorAccessPolicyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDoorAccessPolicyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDoorAccessPolicyMutation, { data, loading, error }] = useCreateDoorAccessPolicyMutation({
 *   variables: {
 *      doorName: // value for 'doorName'
 *      who: // value for 'who'
 *      startDatetime: // value for 'startDatetime'
 *      endDatetime: // value for 'endDatetime'
 *   },
 * });
 */
export function useCreateDoorAccessPolicyMutation(baseOptions?: Apollo.MutationHookOptions<CreateDoorAccessPolicyMutation, CreateDoorAccessPolicyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDoorAccessPolicyMutation, CreateDoorAccessPolicyMutationVariables>(CreateDoorAccessPolicyDocument, options);
      }
export type CreateDoorAccessPolicyMutationHookResult = ReturnType<typeof useCreateDoorAccessPolicyMutation>;
export type CreateDoorAccessPolicyMutationResult = Apollo.MutationResult<CreateDoorAccessPolicyMutation>;
export type CreateDoorAccessPolicyMutationOptions = Apollo.BaseMutationOptions<CreateDoorAccessPolicyMutation, CreateDoorAccessPolicyMutationVariables>;
export const CreateDoorDocument = gql`
    mutation CreateDoor($name: String!) {
  access {
    door {
      create(input: {name: $name}) {
        name
      }
    }
  }
}
    `;
export type CreateDoorMutationFn = Apollo.MutationFunction<CreateDoorMutation, CreateDoorMutationVariables>;

/**
 * __useCreateDoorMutation__
 *
 * To run a mutation, you first call `useCreateDoorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDoorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDoorMutation, { data, loading, error }] = useCreateDoorMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateDoorMutation(baseOptions?: Apollo.MutationHookOptions<CreateDoorMutation, CreateDoorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDoorMutation, CreateDoorMutationVariables>(CreateDoorDocument, options);
      }
export type CreateDoorMutationHookResult = ReturnType<typeof useCreateDoorMutation>;
export type CreateDoorMutationResult = Apollo.MutationResult<CreateDoorMutation>;
export type CreateDoorMutationOptions = Apollo.BaseMutationOptions<CreateDoorMutation, CreateDoorMutationVariables>;
export const RemoveDoorDocument = gql`
    mutation RemoveDoor($name: String!) {
  access {
    door {
      remove(name: $name) {
        name
      }
    }
  }
}
    `;
export type RemoveDoorMutationFn = Apollo.MutationFunction<RemoveDoorMutation, RemoveDoorMutationVariables>;

/**
 * __useRemoveDoorMutation__
 *
 * To run a mutation, you first call `useRemoveDoorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveDoorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeDoorMutation, { data, loading, error }] = useRemoveDoorMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useRemoveDoorMutation(baseOptions?: Apollo.MutationHookOptions<RemoveDoorMutation, RemoveDoorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveDoorMutation, RemoveDoorMutationVariables>(RemoveDoorDocument, options);
      }
export type RemoveDoorMutationHookResult = ReturnType<typeof useRemoveDoorMutation>;
export type RemoveDoorMutationResult = Apollo.MutationResult<RemoveDoorMutation>;
export type RemoveDoorMutationOptions = Apollo.BaseMutationOptions<RemoveDoorMutation, RemoveDoorMutationVariables>;
export const EventsDocument = gql`
    query Events($start_datetime: Datetime, $end_datetime: Datetime) {
  events(filter: {start_datetime: $start_datetime, end_datetime: $end_datetime}) {
    events {
      title
      id
      short_description
      description
      start_datetime
      end_datetime
      link
      location
      organizer
      title_en
      description_en
      short_description_en
    }
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
 *      start_datetime: // value for 'start_datetime'
 *      end_datetime: // value for 'end_datetime'
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
export const EventDocument = gql`
    query Event($id: UUID!) {
  event(id: $id) {
    title
    id
    short_description
    description
    start_datetime
    end_datetime
    link
    location
    organizer
    title_en
    description_en
    short_description_en
  }
}
    `;

/**
 * __useEventQuery__
 *
 * To run a query within a React component, call `useEventQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useEventQuery(baseOptions: Apollo.QueryHookOptions<EventQuery, EventQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EventQuery, EventQueryVariables>(EventDocument, options);
      }
export function useEventLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EventQuery, EventQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EventQuery, EventQueryVariables>(EventDocument, options);
        }
export type EventQueryHookResult = ReturnType<typeof useEventQuery>;
export type EventLazyQueryHookResult = ReturnType<typeof useEventLazyQuery>;
export type EventQueryResult = Apollo.QueryResult<EventQuery, EventQueryVariables>;
export const UpdateEventDocument = gql`
    mutation UpdateEvent($id: UUID!, $title: String, $description: String, $short_description: String, $start_datetime: Datetime, $end_datetime: Datetime, $link: String, $location: String, $organizer: String, $title_en: String, $description_en: String, $short_description_en: String) {
  event {
    update(
      id: $id
      input: {title: $title, description: $description, short_description: $short_description, start_datetime: $start_datetime, end_datetime: $end_datetime, link: $link, location: $location, organizer: $organizer, title_en: $title_en, description_en: $description_en, short_description_en: $short_description_en}
    ) {
      title
      id
      short_description
      description
      start_datetime
      end_datetime
      link
      location
      organizer
      title_en
      description_en
      short_description_en
    }
  }
}
    `;
export type UpdateEventMutationFn = Apollo.MutationFunction<UpdateEventMutation, UpdateEventMutationVariables>;

/**
 * __useUpdateEventMutation__
 *
 * To run a mutation, you first call `useUpdateEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateEventMutation, { data, loading, error }] = useUpdateEventMutation({
 *   variables: {
 *      id: // value for 'id'
 *      title: // value for 'title'
 *      description: // value for 'description'
 *      short_description: // value for 'short_description'
 *      start_datetime: // value for 'start_datetime'
 *      end_datetime: // value for 'end_datetime'
 *      link: // value for 'link'
 *      location: // value for 'location'
 *      organizer: // value for 'organizer'
 *      title_en: // value for 'title_en'
 *      description_en: // value for 'description_en'
 *      short_description_en: // value for 'short_description_en'
 *   },
 * });
 */
export function useUpdateEventMutation(baseOptions?: Apollo.MutationHookOptions<UpdateEventMutation, UpdateEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateEventMutation, UpdateEventMutationVariables>(UpdateEventDocument, options);
      }
export type UpdateEventMutationHookResult = ReturnType<typeof useUpdateEventMutation>;
export type UpdateEventMutationResult = Apollo.MutationResult<UpdateEventMutation>;
export type UpdateEventMutationOptions = Apollo.BaseMutationOptions<UpdateEventMutation, UpdateEventMutationVariables>;
export const CreateEventDocument = gql`
    mutation CreateEvent($title: String!, $description: String!, $short_description: String!, $start_datetime: Datetime!, $end_datetime: Datetime!, $link: String, $location: String!, $organizer: String!, $title_en: String, $description_en: String, $short_description_en: String) {
  event {
    create(
      input: {title: $title, description: $description, short_description: $short_description, start_datetime: $start_datetime, end_datetime: $end_datetime, link: $link, location: $location, organizer: $organizer, title_en: $title_en, description_en: $description_en, short_description_en: $short_description_en}
    ) {
      title
      id
      short_description
      description
      start_datetime
      end_datetime
      link
      location
      organizer
      title_en
      description_en
      short_description_en
    }
  }
}
    `;
export type CreateEventMutationFn = Apollo.MutationFunction<CreateEventMutation, CreateEventMutationVariables>;

/**
 * __useCreateEventMutation__
 *
 * To run a mutation, you first call `useCreateEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEventMutation, { data, loading, error }] = useCreateEventMutation({
 *   variables: {
 *      title: // value for 'title'
 *      description: // value for 'description'
 *      short_description: // value for 'short_description'
 *      start_datetime: // value for 'start_datetime'
 *      end_datetime: // value for 'end_datetime'
 *      link: // value for 'link'
 *      location: // value for 'location'
 *      organizer: // value for 'organizer'
 *      title_en: // value for 'title_en'
 *      description_en: // value for 'description_en'
 *      short_description_en: // value for 'short_description_en'
 *   },
 * });
 */
export function useCreateEventMutation(baseOptions?: Apollo.MutationHookOptions<CreateEventMutation, CreateEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateEventMutation, CreateEventMutationVariables>(CreateEventDocument, options);
      }
export type CreateEventMutationHookResult = ReturnType<typeof useCreateEventMutation>;
export type CreateEventMutationResult = Apollo.MutationResult<CreateEventMutation>;
export type CreateEventMutationOptions = Apollo.BaseMutationOptions<CreateEventMutation, CreateEventMutationVariables>;
export const RemoveEventDocument = gql`
    mutation RemoveEvent($id: UUID!) {
  event {
    remove(id: $id) {
      id
    }
  }
}
    `;
export type RemoveEventMutationFn = Apollo.MutationFunction<RemoveEventMutation, RemoveEventMutationVariables>;

/**
 * __useRemoveEventMutation__
 *
 * To run a mutation, you first call `useRemoveEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeEventMutation, { data, loading, error }] = useRemoveEventMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveEventMutation(baseOptions?: Apollo.MutationHookOptions<RemoveEventMutation, RemoveEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveEventMutation, RemoveEventMutationVariables>(RemoveEventDocument, options);
      }
export type RemoveEventMutationHookResult = ReturnType<typeof useRemoveEventMutation>;
export type RemoveEventMutationResult = Apollo.MutationResult<RemoveEventMutation>;
export type RemoveEventMutationOptions = Apollo.BaseMutationOptions<RemoveEventMutation, RemoveEventMutationVariables>;
export const FilesDocument = gql`
    query files($bucket: String!, $prefix: String!) {
  files(bucket: $bucket, prefix: $prefix) {
    id
    name
    size
    isDir
    thumbnailUrl
  }
}
    `;

/**
 * __useFilesQuery__
 *
 * To run a query within a React component, call `useFilesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFilesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFilesQuery({
 *   variables: {
 *      bucket: // value for 'bucket'
 *      prefix: // value for 'prefix'
 *   },
 * });
 */
export function useFilesQuery(baseOptions: Apollo.QueryHookOptions<FilesQuery, FilesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FilesQuery, FilesQueryVariables>(FilesDocument, options);
      }
export function useFilesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FilesQuery, FilesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FilesQuery, FilesQueryVariables>(FilesDocument, options);
        }
export type FilesQueryHookResult = ReturnType<typeof useFilesQuery>;
export type FilesLazyQueryHookResult = ReturnType<typeof useFilesLazyQuery>;
export type FilesQueryResult = Apollo.QueryResult<FilesQuery, FilesQueryVariables>;
export const PresignedPutUrlDocument = gql`
    query PresignedPutUrl($bucket: String!, $fileName: String!) {
  presignedPutUrl(bucket: $bucket, fileName: $fileName)
}
    `;

/**
 * __usePresignedPutUrlQuery__
 *
 * To run a query within a React component, call `usePresignedPutUrlQuery` and pass it any options that fit your needs.
 * When your component renders, `usePresignedPutUrlQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePresignedPutUrlQuery({
 *   variables: {
 *      bucket: // value for 'bucket'
 *      fileName: // value for 'fileName'
 *   },
 * });
 */
export function usePresignedPutUrlQuery(baseOptions: Apollo.QueryHookOptions<PresignedPutUrlQuery, PresignedPutUrlQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PresignedPutUrlQuery, PresignedPutUrlQueryVariables>(PresignedPutUrlDocument, options);
      }
export function usePresignedPutUrlLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PresignedPutUrlQuery, PresignedPutUrlQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PresignedPutUrlQuery, PresignedPutUrlQueryVariables>(PresignedPutUrlDocument, options);
        }
export type PresignedPutUrlQueryHookResult = ReturnType<typeof usePresignedPutUrlQuery>;
export type PresignedPutUrlLazyQueryHookResult = ReturnType<typeof usePresignedPutUrlLazyQuery>;
export type PresignedPutUrlQueryResult = Apollo.QueryResult<PresignedPutUrlQuery, PresignedPutUrlQueryVariables>;
export const RemoveObjectsDocument = gql`
    mutation removeObjects($bucket: String!, $fileNames: [String!]!) {
  files {
    remove(bucket: $bucket, fileNames: $fileNames) {
      id
      name
    }
  }
}
    `;
export type RemoveObjectsMutationFn = Apollo.MutationFunction<RemoveObjectsMutation, RemoveObjectsMutationVariables>;

/**
 * __useRemoveObjectsMutation__
 *
 * To run a mutation, you first call `useRemoveObjectsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveObjectsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeObjectsMutation, { data, loading, error }] = useRemoveObjectsMutation({
 *   variables: {
 *      bucket: // value for 'bucket'
 *      fileNames: // value for 'fileNames'
 *   },
 * });
 */
export function useRemoveObjectsMutation(baseOptions?: Apollo.MutationHookOptions<RemoveObjectsMutation, RemoveObjectsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveObjectsMutation, RemoveObjectsMutationVariables>(RemoveObjectsDocument, options);
      }
export type RemoveObjectsMutationHookResult = ReturnType<typeof useRemoveObjectsMutation>;
export type RemoveObjectsMutationResult = Apollo.MutationResult<RemoveObjectsMutation>;
export type RemoveObjectsMutationOptions = Apollo.BaseMutationOptions<RemoveObjectsMutation, RemoveObjectsMutationVariables>;
export const MoveObjectsDocument = gql`
    mutation moveObjects($bucket: String!, $fileNames: [String!]!, $destination: String!) {
  files {
    move(bucket: $bucket, fileNames: $fileNames, newFolder: $destination) {
      file {
        id
        name
        size
        isDir
        thumbnailUrl
      }
      oldFile {
        id
        name
        size
        isDir
        thumbnailUrl
      }
    }
  }
}
    `;
export type MoveObjectsMutationFn = Apollo.MutationFunction<MoveObjectsMutation, MoveObjectsMutationVariables>;

/**
 * __useMoveObjectsMutation__
 *
 * To run a mutation, you first call `useMoveObjectsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMoveObjectsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [moveObjectsMutation, { data, loading, error }] = useMoveObjectsMutation({
 *   variables: {
 *      bucket: // value for 'bucket'
 *      fileNames: // value for 'fileNames'
 *      destination: // value for 'destination'
 *   },
 * });
 */
export function useMoveObjectsMutation(baseOptions?: Apollo.MutationHookOptions<MoveObjectsMutation, MoveObjectsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MoveObjectsMutation, MoveObjectsMutationVariables>(MoveObjectsDocument, options);
      }
export type MoveObjectsMutationHookResult = ReturnType<typeof useMoveObjectsMutation>;
export type MoveObjectsMutationResult = Apollo.MutationResult<MoveObjectsMutation>;
export type MoveObjectsMutationOptions = Apollo.BaseMutationOptions<MoveObjectsMutation, MoveObjectsMutationVariables>;
export const RenameObjectDocument = gql`
    mutation renameObject($bucket: String!, $fileName: String!, $newFileName: String!) {
  files {
    rename(bucket: $bucket, fileName: $fileName, newFileName: $newFileName) {
      file {
        id
        name
        size
        isDir
        thumbnailUrl
      }
    }
  }
}
    `;
export type RenameObjectMutationFn = Apollo.MutationFunction<RenameObjectMutation, RenameObjectMutationVariables>;

/**
 * __useRenameObjectMutation__
 *
 * To run a mutation, you first call `useRenameObjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRenameObjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [renameObjectMutation, { data, loading, error }] = useRenameObjectMutation({
 *   variables: {
 *      bucket: // value for 'bucket'
 *      fileName: // value for 'fileName'
 *      newFileName: // value for 'newFileName'
 *   },
 * });
 */
export function useRenameObjectMutation(baseOptions?: Apollo.MutationHookOptions<RenameObjectMutation, RenameObjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RenameObjectMutation, RenameObjectMutationVariables>(RenameObjectDocument, options);
      }
export type RenameObjectMutationHookResult = ReturnType<typeof useRenameObjectMutation>;
export type RenameObjectMutationResult = Apollo.MutationResult<RenameObjectMutation>;
export type RenameObjectMutationOptions = Apollo.BaseMutationOptions<RenameObjectMutation, RenameObjectMutationVariables>;
export const GetMandatesByPeriodDocument = gql`
    query GetMandatesByPeriod($page: Int!, $perPage: Int!, $start_date: Date, $end_date: Date) {
  mandates(
    page: $page
    perPage: $perPage
    filter: {start_date: $start_date, end_date: $end_date}
  ) {
    mandates {
      id
      start_date
      end_date
      position {
        name
        nameEn
        id
      }
      member {
        id
        first_name
        last_name
      }
    }
    pageInfo {
      totalPages
    }
  }
}
    `;

/**
 * __useGetMandatesByPeriodQuery__
 *
 * To run a query within a React component, call `useGetMandatesByPeriodQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMandatesByPeriodQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMandatesByPeriodQuery({
 *   variables: {
 *      page: // value for 'page'
 *      perPage: // value for 'perPage'
 *      start_date: // value for 'start_date'
 *      end_date: // value for 'end_date'
 *   },
 * });
 */
export function useGetMandatesByPeriodQuery(baseOptions: Apollo.QueryHookOptions<GetMandatesByPeriodQuery, GetMandatesByPeriodQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMandatesByPeriodQuery, GetMandatesByPeriodQueryVariables>(GetMandatesByPeriodDocument, options);
      }
export function useGetMandatesByPeriodLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMandatesByPeriodQuery, GetMandatesByPeriodQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMandatesByPeriodQuery, GetMandatesByPeriodQueryVariables>(GetMandatesByPeriodDocument, options);
        }
export type GetMandatesByPeriodQueryHookResult = ReturnType<typeof useGetMandatesByPeriodQuery>;
export type GetMandatesByPeriodLazyQueryHookResult = ReturnType<typeof useGetMandatesByPeriodLazyQuery>;
export type GetMandatesByPeriodQueryResult = Apollo.QueryResult<GetMandatesByPeriodQuery, GetMandatesByPeriodQueryVariables>;
export const CreateMandateDocument = gql`
    mutation CreateMandate($memberId: UUID!, $positionId: String!, $startDate: Date!, $endDate: Date!) {
  mandate {
    create(
      input: {member_id: $memberId, position_id: $positionId, start_date: $startDate, end_date: $endDate}
    ) {
      id
    }
  }
}
    `;
export type CreateMandateMutationFn = Apollo.MutationFunction<CreateMandateMutation, CreateMandateMutationVariables>;

/**
 * __useCreateMandateMutation__
 *
 * To run a mutation, you first call `useCreateMandateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMandateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMandateMutation, { data, loading, error }] = useCreateMandateMutation({
 *   variables: {
 *      memberId: // value for 'memberId'
 *      positionId: // value for 'positionId'
 *      startDate: // value for 'startDate'
 *      endDate: // value for 'endDate'
 *   },
 * });
 */
export function useCreateMandateMutation(baseOptions?: Apollo.MutationHookOptions<CreateMandateMutation, CreateMandateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMandateMutation, CreateMandateMutationVariables>(CreateMandateDocument, options);
      }
export type CreateMandateMutationHookResult = ReturnType<typeof useCreateMandateMutation>;
export type CreateMandateMutationResult = Apollo.MutationResult<CreateMandateMutation>;
export type CreateMandateMutationOptions = Apollo.BaseMutationOptions<CreateMandateMutation, CreateMandateMutationVariables>;
export const RemoveMandateDocument = gql`
    mutation RemoveMandate($mandateId: UUID!) {
  mandate {
    remove(id: $mandateId) {
      id
    }
  }
}
    `;
export type RemoveMandateMutationFn = Apollo.MutationFunction<RemoveMandateMutation, RemoveMandateMutationVariables>;

/**
 * __useRemoveMandateMutation__
 *
 * To run a mutation, you first call `useRemoveMandateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveMandateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeMandateMutation, { data, loading, error }] = useRemoveMandateMutation({
 *   variables: {
 *      mandateId: // value for 'mandateId'
 *   },
 * });
 */
export function useRemoveMandateMutation(baseOptions?: Apollo.MutationHookOptions<RemoveMandateMutation, RemoveMandateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveMandateMutation, RemoveMandateMutationVariables>(RemoveMandateDocument, options);
      }
export type RemoveMandateMutationHookResult = ReturnType<typeof useRemoveMandateMutation>;
export type RemoveMandateMutationResult = Apollo.MutationResult<RemoveMandateMutation>;
export type RemoveMandateMutationOptions = Apollo.BaseMutationOptions<RemoveMandateMutation, RemoveMandateMutationVariables>;
export const GetMarkdownsDocument = gql`
    query GetMarkdowns {
  markdowns {
    name
  }
}
    `;

/**
 * __useGetMarkdownsQuery__
 *
 * To run a query within a React component, call `useGetMarkdownsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMarkdownsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMarkdownsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMarkdownsQuery(baseOptions?: Apollo.QueryHookOptions<GetMarkdownsQuery, GetMarkdownsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMarkdownsQuery, GetMarkdownsQueryVariables>(GetMarkdownsDocument, options);
      }
export function useGetMarkdownsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMarkdownsQuery, GetMarkdownsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMarkdownsQuery, GetMarkdownsQueryVariables>(GetMarkdownsDocument, options);
        }
export type GetMarkdownsQueryHookResult = ReturnType<typeof useGetMarkdownsQuery>;
export type GetMarkdownsLazyQueryHookResult = ReturnType<typeof useGetMarkdownsLazyQuery>;
export type GetMarkdownsQueryResult = Apollo.QueryResult<GetMarkdownsQuery, GetMarkdownsQueryVariables>;
export const GetMarkdownDocument = gql`
    query GetMarkdown($name: String!) {
  markdown(name: $name) {
    name
    markdown
    markdown_en
  }
}
    `;

/**
 * __useGetMarkdownQuery__
 *
 * To run a query within a React component, call `useGetMarkdownQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMarkdownQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMarkdownQuery({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useGetMarkdownQuery(baseOptions: Apollo.QueryHookOptions<GetMarkdownQuery, GetMarkdownQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMarkdownQuery, GetMarkdownQueryVariables>(GetMarkdownDocument, options);
      }
export function useGetMarkdownLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMarkdownQuery, GetMarkdownQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMarkdownQuery, GetMarkdownQueryVariables>(GetMarkdownDocument, options);
        }
export type GetMarkdownQueryHookResult = ReturnType<typeof useGetMarkdownQuery>;
export type GetMarkdownLazyQueryHookResult = ReturnType<typeof useGetMarkdownLazyQuery>;
export type GetMarkdownQueryResult = Apollo.QueryResult<GetMarkdownQuery, GetMarkdownQueryVariables>;
export const UpdateMarkdownDocument = gql`
    mutation UpdateMarkdown($name: String!, $markdown: String!, $markdown_en: String) {
  markdown {
    update(name: $name, input: {markdown: $markdown, markdown_en: $markdown_en}) {
      name
      markdown
      markdown_en
    }
  }
}
    `;
export type UpdateMarkdownMutationFn = Apollo.MutationFunction<UpdateMarkdownMutation, UpdateMarkdownMutationVariables>;

/**
 * __useUpdateMarkdownMutation__
 *
 * To run a mutation, you first call `useUpdateMarkdownMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMarkdownMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMarkdownMutation, { data, loading, error }] = useUpdateMarkdownMutation({
 *   variables: {
 *      name: // value for 'name'
 *      markdown: // value for 'markdown'
 *      markdown_en: // value for 'markdown_en'
 *   },
 * });
 */
export function useUpdateMarkdownMutation(baseOptions?: Apollo.MutationHookOptions<UpdateMarkdownMutation, UpdateMarkdownMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateMarkdownMutation, UpdateMarkdownMutationVariables>(UpdateMarkdownDocument, options);
      }
export type UpdateMarkdownMutationHookResult = ReturnType<typeof useUpdateMarkdownMutation>;
export type UpdateMarkdownMutationResult = Apollo.MutationResult<UpdateMarkdownMutation>;
export type UpdateMarkdownMutationOptions = Apollo.BaseMutationOptions<UpdateMarkdownMutation, UpdateMarkdownMutationVariables>;
export const CreateMarkdownDocument = gql`
    mutation CreateMarkdown($name: String!) {
  markdown {
    create(input: {name: $name}) {
      name
    }
  }
}
    `;
export type CreateMarkdownMutationFn = Apollo.MutationFunction<CreateMarkdownMutation, CreateMarkdownMutationVariables>;

/**
 * __useCreateMarkdownMutation__
 *
 * To run a mutation, you first call `useCreateMarkdownMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMarkdownMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMarkdownMutation, { data, loading, error }] = useCreateMarkdownMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateMarkdownMutation(baseOptions?: Apollo.MutationHookOptions<CreateMarkdownMutation, CreateMarkdownMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMarkdownMutation, CreateMarkdownMutationVariables>(CreateMarkdownDocument, options);
      }
export type CreateMarkdownMutationHookResult = ReturnType<typeof useCreateMarkdownMutation>;
export type CreateMarkdownMutationResult = Apollo.MutationResult<CreateMarkdownMutation>;
export type CreateMarkdownMutationOptions = Apollo.BaseMutationOptions<CreateMarkdownMutation, CreateMarkdownMutationVariables>;
export const MeHeaderDocument = gql`
    query MeHeader {
  me {
    id
    first_name
    nickname
    last_name
    student_id
    picture_path
    mandates(onlyActive: true) {
      id
      position {
        id
        name
        nameEn
      }
    }
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
export const GetMembersDocument = gql`
    query GetMembers {
  members(perPage: 100) {
    members {
      id
      first_name
      nickname
      last_name
      student_id
    }
  }
}
    `;

/**
 * __useGetMembersQuery__
 *
 * To run a query within a React component, call `useGetMembersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMembersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMembersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMembersQuery(baseOptions?: Apollo.QueryHookOptions<GetMembersQuery, GetMembersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMembersQuery, GetMembersQueryVariables>(GetMembersDocument, options);
      }
export function useGetMembersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMembersQuery, GetMembersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMembersQuery, GetMembersQueryVariables>(GetMembersDocument, options);
        }
export type GetMembersQueryHookResult = ReturnType<typeof useGetMembersQuery>;
export type GetMembersLazyQueryHookResult = ReturnType<typeof useGetMembersLazyQuery>;
export type GetMembersQueryResult = Apollo.QueryResult<GetMembersQuery, GetMembersQueryVariables>;
export const MemberPageDocument = gql`
    query MemberPage($id: UUID!) {
  memberById(id: $id) {
    id
    first_name
    nickname
    last_name
    student_id
    class_programme
    class_year
    picture_path
    mandates {
      id
      start_date
      end_date
      position {
        id
        name
        nameEn
      }
    }
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
      id
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
    mutation UpdateMember($id: UUID!, $firstName: String, $lastName: String, $nickname: String, $classProgramme: String, $classYear: Int, $picturePath: String) {
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
      likes
      isLikedByMe
      author {
        __typename
        ... on Member {
          id
          first_name
          nickname
          last_name
        }
        ... on Mandate {
          member {
            id
            first_name
            nickname
            last_name
          }
          position {
            id
            name
          }
        }
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
    query Article($id: UUID!) {
  article(id: $id) {
    id
    body
    bodyEn
    header
    headerEn
    likes
    isLikedByMe
    author {
      __typename
      ... on Member {
        id
        first_name
        nickname
        last_name
      }
      ... on Mandate {
        member {
          id
          first_name
          nickname
          last_name
        }
        position {
          id
          name
        }
      }
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
export const ArticleToEditDocument = gql`
    query ArticleToEdit($id: UUID!) {
  article(id: $id) {
    id
    body
    bodyEn
    header
    headerEn
    author {
      __typename
      ... on Member {
        id
        first_name
        nickname
        last_name
        mandates(onlyActive: true) {
          id
          position {
            id
            name
            nameEn
          }
        }
      }
      ... on Mandate {
        id
        member {
          id
          first_name
          nickname
          last_name
          mandates(onlyActive: true) {
            id
            position {
              id
              name
              nameEn
            }
          }
        }
        position {
          id
          name
        }
      }
    }
    imageUrl
    publishedDatetime
  }
}
    `;

/**
 * __useArticleToEditQuery__
 *
 * To run a query within a React component, call `useArticleToEditQuery` and pass it any options that fit your needs.
 * When your component renders, `useArticleToEditQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useArticleToEditQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useArticleToEditQuery(baseOptions: Apollo.QueryHookOptions<ArticleToEditQuery, ArticleToEditQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ArticleToEditQuery, ArticleToEditQueryVariables>(ArticleToEditDocument, options);
      }
export function useArticleToEditLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ArticleToEditQuery, ArticleToEditQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ArticleToEditQuery, ArticleToEditQueryVariables>(ArticleToEditDocument, options);
        }
export type ArticleToEditQueryHookResult = ReturnType<typeof useArticleToEditQuery>;
export type ArticleToEditLazyQueryHookResult = ReturnType<typeof useArticleToEditLazyQuery>;
export type ArticleToEditQueryResult = Apollo.QueryResult<ArticleToEditQuery, ArticleToEditQueryVariables>;
export const UpdateArticleDocument = gql`
    mutation UpdateArticle($id: UUID!, $header: String, $body: String, $headerEn: String, $bodyEn: String, $imageName: String, $mandateId: UUID) {
  article {
    update(
      id: $id
      input: {header: $header, body: $body, headerEn: $headerEn, bodyEn: $bodyEn, imageName: $imageName, mandateId: $mandateId}
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
 *      mandateId: // value for 'mandateId'
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
    mutation CreateArticle($header: String!, $body: String!, $headerEn: String!, $bodyEn: String!, $imageName: String, $mandateId: UUID) {
  article {
    create(
      input: {header: $header, body: $body, headerEn: $headerEn, bodyEn: $bodyEn, imageName: $imageName, mandateId: $mandateId}
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
 *      mandateId: // value for 'mandateId'
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
export const LikeArticleDocument = gql`
    mutation LikeArticle($id: UUID!) {
  article {
    like(id: $id) {
      article {
        id
      }
    }
  }
}
    `;
export type LikeArticleMutationFn = Apollo.MutationFunction<LikeArticleMutation, LikeArticleMutationVariables>;

/**
 * __useLikeArticleMutation__
 *
 * To run a mutation, you first call `useLikeArticleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLikeArticleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [likeArticleMutation, { data, loading, error }] = useLikeArticleMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useLikeArticleMutation(baseOptions?: Apollo.MutationHookOptions<LikeArticleMutation, LikeArticleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LikeArticleMutation, LikeArticleMutationVariables>(LikeArticleDocument, options);
      }
export type LikeArticleMutationHookResult = ReturnType<typeof useLikeArticleMutation>;
export type LikeArticleMutationResult = Apollo.MutationResult<LikeArticleMutation>;
export type LikeArticleMutationOptions = Apollo.BaseMutationOptions<LikeArticleMutation, LikeArticleMutationVariables>;
export const DislikeArticleDocument = gql`
    mutation DislikeArticle($id: UUID!) {
  article {
    dislike(id: $id) {
      article {
        id
      }
    }
  }
}
    `;
export type DislikeArticleMutationFn = Apollo.MutationFunction<DislikeArticleMutation, DislikeArticleMutationVariables>;

/**
 * __useDislikeArticleMutation__
 *
 * To run a mutation, you first call `useDislikeArticleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDislikeArticleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [dislikeArticleMutation, { data, loading, error }] = useDislikeArticleMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDislikeArticleMutation(baseOptions?: Apollo.MutationHookOptions<DislikeArticleMutation, DislikeArticleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DislikeArticleMutation, DislikeArticleMutationVariables>(DislikeArticleDocument, options);
      }
export type DislikeArticleMutationHookResult = ReturnType<typeof useDislikeArticleMutation>;
export type DislikeArticleMutationResult = Apollo.MutationResult<DislikeArticleMutation>;
export type DislikeArticleMutationOptions = Apollo.BaseMutationOptions<DislikeArticleMutation, DislikeArticleMutationVariables>;
export const RemoveArticleDocument = gql`
    mutation RemoveArticle($id: UUID!) {
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
export const GetPositionsDocument = gql`
    query GetPositions($committeeId: UUID) {
  positions(filter: {committee_id: $committeeId}) {
    positions {
      id
      name
      nameEn
      committee {
        name
      }
    }
    pageInfo {
      hasNextPage
    }
  }
}
    `;

/**
 * __useGetPositionsQuery__
 *
 * To run a query within a React component, call `useGetPositionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPositionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPositionsQuery({
 *   variables: {
 *      committeeId: // value for 'committeeId'
 *   },
 * });
 */
export function useGetPositionsQuery(baseOptions?: Apollo.QueryHookOptions<GetPositionsQuery, GetPositionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPositionsQuery, GetPositionsQueryVariables>(GetPositionsDocument, options);
      }
export function useGetPositionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPositionsQuery, GetPositionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPositionsQuery, GetPositionsQueryVariables>(GetPositionsDocument, options);
        }
export type GetPositionsQueryHookResult = ReturnType<typeof useGetPositionsQuery>;
export type GetPositionsLazyQueryHookResult = ReturnType<typeof useGetPositionsLazyQuery>;
export type GetPositionsQueryResult = Apollo.QueryResult<GetPositionsQuery, GetPositionsQueryVariables>;