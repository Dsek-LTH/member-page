import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
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
  _Any: any;
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

export type AdminMutations = {
  __typename?: 'AdminMutations';
  seed?: Maybe<Scalars['Boolean']>;
  syncMandatesWithKeycloak?: Maybe<Scalars['Boolean']>;
  updateSearchIndex?: Maybe<Scalars['Boolean']>;
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
  comments: Array<Maybe<Comment>>;
  header: Scalars['String'];
  headerEn?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  imageUrl?: Maybe<Scalars['Url']>;
  isLikedByMe: Scalars['Boolean'];
  latestEditDatetime?: Maybe<Scalars['Datetime']>;
  likers: Array<Maybe<Member>>;
  likes: Scalars['Int'];
  publishedDatetime: Scalars['Datetime'];
  slug?: Maybe<Scalars['String']>;
  tags: Array<Maybe<Tag>>;
};

export type ArticleMutations = {
  __typename?: 'ArticleMutations';
  comment?: Maybe<ArticlePayload>;
  create?: Maybe<CreateArticlePayload>;
  getUploadData?: Maybe<UploadData>;
  like?: Maybe<ArticlePayload>;
  remove?: Maybe<ArticlePayload>;
  removeComment?: Maybe<ArticlePayload>;
  unlike?: Maybe<ArticlePayload>;
  update?: Maybe<UpdateArticlePayload>;
};


export type ArticleMutationsCommentArgs = {
  content: Scalars['String'];
  id: Scalars['UUID'];
};


export type ArticleMutationsCreateArgs = {
  input: CreateArticle;
};


export type ArticleMutationsGetUploadDataArgs = {
  fileName: Scalars['String'];
  header: Scalars['String'];
};


export type ArticleMutationsLikeArgs = {
  id: Scalars['UUID'];
};


export type ArticleMutationsRemoveArgs = {
  id: Scalars['UUID'];
};


export type ArticleMutationsRemoveCommentArgs = {
  commentId: Scalars['UUID'];
};


export type ArticleMutationsUnlikeArgs = {
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
  category?: Maybe<BookableCategory>;
  id: Scalars['UUID'];
  isDisabled: Scalars['Boolean'];
  name: Scalars['String'];
  name_en: Scalars['String'];
};

export type BookableCategory = {
  __typename?: 'BookableCategory';
  id: Scalars['UUID'];
  name: Scalars['String'];
  name_en: Scalars['String'];
};

export type BookableMutations = {
  __typename?: 'BookableMutations';
  create?: Maybe<Bookable>;
  update?: Maybe<Bookable>;
};


export type BookableMutationsCreateArgs = {
  input: CreateBookable;
};


export type BookableMutationsUpdateArgs = {
  id: Scalars['UUID'];
  input: UpdateBookable;
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

export type Comment = {
  __typename?: 'Comment';
  content: Scalars['String'];
  id: Scalars['UUID'];
  member: Member;
  published: Scalars['Datetime'];
};

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
  sendNotification?: InputMaybe<Scalars['Boolean']>;
  tagIds?: InputMaybe<Array<Scalars['UUID']>>;
};

export type CreateArticlePayload = {
  __typename?: 'CreateArticlePayload';
  article: Article;
  uploadUrl?: Maybe<Scalars['Url']>;
};

export type CreateBookable = {
  categoryId?: InputMaybe<Scalars['UUID']>;
  name: Scalars['String'];
  name_en?: InputMaybe<Scalars['String']>;
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

export type CreateMailAlias = {
  email: Scalars['String'];
  position_id: Scalars['String'];
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

export type CreateTag = {
  color?: InputMaybe<Scalars['String']>;
  icon?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  nameEn?: InputMaybe<Scalars['String']>;
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
  isLikedByMe: Scalars['Boolean'];
  likes: Scalars['Int'];
  link?: Maybe<Scalars['String']>;
  location?: Maybe<Scalars['String']>;
  number_of_updates: Scalars['Int'];
  organizer: Scalars['String'];
  short_description: Scalars['String'];
  short_description_en?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
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
  like?: Maybe<Event>;
  remove?: Maybe<Event>;
  unlike?: Maybe<Event>;
  update?: Maybe<Event>;
};


export type EventMutationsCreateArgs = {
  input: CreateEvent;
};


export type EventMutationsLikeArgs = {
  id: Scalars['UUID'];
};


export type EventMutationsRemoveArgs = {
  id: Scalars['UUID'];
};


export type EventMutationsUnlikeArgs = {
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

export type FastMandate = {
  __typename?: 'FastMandate';
  end_date: Scalars['Date'];
  id: Scalars['UUID'];
  member?: Maybe<Member>;
  position?: Maybe<Position>;
  start_date: Scalars['Date'];
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

export type MailAlias = {
  __typename?: 'MailAlias';
  email: Scalars['String'];
  policies: Array<Maybe<MailAliasPolicy>>;
};

export type MailAliasMutations = {
  __typename?: 'MailAliasMutations';
  create?: Maybe<MailAlias>;
  remove?: Maybe<MailAlias>;
};


export type MailAliasMutationsCreateArgs = {
  input: CreateMailAlias;
};


export type MailAliasMutationsRemoveArgs = {
  id: Scalars['UUID'];
};

export type MailAliasPolicy = {
  __typename?: 'MailAliasPolicy';
  id: Scalars['UUID'];
  position: Position;
};

export type MailRecipient = {
  __typename?: 'MailRecipient';
  alias: Scalars['String'];
  emails?: Maybe<Array<Scalars['String']>>;
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
  mandates: Array<Maybe<FastMandate>>;
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
  admin?: Maybe<AdminMutations>;
  alias?: Maybe<MailAliasMutations>;
  article?: Maybe<ArticleMutations>;
  bookable?: Maybe<BookableMutations>;
  bookingRequest?: Maybe<BookingRequestMutations>;
  committee?: Maybe<CommitteeMutations>;
  event?: Maybe<EventMutations>;
  files?: Maybe<FileMutations>;
  mandate?: Maybe<MandateMutations>;
  markdown?: Maybe<MarkdownMutations>;
  member?: Maybe<MemberMutations>;
  position?: Maybe<PositionMutations>;
  tags?: Maybe<TagMutations>;
  token?: Maybe<TokenMutations>;
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
  activeMandates?: Maybe<Array<Maybe<Mandate>>>;
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
  _entities: Array<Maybe<_Entity>>;
  _service: _Service;
  alias?: Maybe<MailAlias>;
  aliases?: Maybe<Array<Maybe<MailAlias>>>;
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
  mandatePagination?: Maybe<MandatePagination>;
  markdown?: Maybe<Markdown>;
  markdowns: Array<Maybe<Markdown>>;
  me?: Maybe<Member>;
  member?: Maybe<Member>;
  memberById?: Maybe<Member>;
  members?: Maybe<MemberPagination>;
  news?: Maybe<ArticlePagination>;
  positions?: Maybe<PositionPagination>;
  presignedPutUrl?: Maybe<Scalars['String']>;
  resolveAlias?: Maybe<Array<Maybe<Scalars['String']>>>;
  resolveRecipients: Array<Maybe<MailRecipient>>;
  songById?: Maybe<Song>;
  songByTitle?: Maybe<Song>;
  songs?: Maybe<Array<Maybe<Song>>>;
  tag?: Maybe<Tag>;
  tags: Array<Maybe<Tag>>;
  token?: Maybe<Token>;
  userHasAccessToAlias: Scalars['Boolean'];
};


export type Query_EntitiesArgs = {
  representations: Array<Scalars['_Any']>;
};


export type QueryAliasArgs = {
  email: Scalars['String'];
};


export type QueryApiArgs = {
  name: Scalars['String'];
};


export type QueryArticleArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type QueryBookablesArgs = {
  includeDisabled?: InputMaybe<Scalars['Boolean']>;
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
  id?: InputMaybe<Scalars['UUID']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type QueryEventsArgs = {
  filter?: InputMaybe<EventFilter>;
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
};


export type QueryFilesArgs = {
  bucket: Scalars['String'];
  prefix: Scalars['String'];
  recursive?: InputMaybe<Scalars['Boolean']>;
};


export type QueryMandatePaginationArgs = {
  filter?: InputMaybe<MandateFilter>;
  page?: Scalars['Int'];
  perPage?: Scalars['Int'];
};


export type QueryMarkdownArgs = {
  name: Scalars['String'];
};


export type QueryMemberArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  student_id?: InputMaybe<Scalars['String']>;
};


export type QueryMemberByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
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


export type QuerySongByIdArgs = {
  id: Scalars['UUID'];
};


export type QuerySongByTitleArgs = {
  title: Scalars['String'];
};


export type QueryTagArgs = {
  id: Scalars['UUID'];
};


export type QueryTokenArgs = {
  expo_token: Scalars['String'];
};


export type QueryUserHasAccessToAliasArgs = {
  alias: Scalars['String'];
  student_id: Scalars['String'];
};

export type Song = {
  __typename?: 'Song';
  category: Scalars['String'];
  created_at: Scalars['Date'];
  id: Scalars['UUID'];
  lyrics: Scalars['String'];
  melody: Scalars['String'];
  title: Scalars['String'];
  updated_at?: Maybe<Scalars['Date']>;
};

export type Tag = {
  __typename?: 'Tag';
  color?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  name: Scalars['String'];
  nameEn: Scalars['String'];
};

export type TagMutations = {
  __typename?: 'TagMutations';
  create?: Maybe<Tag>;
  update?: Maybe<Tag>;
};


export type TagMutationsCreateArgs = {
  input: CreateTag;
};


export type TagMutationsUpdateArgs = {
  id: Scalars['UUID'];
  input: UpdateTag;
};

export type Token = {
  __typename?: 'Token';
  expo_token: Scalars['String'];
  id: Scalars['UUID'];
  memberId?: Maybe<Scalars['UUID']>;
  tagSubscriptions: Array<Maybe<Tag>>;
};

export type TokenMutations = {
  __typename?: 'TokenMutations';
  register?: Maybe<Token>;
  subscribe?: Maybe<Array<Scalars['UUID']>>;
  unsubscribe?: Maybe<Scalars['Int']>;
};


export type TokenMutationsRegisterArgs = {
  expo_token: Scalars['String'];
};


export type TokenMutationsSubscribeArgs = {
  expo_token: Scalars['String'];
  tagIds: Array<Scalars['UUID']>;
};


export type TokenMutationsUnsubscribeArgs = {
  expo_token: Scalars['String'];
  tagIds: Array<Scalars['UUID']>;
};

export type UpdateArticle = {
  body?: InputMaybe<Scalars['String']>;
  bodyEn?: InputMaybe<Scalars['String']>;
  header?: InputMaybe<Scalars['String']>;
  headerEn?: InputMaybe<Scalars['String']>;
  imageName?: InputMaybe<Scalars['String']>;
  mandateId?: InputMaybe<Scalars['UUID']>;
  tagIds?: InputMaybe<Array<Scalars['UUID']>>;
};

export type UpdateArticlePayload = {
  __typename?: 'UpdateArticlePayload';
  article: Article;
  uploadUrl?: Maybe<Scalars['Url']>;
};

export type UpdateBookable = {
  categoryId?: InputMaybe<Scalars['UUID']>;
  isDisabled?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  name_en?: InputMaybe<Scalars['String']>;
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

export type UpdateTag = {
  color?: InputMaybe<Scalars['String']>;
  icon?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  nameEn?: InputMaybe<Scalars['String']>;
};

export type UploadData = {
  __typename?: 'UploadData';
  fileUrl: Scalars['String'];
  uploadUrl: Scalars['String'];
};

export type _Entity = AccessPolicy | Api | Article | Bookable | BookableCategory | BookingRequest | Committee | Door | Event | FastMandate | FileData | MailAlias | MailAliasPolicy | Mandate | Markdown | Member | Position | Tag | Token;

export type _Service = {
  __typename?: '_Service';
  /** The sdl representing the federated service capabilities. Includes federation directives, removes federation types, and includes rest of full schema after schema directives have been applied */
  sdl?: Maybe<Scalars['String']>;
};

export type FileChange = {
  __typename?: 'fileChange';
  file: FileData;
  oldFile?: Maybe<FileData>;
};

export type NewsPageQueryVariables = Exact<{
  page_number: Scalars['Int'];
  per_page: Scalars['Int'];
}>;


export type NewsPageQuery = { __typename?: 'Query', news?: { __typename?: 'ArticlePagination', articles: Array<{ __typename?: 'Article', id: any, header: string, headerEn?: string | null, body: string, bodyEn?: string | null, likes: number, isLikedByMe: boolean, imageUrl?: any | null, publishedDatetime: any, latestEditDatetime?: any | null, author: { __typename: 'Mandate', member?: { __typename?: 'Member', id: any, first_name?: string | null, nickname?: string | null, last_name?: string | null } | null, position?: { __typename?: 'Position', id: string, name?: string | null } | null } | { __typename: 'Member', id: any, first_name?: string | null, nickname?: string | null, last_name?: string | null } } | null>, pageInfo: { __typename?: 'PaginationInfo', totalPages: number } } | null };

export type ArticleQueryVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type ArticleQuery = { __typename?: 'Query', article?: { __typename?: 'Article', id: any, body: string, bodyEn?: string | null, header: string, headerEn?: string | null, likes: number, isLikedByMe: boolean, imageUrl?: any | null, publishedDatetime: any, author: { __typename: 'Mandate', member?: { __typename?: 'Member', id: any, first_name?: string | null, nickname?: string | null, last_name?: string | null } | null, position?: { __typename?: 'Position', id: string, name?: string | null } | null } | { __typename: 'Member', id: any, first_name?: string | null, nickname?: string | null, last_name?: string | null } } | null };

export type MeHeaderQueryVariables = Exact<{ [key: string]: never; }>;


export type MeHeaderQuery = { __typename?: 'Query', me?: { __typename?: 'Member', id: any, first_name?: string | null, nickname?: string | null, last_name?: string | null, student_id?: string | null, picture_path?: string | null, mandates?: Array<{ __typename?: 'Mandate', id: any, position?: { __typename?: 'Position', id: string, name?: string | null, nameEn?: string | null } | null }> | null } | null };

export type ApiAccessQueryVariables = Exact<{ [key: string]: never; }>;


export type ApiAccessQuery = { __typename?: 'Query', apiAccess?: Array<{ __typename?: 'Api', name: string }> | null };

export type MemberPageQueryVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type MemberPageQuery = { __typename?: 'Query', memberById?: { __typename?: 'Member', id: any, first_name?: string | null, nickname?: string | null, last_name?: string | null, student_id?: string | null, class_programme?: string | null, class_year?: number | null, picture_path?: string | null, mandates?: Array<{ __typename?: 'Mandate', id: any, start_date: any, end_date: any, position?: { __typename?: 'Position', id: string, name?: string | null, nameEn?: string | null } | null }> | null } | null };

export type UploadTokenMutationVariables = Exact<{
  token: Scalars['String'];
}>;


export type UploadTokenMutation = { __typename?: 'Mutation', token?: { __typename?: 'TokenMutations', register?: { __typename?: 'Token', expo_token: string, id: any } | null } | null };


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
export const UploadTokenDocument = gql`
    mutation UploadToken($token: String!) {
  token {
    register(expo_token: $token) {
      expo_token
      id
    }
  }
}
    `;
export type UploadTokenMutationFn = Apollo.MutationFunction<UploadTokenMutation, UploadTokenMutationVariables>;

/**
 * __useUploadTokenMutation__
 *
 * To run a mutation, you first call `useUploadTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadTokenMutation, { data, loading, error }] = useUploadTokenMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useUploadTokenMutation(baseOptions?: Apollo.MutationHookOptions<UploadTokenMutation, UploadTokenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadTokenMutation, UploadTokenMutationVariables>(UploadTokenDocument, options);
      }
export type UploadTokenMutationHookResult = ReturnType<typeof useUploadTokenMutation>;
export type UploadTokenMutationResult = Apollo.MutationResult<UploadTokenMutation>;
export type UploadTokenMutationOptions = Apollo.BaseMutationOptions<UploadTokenMutation, UploadTokenMutationVariables>;