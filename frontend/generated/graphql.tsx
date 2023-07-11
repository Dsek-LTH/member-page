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
  createSetting?: Maybe<AdminSetting>;
  deleteSetting?: Maybe<AdminSetting>;
  seed?: Maybe<Scalars['Boolean']>;
  setStabHiddenPeriod?: Maybe<Array<Maybe<AdminSetting>>>;
  syncMandatesWithKeycloak?: Maybe<Scalars['Boolean']>;
  updateSearchIndex?: Maybe<Scalars['Boolean']>;
  updateSetting?: Maybe<AdminSetting>;
};


export type AdminMutationsCreateSettingArgs = {
  key: Scalars['String'];
  value: Scalars['String'];
};


export type AdminMutationsDeleteSettingArgs = {
  key: Scalars['String'];
};


export type AdminMutationsSetStabHiddenPeriodArgs = {
  end: Scalars['Date'];
  start: Scalars['Date'];
};


export type AdminMutationsUpdateSettingArgs = {
  key: Scalars['String'];
  value: Scalars['String'];
};

export type AdminSetting = {
  __typename?: 'AdminSetting';
  key: Scalars['String'];
  value: Scalars['String'];
};

export type Alert = {
  __typename?: 'Alert';
  id: Scalars['UUID'];
  message: Scalars['String'];
  messageEn: Scalars['String'];
  severity: AlertColor;
};

export enum AlertColor {
  Error = 'error',
  Info = 'info',
  Success = 'success',
  Warning = 'warning'
}

export type AlertMutations = {
  __typename?: 'AlertMutations';
  create?: Maybe<Alert>;
  remove?: Maybe<Alert>;
};


export type AlertMutationsCreateArgs = {
  message: Scalars['String'];
  messageEn: Scalars['String'];
  severity: AlertColor;
};


export type AlertMutationsRemoveArgs = {
  id: Scalars['UUID'];
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
  createdDatetime: Scalars['Datetime'];
  handledBy?: Maybe<Member>;
  header: Scalars['String'];
  headerEn?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  imageUrl?: Maybe<Scalars['Url']>;
  isLikedByMe: Scalars['Boolean'];
  latestEditDatetime?: Maybe<Scalars['Datetime']>;
  likers: Array<Maybe<Member>>;
  likes: Scalars['Int'];
  publishedDatetime?: Maybe<Scalars['Datetime']>;
  slug?: Maybe<Scalars['String']>;
  status: ArticleRequestStatus;
  tags: Array<Tag>;
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

export type ArticleRequest = {
  __typename?: 'ArticleRequest';
  author: Author;
  body: Scalars['String'];
  bodyEn?: Maybe<Scalars['String']>;
  createdDatetime: Scalars['Datetime'];
  handledBy?: Maybe<Member>;
  header: Scalars['String'];
  headerEn?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  imageUrl?: Maybe<Scalars['Url']>;
  latestEditDatetime?: Maybe<Scalars['Datetime']>;
  publishedDatetime?: Maybe<Scalars['Datetime']>;
  rejectedDatetime?: Maybe<Scalars['Datetime']>;
  rejectionReason?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  status: ArticleRequestStatus;
  tags: Array<Tag>;
};

export type ArticleRequestPagination = {
  __typename?: 'ArticleRequestPagination';
  articles: Array<Maybe<ArticleRequest>>;
  pageInfo: PaginationInfo;
};

export enum ArticleRequestStatus {
  Approved = 'approved',
  Draft = 'draft',
  Rejected = 'rejected'
}

export type Author = Mandate | Member;

export type Bookable = {
  __typename?: 'Bookable';
  category?: Maybe<BookableCategory>;
  door?: Maybe<Door>;
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
  what: Array<Bookable>;
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
  acceptWithAccess?: InputMaybe<Scalars['Boolean']>;
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

export type Cart = {
  __typename?: 'Cart';
  cartItems: Array<Maybe<CartItem>>;
  expiresAt: Scalars['Date'];
  id: Scalars['UUID'];
  totalPrice: Scalars['Float'];
  totalQuantity: Scalars['Int'];
};

export type CartInventory = {
  __typename?: 'CartInventory';
  discount?: Maybe<Discount>;
  id: Scalars['UUID'];
  inventoryId: Scalars['UUID'];
  quantity: Scalars['Int'];
  variant?: Maybe<Scalars['String']>;
};

export type CartItem = {
  __typename?: 'CartItem';
  category?: Maybe<ProductCategory>;
  description: Scalars['String'];
  id: Scalars['UUID'];
  imageUrl: Scalars['String'];
  inventory: Array<Maybe<CartInventory>>;
  maxPerUser: Scalars['Int'];
  name: Scalars['String'];
  price: Scalars['Float'];
};

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
  name_en?: Maybe<Scalars['String']>;
  shortName: Scalars['String'];
};

export type CommitteeFilter = {
  id?: InputMaybe<Scalars['UUID']>;
  short_name?: InputMaybe<Scalars['String']>;
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
  notificationBody?: InputMaybe<Scalars['String']>;
  notificationBodyEn?: InputMaybe<Scalars['String']>;
  sendNotification?: InputMaybe<Scalars['Boolean']>;
  tagIds?: InputMaybe<Array<Scalars['UUID']>>;
};

export type CreateArticlePayload = {
  __typename?: 'CreateArticlePayload';
  article: Article;
  uploadUrl?: Maybe<Scalars['Url']>;
};

export type CreateBookable = {
  category_id?: InputMaybe<Scalars['UUID']>;
  door?: InputMaybe<Scalars['String']>;
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
  name_en: Scalars['String'];
  short_name: Scalars['String'];
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
  alarm_active?: InputMaybe<Scalars['Boolean']>;
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

export type CreateGoverningDocument = {
  title: Scalars['String'];
  type: GoverningDocumentType;
  url: Scalars['String'];
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

export type CreateSpecialReceiver = {
  alias: Scalars['String'];
  targetEmail: Scalars['String'];
};

export type CreateSpecialSender = {
  alias: Scalars['String'];
  keycloakId: Scalars['String'];
  studentId: Scalars['String'];
};

export type CreateTag = {
  color?: InputMaybe<Scalars['String']>;
  isDefault?: InputMaybe<Scalars['Boolean']>;
  name: Scalars['String'];
  nameEn?: InputMaybe<Scalars['String']>;
};

export type Discount = {
  __typename?: 'Discount';
  description: Scalars['String'];
  discountPercentage: Scalars['Float'];
  id: Scalars['UUID'];
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

export type EmailUser = {
  __typename?: 'EmailUser';
  email?: Maybe<Scalars['String']>;
  keycloakId?: Maybe<Scalars['String']>;
  studentId?: Maybe<Scalars['String']>;
};

export type Event = {
  __typename?: 'Event';
  alarm_active?: Maybe<Scalars['Boolean']>;
  author: Member;
  comments: Array<Maybe<Comment>>;
  description: Scalars['String'];
  description_en?: Maybe<Scalars['String']>;
  end_datetime: Scalars['Datetime'];
  iAmGoing: Scalars['Boolean'];
  iAmInterested: Scalars['Boolean'];
  id: Scalars['UUID'];
  link?: Maybe<Scalars['String']>;
  location?: Maybe<Scalars['String']>;
  number_of_updates: Scalars['Int'];
  organizer: Scalars['String'];
  peopleGoing: Array<Maybe<Member>>;
  peopleInterested: Array<Maybe<Member>>;
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
  comment?: Maybe<Event>;
  create?: Maybe<Event>;
  remove?: Maybe<Event>;
  removeComment?: Maybe<Event>;
  setGoing?: Maybe<Event>;
  setInterested?: Maybe<Event>;
  unsetGoing?: Maybe<Event>;
  unsetInterested?: Maybe<Event>;
  update?: Maybe<Event>;
};


export type EventMutationsCommentArgs = {
  content: Scalars['String'];
  id: Scalars['UUID'];
};


export type EventMutationsCreateArgs = {
  input: CreateEvent;
};


export type EventMutationsRemoveArgs = {
  id: Scalars['UUID'];
};


export type EventMutationsRemoveCommentArgs = {
  commentId: Scalars['UUID'];
};


export type EventMutationsSetGoingArgs = {
  id: Scalars['UUID'];
};


export type EventMutationsSetInterestedArgs = {
  id: Scalars['UUID'];
};


export type EventMutationsUnsetGoingArgs = {
  id: Scalars['UUID'];
};


export type EventMutationsUnsetInterestedArgs = {
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
  removeMyProfilePicture?: Maybe<Array<Maybe<FileData>>>;
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


export type FileMutationsRemoveMyProfilePictureArgs = {
  fileName: Scalars['String'];
};


export type FileMutationsRenameArgs = {
  bucket: Scalars['String'];
  fileName: Scalars['String'];
  newFileName: Scalars['String'];
};

export type GoverningDocument = {
  __typename?: 'GoverningDocument';
  id: Scalars['UUID'];
  title: Scalars['String'];
  type: GoverningDocumentType;
  url: Scalars['String'];
};

export type GoverningDocumentMutations = {
  __typename?: 'GoverningDocumentMutations';
  create?: Maybe<GoverningDocument>;
  delete?: Maybe<Scalars['Boolean']>;
  update?: Maybe<GoverningDocument>;
};


export type GoverningDocumentMutationsCreateArgs = {
  input: CreateGoverningDocument;
};


export type GoverningDocumentMutationsDeleteArgs = {
  id: Scalars['UUID'];
};


export type GoverningDocumentMutationsUpdateArgs = {
  input: UpdateGoverningDocument;
};

export enum GoverningDocumentType {
  Guideline = 'GUIDELINE',
  Policy = 'POLICY'
}

export type MailAlias = {
  __typename?: 'MailAlias';
  email: Scalars['String'];
  policies: Array<Maybe<MailAliasPolicy>>;
};

export type MailAliasMutations = {
  __typename?: 'MailAliasMutations';
  create?: Maybe<MailAlias>;
  remove?: Maybe<MailAlias>;
  updateSenderStatus?: Maybe<Scalars['Boolean']>;
};


export type MailAliasMutationsCreateArgs = {
  input: CreateMailAlias;
};


export type MailAliasMutationsRemoveArgs = {
  id: Scalars['UUID'];
};


export type MailAliasMutationsUpdateSenderStatusArgs = {
  input: Array<MailAliasStatus>;
};

export type MailAliasPolicy = {
  __typename?: 'MailAliasPolicy';
  canSend: Scalars['Boolean'];
  id: Scalars['UUID'];
  position: Position;
};

export type MailAliasStatus = {
  canSend: Scalars['Boolean'];
  id: Scalars['UUID'];
};

export type MailRecipient = {
  __typename?: 'MailRecipient';
  alias: Scalars['String'];
  emailUsers: Array<EmailUser>;
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
  canPing?: Maybe<Scalars['Boolean']>;
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
  ping?: Maybe<Scalars['Boolean']>;
  remove?: Maybe<Member>;
  update?: Maybe<Member>;
};


export type MemberMutationsCreateArgs = {
  input: CreateMember;
};


export type MemberMutationsPingArgs = {
  id: Scalars['UUID'];
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
  alert?: Maybe<AlertMutations>;
  alias?: Maybe<MailAliasMutations>;
  article?: Maybe<ArticleMutations>;
  bookable?: Maybe<BookableMutations>;
  bookingRequest?: Maybe<BookingRequestMutations>;
  committee?: Maybe<CommitteeMutations>;
  deleteNotification: Array<Notification>;
  deleteNotifications: Array<Notification>;
  event?: Maybe<EventMutations>;
  files?: Maybe<FileMutations>;
  governingDocument?: Maybe<GoverningDocumentMutations>;
  mandate?: Maybe<MandateMutations>;
  markAsRead: Array<Notification>;
  markdown?: Maybe<MarkdownMutations>;
  member?: Maybe<MemberMutations>;
  position?: Maybe<PositionMutations>;
  requests?: Maybe<RequestMutations>;
  specialReceiver?: Maybe<SpecialReceiverMutations>;
  specialSender?: Maybe<SpecialSenderMutations>;
  subscriptionSettings: SubscriptionSettingsMutations;
  tagSubscriptions: TagSubscriptionsMutations;
  tags?: Maybe<TagMutations>;
  token: TokenMutations;
  webshop?: Maybe<WebshopMutations>;
};


export type MutationDeleteNotificationArgs = {
  id: Scalars['UUID'];
};


export type MutationDeleteNotificationsArgs = {
  ids: Array<Scalars['UUID']>;
};


export type MutationMarkAsReadArgs = {
  ids: Array<Scalars['UUID']>;
};

export type Notification = {
  __typename?: 'Notification';
  createdAt: Scalars['Date'];
  id: Scalars['ID'];
  link: Scalars['String'];
  message: Scalars['String'];
  readAt?: Maybe<Scalars['Date']>;
  title: Scalars['String'];
  type: Scalars['String'];
  updatedAt: Scalars['Date'];
};

export type Order = {
  __typename?: 'Order';
  createdAt: Scalars['Date'];
  id: Scalars['UUID'];
  payment?: Maybe<Payment>;
  products?: Maybe<Array<Maybe<Product>>>;
  total: Scalars['Float'];
  updatedAt: Scalars['Date'];
  user: Member;
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

export type Payment = {
  __typename?: 'Payment';
  amount: Scalars['Float'];
  createdAt: Scalars['Date'];
  currency: Scalars['String'];
  id: Scalars['UUID'];
  paymentMethod: Scalars['String'];
  paymentStatus: Scalars['String'];
  updatedAt: Scalars['Date'];
};

export enum PaymentStatus {
  Cancelled = 'CANCELLED',
  Declined = 'DECLINED',
  Error = 'ERROR',
  Paid = 'PAID',
  Pending = 'PENDING'
}

export type Ping = {
  __typename?: 'Ping';
  counter: Scalars['Int'];
  from: Member;
  lastPing: Scalars['Date'];
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
  description?: Maybe<Scalars['String']>;
  descriptionEn?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  emailAliases?: Maybe<Array<Scalars['String']>>;
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  nameEn?: Maybe<Scalars['String']>;
};

export type PositionFilter = {
  active?: InputMaybe<Scalars['Boolean']>;
  committee_id?: InputMaybe<Scalars['UUID']>;
  committee_short_name?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  year?: InputMaybe<Scalars['Int']>;
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

export type Product = {
  __typename?: 'Product';
  category?: Maybe<ProductCategory>;
  description: Scalars['String'];
  id: Scalars['UUID'];
  imageUrl: Scalars['String'];
  inventory: Array<Maybe<ProductInventory>>;
  maxPerUser: Scalars['Int'];
  name: Scalars['String'];
  price: Scalars['Float'];
};

export type ProductCategory = {
  __typename?: 'ProductCategory';
  description: Scalars['String'];
  id: Scalars['UUID'];
  name: Scalars['String'];
};

export type ProductInput = {
  categoryId: Scalars['UUID'];
  description: Scalars['String'];
  discountId?: InputMaybe<Scalars['UUID']>;
  imageUrl: Scalars['String'];
  maxPerUser: Scalars['Int'];
  name: Scalars['String'];
  price: Scalars['Float'];
  quantity: Scalars['Int'];
  variants: Array<Scalars['String']>;
};

export type ProductInventory = {
  __typename?: 'ProductInventory';
  discount?: Maybe<Discount>;
  id: Scalars['UUID'];
  quantity: Scalars['Int'];
  variant?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  _entities: Array<Maybe<_Entity>>;
  _service: _Service;
  adminSettings: Array<AdminSetting>;
  alarmShouldBeActive: Scalars['Boolean'];
  alerts: Array<Alert>;
  alias?: Maybe<MailAlias>;
  aliases?: Maybe<Array<Maybe<MailAlias>>>;
  allEmails: Array<Scalars['String']>;
  api?: Maybe<Api>;
  /** returns all apis the signed in member has access to. */
  apiAccess?: Maybe<Array<Api>>;
  apis?: Maybe<Array<Api>>;
  article?: Maybe<Article>;
  articleRequest?: Maybe<ArticleRequest>;
  articleRequests: Array<Maybe<ArticleRequest>>;
  bookables?: Maybe<Array<Bookable>>;
  bookingRequest?: Maybe<BookingRequest>;
  bookingRequests?: Maybe<Array<BookingRequest>>;
  chest?: Maybe<UserInventory>;
  committees?: Maybe<CommitteePagination>;
  door?: Maybe<Door>;
  doors?: Maybe<Array<Door>>;
  event?: Maybe<Event>;
  events?: Maybe<EventPagination>;
  files?: Maybe<Array<FileData>>;
  getSubscriptionTypes: Array<SubscriptionType>;
  governingDocument?: Maybe<GoverningDocument>;
  governingDocuments: Array<GoverningDocument>;
  guidelines: Array<GoverningDocument>;
  mandatePagination?: Maybe<MandatePagination>;
  markdown?: Maybe<Markdown>;
  markdowns: Array<Maybe<Markdown>>;
  me?: Maybe<Member>;
  member?: Maybe<Member>;
  memberById?: Maybe<Member>;
  members?: Maybe<MemberPagination>;
  myCart?: Maybe<Cart>;
  myNotifications: Array<Notification>;
  mySubscriptionSettings: Array<SubscriptionSetting>;
  myTagSubscriptions: Array<Tag>;
  news?: Maybe<ArticlePagination>;
  payment?: Maybe<Payment>;
  pings: Array<Ping>;
  policies: Array<GoverningDocument>;
  positions?: Maybe<PositionPagination>;
  presignedPutUrl?: Maybe<Scalars['String']>;
  product?: Maybe<Product>;
  productCategories: Array<Maybe<ProductCategory>>;
  products: Array<Maybe<Product>>;
  rejectedRequests?: Maybe<ArticleRequestPagination>;
  resolveRecipients: Array<Maybe<MailRecipient>>;
  resolveSenders: Array<Maybe<MailRecipient>>;
  songById?: Maybe<Song>;
  songByTitle?: Maybe<Song>;
  songs?: Maybe<Array<Maybe<Song>>>;
  specialReceivers: Array<Maybe<SpecialReceiver>>;
  specialSenders: Array<Maybe<SpecialSender>>;
  tag?: Maybe<Tag>;
  tags: Array<Tag>;
  token?: Maybe<Token>;
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


export type QueryArticleRequestArgs = {
  id: Scalars['UUID'];
};


export type QueryArticleRequestsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
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


export type QueryChestArgs = {
  studentId: Scalars['String'];
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


export type QueryGoverningDocumentArgs = {
  id: Scalars['UUID'];
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
  tagIds?: InputMaybe<Array<Scalars['String']>>;
};


export type QueryPaymentArgs = {
  id: Scalars['UUID'];
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


export type QueryProductArgs = {
  id: Scalars['UUID'];
};


export type QueryProductsArgs = {
  categoryId?: InputMaybe<Scalars['UUID']>;
};


export type QueryRejectedRequestsArgs = {
  page?: Scalars['Int'];
  perPage?: Scalars['Int'];
};


export type QuerySongByIdArgs = {
  id: Scalars['UUID'];
};


export type QuerySongByTitleArgs = {
  title: Scalars['String'];
};


export type QuerySpecialReceiversArgs = {
  alias: Scalars['String'];
};


export type QuerySpecialSendersArgs = {
  alias: Scalars['String'];
};


export type QueryTagArgs = {
  id: Scalars['UUID'];
};


export type QueryTokenArgs = {
  expo_token: Scalars['String'];
};

export type RequestMutations = {
  __typename?: 'RequestMutations';
  approve?: Maybe<ArticleRequest>;
  reject?: Maybe<ArticleRequest>;
  undoRejection?: Maybe<ArticleRequest>;
};


export type RequestMutationsApproveArgs = {
  id: Scalars['UUID'];
};


export type RequestMutationsRejectArgs = {
  id: Scalars['UUID'];
  reason?: InputMaybe<Scalars['String']>;
};


export type RequestMutationsUndoRejectionArgs = {
  id: Scalars['UUID'];
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

export type SpecialReceiver = {
  __typename?: 'SpecialReceiver';
  id: Scalars['UUID'];
  targetEmail: Scalars['String'];
};

export type SpecialReceiverMutations = {
  __typename?: 'SpecialReceiverMutations';
  create?: Maybe<SpecialReceiver>;
  remove?: Maybe<SpecialReceiver>;
};


export type SpecialReceiverMutationsCreateArgs = {
  input: CreateSpecialReceiver;
};


export type SpecialReceiverMutationsRemoveArgs = {
  id: Scalars['UUID'];
};

export type SpecialSender = {
  __typename?: 'SpecialSender';
  id: Scalars['UUID'];
  keycloakId: Scalars['String'];
  studentId: Scalars['String'];
};

export type SpecialSenderMutations = {
  __typename?: 'SpecialSenderMutations';
  create?: Maybe<SpecialSender>;
  remove?: Maybe<SpecialSender>;
};


export type SpecialSenderMutationsCreateArgs = {
  input: CreateSpecialSender;
};


export type SpecialSenderMutationsRemoveArgs = {
  id: Scalars['UUID'];
};

export type SubscriptionSetting = {
  __typename?: 'SubscriptionSetting';
  id: Scalars['UUID'];
  pushNotification: Scalars['Boolean'];
  type: SubscriptionType;
};

export type SubscriptionSettingsMutations = {
  __typename?: 'SubscriptionSettingsMutations';
  update?: Maybe<SubscriptionSetting>;
};


export type SubscriptionSettingsMutationsUpdateArgs = {
  enabled: Scalars['Boolean'];
  pushNotification?: InputMaybe<Scalars['Boolean']>;
  type: Scalars['String'];
};

export type SubscriptionType = {
  __typename?: 'SubscriptionType';
  description: Scalars['String'];
  descriptionEn?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  titleEn?: Maybe<Scalars['String']>;
  type: Scalars['String'];
};

export type Tag = {
  __typename?: 'Tag';
  color?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  isDefault: Scalars['Boolean'];
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

export type TagSubscriptionsMutations = {
  __typename?: 'TagSubscriptionsMutations';
  subscribe?: Maybe<Array<Scalars['UUID']>>;
  unsubscribe?: Maybe<Scalars['Int']>;
};


export type TagSubscriptionsMutationsSubscribeArgs = {
  tagIds: Array<Scalars['UUID']>;
};


export type TagSubscriptionsMutationsUnsubscribeArgs = {
  tagIds: Array<Scalars['UUID']>;
};

export type Token = {
  __typename?: 'Token';
  expo_token: Scalars['String'];
  id: Scalars['UUID'];
  memberId?: Maybe<Scalars['UUID']>;
};

export type TokenMutations = {
  __typename?: 'TokenMutations';
  register?: Maybe<Token>;
};


export type TokenMutationsRegisterArgs = {
  expo_token: Scalars['String'];
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
  category_id?: InputMaybe<Scalars['UUID']>;
  door?: InputMaybe<Scalars['String']>;
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
  alarm_active?: InputMaybe<Scalars['Boolean']>;
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

export type UpdateGoverningDocument = {
  id: Scalars['UUID'];
  title?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<GoverningDocumentType>;
  url?: InputMaybe<Scalars['String']>;
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
  description?: InputMaybe<Scalars['String']>;
  descriptionEn?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  nameEn?: InputMaybe<Scalars['String']>;
};

export type UpdateTag = {
  color?: InputMaybe<Scalars['String']>;
  isDefault?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  nameEn?: InputMaybe<Scalars['String']>;
};

export type UploadData = {
  __typename?: 'UploadData';
  fileUrl: Scalars['String'];
  uploadUrl: Scalars['String'];
};

export type UserInventory = {
  __typename?: 'UserInventory';
  id: Scalars['UUID'];
  items: Array<Maybe<UserInventoryItem>>;
};

export type UserInventoryItem = {
  __typename?: 'UserInventoryItem';
  category?: Maybe<ProductCategory>;
  consumedAt?: Maybe<Scalars['Date']>;
  description: Scalars['String'];
  id: Scalars['UUID'];
  imageUrl: Scalars['String'];
  name: Scalars['String'];
  paidAt: Scalars['Date'];
  paidPrice: Scalars['Float'];
  variant?: Maybe<Scalars['String']>;
};

export type WebshopMutations = {
  __typename?: 'WebshopMutations';
  addToMyCart?: Maybe<Cart>;
  consumeItem?: Maybe<UserInventory>;
  createProduct?: Maybe<Product>;
  freeCheckout?: Maybe<Payment>;
  initiatePayment?: Maybe<Payment>;
  removeFromMyCart?: Maybe<Cart>;
  removeMyCart?: Maybe<Scalars['Boolean']>;
  updatePaymentStatus?: Maybe<Payment>;
};


export type WebshopMutationsAddToMyCartArgs = {
  inventoryId: Scalars['UUID'];
  quantity: Scalars['Int'];
};


export type WebshopMutationsConsumeItemArgs = {
  itemId: Scalars['UUID'];
};


export type WebshopMutationsCreateProductArgs = {
  input: ProductInput;
};


export type WebshopMutationsInitiatePaymentArgs = {
  phoneNumber: Scalars['String'];
};


export type WebshopMutationsRemoveFromMyCartArgs = {
  inventoryId: Scalars['UUID'];
  quantity: Scalars['Int'];
};


export type WebshopMutationsUpdatePaymentStatusArgs = {
  paymentId: Scalars['String'];
  status: PaymentStatus;
};

export type _Entity = AccessPolicy | AdminSetting | Alert | Api | Article | ArticleRequest | Bookable | BookableCategory | BookingRequest | Committee | Door | Event | FastMandate | FileData | MailAlias | MailAliasPolicy | Mandate | Markdown | Member | Ping | Position | Tag | Token;

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

export type ApiAccessQueryVariables = Exact<{ [key: string]: never; }>;


export type ApiAccessQuery = { __typename?: 'Query', apiAccess?: Array<{ __typename?: 'Api', name: string }> | null };

export type GetApisQueryVariables = Exact<{ [key: string]: never; }>;


export type GetApisQuery = { __typename?: 'Query', apis?: Array<{ __typename?: 'Api', name: string }> | null };

export type GetApiQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type GetApiQuery = { __typename?: 'Query', api?: { __typename?: 'Api', name: string, accessPolicies?: Array<{ __typename?: 'AccessPolicy', accessor: string, end_datetime?: any | null, id: any, start_datetime?: any | null }> | null } | null };

export type CreateApiAccessPolicyMutationVariables = Exact<{
  apiName: Scalars['String'];
  who: Scalars['String'];
}>;


export type CreateApiAccessPolicyMutation = { __typename?: 'Mutation', access?: { __typename?: 'AccessMutations', policy?: { __typename?: 'PolicyMutations', createApiAccessPolicy?: { __typename?: 'AccessPolicy', id: any } | null } | null } | null };

export type RemoveAccessPolicyMutationVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type RemoveAccessPolicyMutation = { __typename?: 'Mutation', access?: { __typename?: 'AccessMutations', policy?: { __typename?: 'PolicyMutations', remove?: { __typename?: 'AccessPolicy', id: any } | null } | null } | null };

export type UpdateSearchIndexMutationVariables = Exact<{ [key: string]: never; }>;


export type UpdateSearchIndexMutation = { __typename?: 'Mutation', admin?: { __typename?: 'AdminMutations', updateSearchIndex?: boolean | null } | null };

export type SyncMandatesWithKeycloakMutationVariables = Exact<{ [key: string]: never; }>;


export type SyncMandatesWithKeycloakMutation = { __typename?: 'Mutation', admin?: { __typename?: 'AdminMutations', syncMandatesWithKeycloak?: boolean | null } | null };

export type SeedDatabaseMutationVariables = Exact<{ [key: string]: never; }>;


export type SeedDatabaseMutation = { __typename?: 'Mutation', admin?: { __typename?: 'AdminMutations', seed?: boolean | null } | null };

export type GetAdminSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAdminSettingsQuery = { __typename?: 'Query', adminSettings: Array<{ __typename?: 'AdminSetting', key: string, value: string }> };

export type CreateAdminSettingMutationVariables = Exact<{
  key: Scalars['String'];
  value: Scalars['String'];
}>;


export type CreateAdminSettingMutation = { __typename?: 'Mutation', admin?: { __typename?: 'AdminMutations', createSetting?: { __typename?: 'AdminSetting', key: string, value: string } | null } | null };

export type UpdateAdminSettingMutationVariables = Exact<{
  key: Scalars['String'];
  value: Scalars['String'];
}>;


export type UpdateAdminSettingMutation = { __typename?: 'Mutation', admin?: { __typename?: 'AdminMutations', updateSetting?: { __typename?: 'AdminSetting', key: string, value: string } | null } | null };

export type DeleteAdminSettingMutationVariables = Exact<{
  key: Scalars['String'];
}>;


export type DeleteAdminSettingMutation = { __typename?: 'Mutation', admin?: { __typename?: 'AdminMutations', deleteSetting?: { __typename?: 'AdminSetting', key: string, value: string } | null } | null };

export type SetStabHiddenPeriodMutationVariables = Exact<{
  start: Scalars['Date'];
  end: Scalars['Date'];
}>;


export type SetStabHiddenPeriodMutation = { __typename?: 'Mutation', admin?: { __typename?: 'AdminMutations', setStabHiddenPeriod?: Array<{ __typename?: 'AdminSetting', key: string, value: string } | null> | null } | null };

export type AlertsQueryVariables = Exact<{ [key: string]: never; }>;


export type AlertsQuery = { __typename?: 'Query', alerts: Array<{ __typename?: 'Alert', id: any, message: string, messageEn: string, severity: AlertColor }> };

export type CreateAlertMutationVariables = Exact<{
  message: Scalars['String'];
  messageEn: Scalars['String'];
  severity: AlertColor;
}>;


export type CreateAlertMutation = { __typename?: 'Mutation', alert?: { __typename?: 'AlertMutations', create?: { __typename?: 'Alert', id: any, message: string, messageEn: string, severity: AlertColor } | null } | null };

export type RemoveAlertMutationVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type RemoveAlertMutation = { __typename?: 'Mutation', alert?: { __typename?: 'AlertMutations', remove?: { __typename?: 'Alert', id: any, message: string, messageEn: string, severity: AlertColor } | null } | null };

export type GetBookablesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBookablesQuery = { __typename?: 'Query', bookables?: Array<{ __typename?: 'Bookable', id: any, name: string, name_en: string, door?: { __typename?: 'Door', id?: string | null, name: string } | null }> | null };

export type GetAllBookablesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllBookablesQuery = { __typename?: 'Query', bookables?: Array<{ __typename?: 'Bookable', id: any, name: string, name_en: string, isDisabled: boolean, door?: { __typename?: 'Door', id?: string | null, name: string } | null }> | null };

export type GetBookingsQueryVariables = Exact<{
  from?: InputMaybe<Scalars['Datetime']>;
  to?: InputMaybe<Scalars['Datetime']>;
  status?: InputMaybe<BookingStatus>;
}>;


export type GetBookingsQuery = { __typename?: 'Query', bookingRequests?: Array<{ __typename?: 'BookingRequest', id: any, start: any, end: any, event: string, status: BookingStatus, created: any, last_modified?: any | null, booker: { __typename?: 'Member', id: any, student_id?: string | null, first_name?: string | null, nickname?: string | null, last_name?: string | null }, what: Array<{ __typename?: 'Bookable', id: any, name: string, name_en: string }> }> | null };

export type CreateBookingRequestMutationVariables = Exact<{
  bookerId: Scalars['UUID'];
  start: Scalars['Datetime'];
  end: Scalars['Datetime'];
  what: Array<Scalars['String']> | Scalars['String'];
  event: Scalars['String'];
}>;


export type CreateBookingRequestMutation = { __typename?: 'Mutation', bookingRequest?: { __typename?: 'BookingRequestMutations', create?: { __typename?: 'BookingRequest', start: any, end: any, event: string, what: Array<{ __typename?: 'Bookable', id: any, name: string, name_en: string, isDisabled: boolean }> } | null } | null };

export type AcceptBookingRequestMutationVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type AcceptBookingRequestMutation = { __typename?: 'Mutation', bookingRequest?: { __typename?: 'BookingRequestMutations', accept?: boolean | null } | null };

export type DenyBookingRequestMutationVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type DenyBookingRequestMutation = { __typename?: 'Mutation', bookingRequest?: { __typename?: 'BookingRequestMutations', deny?: boolean | null } | null };

export type RemoveBookingRequestMutationVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type RemoveBookingRequestMutation = { __typename?: 'Mutation', bookingRequest?: { __typename?: 'BookingRequestMutations', remove?: { __typename?: 'BookingRequest', id: any } | null } | null };

export type CreateBookableMutationVariables = Exact<{
  input: CreateBookable;
}>;


export type CreateBookableMutation = { __typename?: 'Mutation', bookable?: { __typename?: 'BookableMutations', create?: { __typename?: 'Bookable', id: any, name: string, name_en: string, isDisabled: boolean } | null } | null };

export type EditBookableMutationVariables = Exact<{
  id: Scalars['UUID'];
  input: UpdateBookable;
}>;


export type EditBookableMutation = { __typename?: 'Mutation', bookable?: { __typename?: 'BookableMutations', update?: { __typename?: 'Bookable', id: any, name: string, name_en: string, isDisabled: boolean } | null } | null };

export type MyCartQueryVariables = Exact<{ [key: string]: never; }>;


export type MyCartQuery = { __typename?: 'Query', myCart?: { __typename?: 'Cart', id: any, totalPrice: number, totalQuantity: number, expiresAt: any, cartItems: Array<{ __typename?: 'CartItem', id: any, name: string, description: string, price: number, maxPerUser: number, imageUrl: string, inventory: Array<{ __typename?: 'CartInventory', id: any, inventoryId: any, variant?: string | null, quantity: number } | null>, category?: { __typename?: 'ProductCategory', id: any, name: string, description: string } | null } | null> } | null };

export type AddToMyCartMutationVariables = Exact<{
  inventoryId: Scalars['UUID'];
  quantity: Scalars['Int'];
}>;


export type AddToMyCartMutation = { __typename?: 'Mutation', webshop?: { __typename?: 'WebshopMutations', addToMyCart?: { __typename?: 'Cart', id: any, totalPrice: number, totalQuantity: number, expiresAt: any, cartItems: Array<{ __typename?: 'CartItem', id: any, name: string, description: string, price: number, maxPerUser: number, imageUrl: string, inventory: Array<{ __typename?: 'CartInventory', id: any, inventoryId: any, variant?: string | null, quantity: number } | null>, category?: { __typename?: 'ProductCategory', id: any, name: string, description: string } | null } | null> } | null } | null };

export type RemoveFromMyCartMutationVariables = Exact<{
  inventoryId: Scalars['UUID'];
  quantity: Scalars['Int'];
}>;


export type RemoveFromMyCartMutation = { __typename?: 'Mutation', webshop?: { __typename?: 'WebshopMutations', removeFromMyCart?: { __typename?: 'Cart', id: any, totalPrice: number, totalQuantity: number, expiresAt: any, cartItems: Array<{ __typename?: 'CartItem', id: any, name: string, description: string, price: number, maxPerUser: number, imageUrl: string, inventory: Array<{ __typename?: 'CartInventory', id: any, inventoryId: any, variant?: string | null, quantity: number } | null>, category?: { __typename?: 'ProductCategory', id: any, name: string, description: string } | null } | null> } | null } | null };

export type RemoveMyCartMutationVariables = Exact<{ [key: string]: never; }>;


export type RemoveMyCartMutation = { __typename?: 'Mutation', webshop?: { __typename?: 'WebshopMutations', removeMyCart?: boolean | null } | null };

export type MyChestQueryVariables = Exact<{
  studentId: Scalars['String'];
}>;


export type MyChestQuery = { __typename?: 'Query', chest?: { __typename?: 'UserInventory', id: any, items: Array<{ __typename?: 'UserInventoryItem', id: any, name: string, description: string, paidPrice: number, imageUrl: string, variant?: string | null, paidAt: any, consumedAt?: any | null, category?: { __typename?: 'ProductCategory', id: any, name: string, description: string } | null } | null> } | null };

export type ConsumeItemMutationVariables = Exact<{
  itemId: Scalars['UUID'];
}>;


export type ConsumeItemMutation = { __typename?: 'Mutation', webshop?: { __typename?: 'WebshopMutations', consumeItem?: { __typename?: 'UserInventory', id: any, items: Array<{ __typename?: 'UserInventoryItem', id: any, name: string, description: string, paidPrice: number, imageUrl: string, variant?: string | null, paidAt: any, consumedAt?: any | null, category?: { __typename?: 'ProductCategory', id: any, name: string, description: string } | null } | null> } | null } | null };

export type GetCommitteesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCommitteesQuery = { __typename?: 'Query', committees?: { __typename?: 'CommitteePagination', committees: Array<{ __typename?: 'Committee', id: any, name?: string | null, name_en?: string | null, shortName: string } | null> } | null };

export type GetDoorsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDoorsQuery = { __typename?: 'Query', doors?: Array<{ __typename?: 'Door', name: string }> | null };

export type GetDoorQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type GetDoorQuery = { __typename?: 'Query', door?: { __typename?: 'Door', id?: string | null, name: string, accessPolicies?: Array<{ __typename?: 'AccessPolicy', accessor: string, end_datetime?: any | null, id: any, start_datetime?: any | null }> | null } | null };

export type CreateDoorAccessPolicyMutationVariables = Exact<{
  doorName: Scalars['String'];
  who: Scalars['String'];
  startDatetime?: InputMaybe<Scalars['Date']>;
  endDatetime?: InputMaybe<Scalars['Date']>;
}>;


export type CreateDoorAccessPolicyMutation = { __typename?: 'Mutation', access?: { __typename?: 'AccessMutations', policy?: { __typename?: 'PolicyMutations', createDoorAccessPolicy?: { __typename?: 'AccessPolicy', id: any } | null } | null } | null };

export type CreateDoorMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type CreateDoorMutation = { __typename?: 'Mutation', access?: { __typename?: 'AccessMutations', door?: { __typename?: 'DoorMutations', create?: { __typename?: 'Door', name: string } | null } | null } | null };

export type RemoveDoorMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type RemoveDoorMutation = { __typename?: 'Mutation', access?: { __typename?: 'AccessMutations', door?: { __typename?: 'DoorMutations', remove?: { __typename?: 'Door', name: string } | null } | null } | null };

export type GetPermanentDoorMembersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPermanentDoorMembersQuery = { __typename?: 'Query', mandatePagination?: { __typename?: 'MandatePagination', mandates: Array<{ __typename?: 'FastMandate', member?: { __typename?: 'Member', student_id?: string | null } | null } | null> } | null };

export type DoorAccessQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type DoorAccessQuery = { __typename?: 'Query', door?: { __typename?: 'Door', studentIds?: Array<string> | null } | null };

export type AlarmShouldBeActiveQueryVariables = Exact<{ [key: string]: never; }>;


export type AlarmShouldBeActiveQuery = { __typename?: 'Query', alarmShouldBeActive: boolean };

export type EventsQueryVariables = Exact<{
  start_datetime?: InputMaybe<Scalars['Datetime']>;
  end_datetime?: InputMaybe<Scalars['Datetime']>;
  id?: InputMaybe<Scalars['UUID']>;
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
}>;


export type EventsQuery = { __typename?: 'Query', events?: { __typename?: 'EventPagination', pageInfo?: { __typename?: 'PaginationInfo', totalPages: number } | null, events: Array<{ __typename?: 'Event', title: string, id: any, slug?: string | null, short_description: string, description: string, start_datetime: any, end_datetime: any, link?: string | null, location?: string | null, organizer: string, title_en?: string | null, description_en?: string | null, short_description_en?: string | null, iAmInterested: boolean, iAmGoing: boolean, peopleGoing: Array<{ __typename?: 'Member', id: any, student_id?: string | null, first_name?: string | null, last_name?: string | null, nickname?: string | null, picture_path?: string | null } | null>, peopleInterested: Array<{ __typename?: 'Member', id: any, student_id?: string | null, first_name?: string | null, last_name?: string | null, nickname?: string | null, picture_path?: string | null } | null>, author: { __typename?: 'Member', id: any } } | null> } | null };

export type EventQueryVariables = Exact<{
  id?: InputMaybe<Scalars['UUID']>;
  slug?: InputMaybe<Scalars['String']>;
}>;


export type EventQuery = { __typename?: 'Query', event?: { __typename?: 'Event', title: string, id: any, alarm_active?: boolean | null, slug?: string | null, short_description: string, description: string, start_datetime: any, end_datetime: any, link?: string | null, location?: string | null, organizer: string, title_en?: string | null, description_en?: string | null, short_description_en?: string | null, iAmInterested: boolean, iAmGoing: boolean, peopleGoing: Array<{ __typename?: 'Member', id: any, student_id?: string | null, first_name?: string | null, last_name?: string | null, nickname?: string | null, picture_path?: string | null } | null>, peopleInterested: Array<{ __typename?: 'Member', id: any, student_id?: string | null, first_name?: string | null, last_name?: string | null, nickname?: string | null, picture_path?: string | null } | null>, comments: Array<{ __typename?: 'Comment', id: any, published: any, content: string, member: { __typename?: 'Member', id: any, student_id?: string | null, first_name?: string | null, last_name?: string | null, nickname?: string | null, picture_path?: string | null } } | null>, author: { __typename?: 'Member', id: any } } | null };

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
  alarm_active?: InputMaybe<Scalars['Boolean']>;
}>;


export type UpdateEventMutation = { __typename?: 'Mutation', event?: { __typename?: 'EventMutations', update?: { __typename?: 'Event', title: string, id: any, short_description: string, description: string, start_datetime: any, end_datetime: any, link?: string | null, location?: string | null, organizer: string, title_en?: string | null, description_en?: string | null, short_description_en?: string | null, author: { __typename?: 'Member', id: any } } | null } | null };

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
  alarm_active: Scalars['Boolean'];
}>;


export type CreateEventMutation = { __typename?: 'Mutation', event?: { __typename?: 'EventMutations', create?: { __typename?: 'Event', title: string, id: any, short_description: string, description: string, start_datetime: any, end_datetime: any, link?: string | null, location?: string | null, organizer: string, title_en?: string | null, description_en?: string | null, short_description_en?: string | null } | null } | null };

export type RemoveEventMutationVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type RemoveEventMutation = { __typename?: 'Mutation', event?: { __typename?: 'EventMutations', remove?: { __typename?: 'Event', id: any } | null } | null };

export type SetGoingToEventMutationVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type SetGoingToEventMutation = { __typename?: 'Mutation', event?: { __typename?: 'EventMutations', setGoing?: { __typename?: 'Event', id: any } | null } | null };

export type UnsetGoingToEventMutationVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type UnsetGoingToEventMutation = { __typename?: 'Mutation', event?: { __typename?: 'EventMutations', unsetGoing?: { __typename?: 'Event', id: any } | null } | null };

export type SetInterestedInEventMutationVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type SetInterestedInEventMutation = { __typename?: 'Mutation', event?: { __typename?: 'EventMutations', setInterested?: { __typename?: 'Event', id: any } | null } | null };

export type UnsetInterestedInEventMutationVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type UnsetInterestedInEventMutation = { __typename?: 'Mutation', event?: { __typename?: 'EventMutations', unsetInterested?: { __typename?: 'Event', id: any } | null } | null };

export type CommentEventMutationVariables = Exact<{
  id: Scalars['UUID'];
  content: Scalars['String'];
}>;


export type CommentEventMutation = { __typename?: 'Mutation', event?: { __typename?: 'EventMutations', comment?: { __typename?: 'Event', id: any, comments: Array<{ __typename?: 'Comment', id: any, content: string, published: any, member: { __typename?: 'Member', id: any, student_id?: string | null, first_name?: string | null, last_name?: string | null, nickname?: string | null, picture_path?: string | null } } | null> } | null } | null };

export type RemoveCommentFromEventMutationVariables = Exact<{
  commentId: Scalars['UUID'];
}>;


export type RemoveCommentFromEventMutation = { __typename?: 'Mutation', event?: { __typename?: 'EventMutations', removeComment?: { __typename?: 'Event', id: any, comments: Array<{ __typename?: 'Comment', id: any, content: string, published: any, member: { __typename?: 'Member', id: any, student_id?: string | null, first_name?: string | null, last_name?: string | null, nickname?: string | null, picture_path?: string | null } } | null> } | null } | null };

export type FilesQueryVariables = Exact<{
  bucket: Scalars['String'];
  prefix: Scalars['String'];
  recursive?: InputMaybe<Scalars['Boolean']>;
}>;


export type FilesQuery = { __typename?: 'Query', files?: Array<{ __typename?: 'FileData', id: string, name: string, size?: number | null, isDir?: boolean | null, modDate?: any | null, thumbnailUrl?: string | null }> | null };

export type PresignedPutUrlQueryVariables = Exact<{
  bucket: Scalars['String'];
  fileName: Scalars['String'];
}>;


export type PresignedPutUrlQuery = { __typename?: 'Query', presignedPutUrl?: string | null };

export type RemoveObjectsMutationVariables = Exact<{
  bucket: Scalars['String'];
  fileNames: Array<Scalars['String']> | Scalars['String'];
}>;


export type RemoveObjectsMutation = { __typename?: 'Mutation', files?: { __typename?: 'FileMutations', remove?: Array<{ __typename?: 'FileData', id: string, name: string } | null> | null } | null };

export type RemoveMyProfilePictureMutationVariables = Exact<{
  fileName: Scalars['String'];
}>;


export type RemoveMyProfilePictureMutation = { __typename?: 'Mutation', files?: { __typename?: 'FileMutations', removeMyProfilePicture?: Array<{ __typename?: 'FileData', id: string, name: string } | null> | null } | null };

export type MoveObjectsMutationVariables = Exact<{
  bucket: Scalars['String'];
  fileNames: Array<Scalars['String']> | Scalars['String'];
  destination: Scalars['String'];
}>;


export type MoveObjectsMutation = { __typename?: 'Mutation', files?: { __typename?: 'FileMutations', move?: Array<{ __typename?: 'fileChange', file: { __typename?: 'FileData', id: string, name: string, size?: number | null, isDir?: boolean | null, thumbnailUrl?: string | null }, oldFile?: { __typename?: 'FileData', id: string, name: string, size?: number | null, isDir?: boolean | null, thumbnailUrl?: string | null } | null } | null> | null } | null };

export type RenameObjectMutationVariables = Exact<{
  bucket: Scalars['String'];
  fileName: Scalars['String'];
  newFileName: Scalars['String'];
}>;


export type RenameObjectMutation = { __typename?: 'Mutation', files?: { __typename?: 'FileMutations', rename?: { __typename?: 'fileChange', file: { __typename?: 'FileData', id: string, name: string, size?: number | null, isDir?: boolean | null, thumbnailUrl?: string | null } } | null } | null };

export type GetGoverningDocumentQueryVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type GetGoverningDocumentQuery = { __typename?: 'Query', governingDocument?: { __typename?: 'GoverningDocument', id: any, title: string, url: string, type: GoverningDocumentType } | null };

export type GetGoverningDocumentsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGoverningDocumentsQuery = { __typename?: 'Query', governingDocuments: Array<{ __typename?: 'GoverningDocument', id: any, title: string, url: string, type: GoverningDocumentType }> };

export type GetPoliciesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPoliciesQuery = { __typename?: 'Query', policies: Array<{ __typename?: 'GoverningDocument', id: any, title: string, url: string, type: GoverningDocumentType }> };

export type GetGuidelinesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGuidelinesQuery = { __typename?: 'Query', guidelines: Array<{ __typename?: 'GoverningDocument', id: any, title: string, url: string, type: GoverningDocumentType }> };

export type CreateGoverningDocumentMutationVariables = Exact<{
  title: Scalars['String'];
  url: Scalars['String'];
  type: GoverningDocumentType;
}>;


export type CreateGoverningDocumentMutation = { __typename?: 'Mutation', governingDocument?: { __typename?: 'GoverningDocumentMutations', create?: { __typename?: 'GoverningDocument', title: string, url: string, type: GoverningDocumentType } | null } | null };

export type UpdateGoverningDocumentMutationVariables = Exact<{
  input: UpdateGoverningDocument;
}>;


export type UpdateGoverningDocumentMutation = { __typename?: 'Mutation', governingDocument?: { __typename?: 'GoverningDocumentMutations', update?: { __typename?: 'GoverningDocument', id: any, title: string, url: string, type: GoverningDocumentType } | null } | null };

export type DeleteGoverningDocumentMutationVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type DeleteGoverningDocumentMutation = { __typename?: 'Mutation', governingDocument?: { __typename?: 'GoverningDocumentMutations', delete?: boolean | null } | null };

export type GetMailAliasesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMailAliasesQuery = { __typename?: 'Query', aliases?: Array<{ __typename?: 'MailAlias', email: string, policies: Array<{ __typename?: 'MailAliasPolicy', id: any, canSend: boolean, position: { __typename?: 'Position', id: string, name?: string | null } } | null> } | null> | null };

export type GetMailAliasQueryVariables = Exact<{
  email: Scalars['String'];
}>;


export type GetMailAliasQuery = { __typename?: 'Query', alias?: { __typename?: 'MailAlias', email: string, policies: Array<{ __typename?: 'MailAliasPolicy', id: any, canSend: boolean, position: { __typename?: 'Position', id: string, name?: string | null } } | null> } | null };

export type RemoveMailAliasMutationVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type RemoveMailAliasMutation = { __typename?: 'Mutation', alias?: { __typename?: 'MailAliasMutations', remove?: { __typename?: 'MailAlias', email: string } | null } | null };

export type CreateMailAliasMutationVariables = Exact<{
  email: Scalars['String'];
  position_id: Scalars['String'];
}>;


export type CreateMailAliasMutation = { __typename?: 'Mutation', alias?: { __typename?: 'MailAliasMutations', create?: { __typename?: 'MailAlias', email: string } | null } | null };

export type UpdateSenderStatusMutationVariables = Exact<{
  input: Array<MailAliasStatus> | MailAliasStatus;
}>;


export type UpdateSenderStatusMutation = { __typename?: 'Mutation', alias?: { __typename?: 'MailAliasMutations', updateSenderStatus?: boolean | null } | null };

export type ResolveRecipientsEmailQueryVariables = Exact<{ [key: string]: never; }>;


export type ResolveRecipientsEmailQuery = { __typename?: 'Query', resolveRecipients: Array<{ __typename?: 'MailRecipient', alias: string, emailUsers: Array<{ __typename?: 'EmailUser', email?: string | null }> } | null> };

export type ResolveSendersStudentIdQueryVariables = Exact<{ [key: string]: never; }>;


export type ResolveSendersStudentIdQuery = { __typename?: 'Query', resolveSenders: Array<{ __typename?: 'MailRecipient', alias: string, emailUsers: Array<{ __typename?: 'EmailUser', studentId?: string | null }> } | null> };

export type SpecialSendersQueryVariables = Exact<{
  alias: Scalars['String'];
}>;


export type SpecialSendersQuery = { __typename?: 'Query', specialSenders: Array<{ __typename?: 'SpecialSender', id: any, studentId: string, keycloakId: string } | null> };

export type CreateSpecialSenderMutationVariables = Exact<{
  input: CreateSpecialSender;
}>;


export type CreateSpecialSenderMutation = { __typename?: 'Mutation', specialSender?: { __typename?: 'SpecialSenderMutations', create?: { __typename?: 'SpecialSender', id: any, studentId: string, keycloakId: string } | null } | null };

export type RemoveSpecialSenderMutationVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type RemoveSpecialSenderMutation = { __typename?: 'Mutation', specialSender?: { __typename?: 'SpecialSenderMutations', remove?: { __typename?: 'SpecialSender', id: any } | null } | null };

export type SpecialReceiversQueryVariables = Exact<{
  alias: Scalars['String'];
}>;


export type SpecialReceiversQuery = { __typename?: 'Query', specialReceivers: Array<{ __typename?: 'SpecialReceiver', id: any, targetEmail: string } | null> };

export type CreateSpecialReceiverMutationVariables = Exact<{
  input: CreateSpecialReceiver;
}>;


export type CreateSpecialReceiverMutation = { __typename?: 'Mutation', specialReceiver?: { __typename?: 'SpecialReceiverMutations', create?: { __typename?: 'SpecialReceiver', id: any, targetEmail: string } | null } | null };

export type RemoveSpecialReceiverMutationVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type RemoveSpecialReceiverMutation = { __typename?: 'Mutation', specialReceiver?: { __typename?: 'SpecialReceiverMutations', remove?: { __typename?: 'SpecialReceiver', id: any } | null } | null };

export type AllEmailsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllEmailsQuery = { __typename?: 'Query', allEmails: Array<string> };

export type GetMandatesByPeriodQueryVariables = Exact<{
  page: Scalars['Int'];
  perPage: Scalars['Int'];
  start_date?: InputMaybe<Scalars['Date']>;
  end_date?: InputMaybe<Scalars['Date']>;
}>;


export type GetMandatesByPeriodQuery = { __typename?: 'Query', mandatePagination?: { __typename?: 'MandatePagination', mandates: Array<{ __typename?: 'FastMandate', id: any, start_date: any, end_date: any, position?: { __typename?: 'Position', name?: string | null, nameEn?: string | null, id: string } | null, member?: { __typename?: 'Member', id: any, student_id?: string | null, first_name?: string | null, last_name?: string | null } | null } | null>, pageInfo: { __typename?: 'PaginationInfo', totalPages: number } } | null };

export type CreateMandateMutationVariables = Exact<{
  memberId: Scalars['UUID'];
  positionId: Scalars['String'];
  startDate: Scalars['Date'];
  endDate: Scalars['Date'];
}>;


export type CreateMandateMutation = { __typename?: 'Mutation', mandate?: { __typename?: 'MandateMutations', create?: { __typename?: 'Mandate', id: any } | null } | null };

export type RemoveMandateMutationVariables = Exact<{
  mandateId: Scalars['UUID'];
}>;


export type RemoveMandateMutation = { __typename?: 'Mutation', mandate?: { __typename?: 'MandateMutations', remove?: { __typename?: 'Mandate', id: any } | null } | null };

export type GetMarkdownsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMarkdownsQuery = { __typename?: 'Query', markdowns: Array<{ __typename?: 'Markdown', name: string } | null> };

export type GetMarkdownQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type GetMarkdownQuery = { __typename?: 'Query', markdown?: { __typename?: 'Markdown', name: string, markdown: string, markdown_en?: string | null } | null };

export type UpdateMarkdownMutationVariables = Exact<{
  name: Scalars['String'];
  markdown: Scalars['String'];
  markdown_en?: InputMaybe<Scalars['String']>;
}>;


export type UpdateMarkdownMutation = { __typename?: 'Mutation', markdown?: { __typename?: 'MarkdownMutations', update?: { __typename?: 'Markdown', name: string, markdown: string, markdown_en?: string | null } | null } | null };

export type CreateMarkdownMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type CreateMarkdownMutation = { __typename?: 'Mutation', markdown?: { __typename?: 'MarkdownMutations', create?: { __typename?: 'Markdown', name: string } | null } | null };

export type MeHeaderQueryVariables = Exact<{ [key: string]: never; }>;


export type MeHeaderQuery = { __typename?: 'Query', me?: { __typename?: 'Member', id: any, student_id?: string | null, first_name?: string | null, nickname?: string | null, last_name?: string | null, picture_path?: string | null, mandates?: Array<{ __typename?: 'Mandate', id: any, position?: { __typename?: 'Position', id: string, name?: string | null, nameEn?: string | null } | null }> | null } | null };

export type GetMembersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMembersQuery = { __typename?: 'Query', members?: { __typename?: 'MemberPagination', members: Array<{ __typename?: 'Member', id: any, student_id?: string | null, first_name?: string | null, nickname?: string | null, last_name?: string | null } | null> } | null };

export type MemberPageQueryVariables = Exact<{
  id?: InputMaybe<Scalars['UUID']>;
  student_id?: InputMaybe<Scalars['String']>;
}>;


export type MemberPageQuery = { __typename?: 'Query', member?: { __typename?: 'Member', id: any, student_id?: string | null, first_name?: string | null, nickname?: string | null, last_name?: string | null, class_programme?: string | null, class_year?: number | null, picture_path?: string | null, canPing?: boolean | null, mandates?: Array<{ __typename?: 'Mandate', id: any, start_date: any, end_date: any, position?: { __typename?: 'Position', id: string, name?: string | null, nameEn?: string | null, committee?: { __typename?: 'Committee', name?: string | null } | null } | null }> | null, activeMandates?: Array<{ __typename?: 'Mandate', position?: { __typename?: 'Position', id: string, name?: string | null, nameEn?: string | null, email?: string | null, committee?: { __typename?: 'Committee', name?: string | null } | null } | null }> | null } | null };

export type CreateMemberMutationVariables = Exact<{
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  classProgramme: Scalars['String'];
  classYear: Scalars['Int'];
  studentId: Scalars['String'];
}>;


export type CreateMemberMutation = { __typename?: 'Mutation', member?: { __typename?: 'MemberMutations', create?: { __typename?: 'Member', id: any, student_id?: string | null, first_name?: string | null, last_name?: string | null, class_programme?: string | null, class_year?: number | null } | null } | null };

export type UpdateMemberMutationVariables = Exact<{
  id: Scalars['UUID'];
  firstName?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  nickname?: InputMaybe<Scalars['String']>;
  classProgramme?: InputMaybe<Scalars['String']>;
  classYear?: InputMaybe<Scalars['Int']>;
  picturePath?: InputMaybe<Scalars['String']>;
}>;


export type UpdateMemberMutation = { __typename?: 'Mutation', member?: { __typename?: 'MemberMutations', update?: { __typename?: 'Member', first_name?: string | null, last_name?: string | null, nickname?: string | null, class_programme?: string | null, class_year?: number | null, picture_path?: string | null } | null } | null };

export type PingMemberMutationVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type PingMemberMutation = { __typename?: 'Mutation', member?: { __typename?: 'MemberMutations', ping?: boolean | null } | null };

export type NewsPageQueryVariables = Exact<{
  page_number: Scalars['Int'];
  per_page: Scalars['Int'];
  tagIds?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
}>;


export type NewsPageQuery = { __typename?: 'Query', news?: { __typename?: 'ArticlePagination', articles: Array<{ __typename?: 'Article', id: any, slug?: string | null, header: string, headerEn?: string | null, body: string, bodyEn?: string | null, isLikedByMe: boolean, imageUrl?: any | null, publishedDatetime?: any | null, createdDatetime: any, status: ArticleRequestStatus, latestEditDatetime?: any | null, author: { __typename: 'Mandate', member?: { __typename?: 'Member', id: any, student_id?: string | null, first_name?: string | null, nickname?: string | null, last_name?: string | null, picture_path?: string | null } | null, position?: { __typename?: 'Position', id: string, name?: string | null } | null } | { __typename: 'Member', id: any, student_id?: string | null, first_name?: string | null, nickname?: string | null, last_name?: string | null, picture_path?: string | null }, tags: Array<{ __typename?: 'Tag', id: any, name: string, nameEn: string, color?: string | null, isDefault: boolean }>, comments: Array<{ __typename?: 'Comment', id: any, published: any, content: string, member: { __typename?: 'Member', id: any, student_id?: string | null, first_name?: string | null, last_name?: string | null, nickname?: string | null, picture_path?: string | null } } | null>, likers: Array<{ __typename?: 'Member', id: any, student_id?: string | null, first_name?: string | null, last_name?: string | null, nickname?: string | null, picture_path?: string | null } | null> } | null>, pageInfo: { __typename?: 'PaginationInfo', totalPages: number } } | null };

export type NewsPageInfoQueryVariables = Exact<{
  page_number: Scalars['Int'];
  per_page: Scalars['Int'];
}>;


export type NewsPageInfoQuery = { __typename?: 'Query', news?: { __typename?: 'ArticlePagination', pageInfo: { __typename?: 'PaginationInfo', totalPages: number, totalItems: number, hasNextPage: boolean, hasPreviousPage: boolean } } | null };

export type ArticleQueryVariables = Exact<{
  id?: InputMaybe<Scalars['UUID']>;
  slug?: InputMaybe<Scalars['String']>;
}>;


export type ArticleQuery = { __typename?: 'Query', article?: { __typename?: 'Article', id: any, slug?: string | null, body: string, bodyEn?: string | null, header: string, headerEn?: string | null, isLikedByMe: boolean, status: ArticleRequestStatus, imageUrl?: any | null, publishedDatetime?: any | null, createdDatetime: any, author: { __typename: 'Mandate', member?: { __typename?: 'Member', id: any, student_id?: string | null, first_name?: string | null, nickname?: string | null, last_name?: string | null, picture_path?: string | null } | null, position?: { __typename?: 'Position', id: string, name?: string | null } | null } | { __typename: 'Member', id: any, student_id?: string | null, first_name?: string | null, nickname?: string | null, last_name?: string | null, picture_path?: string | null }, handledBy?: { __typename?: 'Member', id: any, student_id?: string | null, first_name?: string | null, nickname?: string | null, last_name?: string | null, picture_path?: string | null } | null, tags: Array<{ __typename?: 'Tag', id: any, name: string, nameEn: string, color?: string | null, isDefault: boolean }>, comments: Array<{ __typename?: 'Comment', id: any, content: string, published: any, member: { __typename?: 'Member', id: any, student_id?: string | null, first_name?: string | null, last_name?: string | null, nickname?: string | null, picture_path?: string | null } } | null>, likers: Array<{ __typename?: 'Member', id: any, student_id?: string | null, first_name?: string | null, last_name?: string | null, nickname?: string | null, picture_path?: string | null } | null> } | null };

export type ArticleToEditQueryVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type ArticleToEditQuery = { __typename?: 'Query', article?: { __typename?: 'Article', id: any, slug?: string | null, body: string, bodyEn?: string | null, header: string, headerEn?: string | null, imageUrl?: any | null, publishedDatetime?: any | null, author: { __typename: 'Mandate', id: any, member?: { __typename?: 'Member', id: any, student_id?: string | null, first_name?: string | null, nickname?: string | null, last_name?: string | null, picture_path?: string | null, mandates?: Array<{ __typename?: 'Mandate', id: any, position?: { __typename?: 'Position', id: string, name?: string | null, nameEn?: string | null } | null }> | null } | null, position?: { __typename?: 'Position', id: string, name?: string | null } | null } | { __typename: 'Member', id: any, student_id?: string | null, first_name?: string | null, nickname?: string | null, last_name?: string | null, picture_path?: string | null, mandates?: Array<{ __typename?: 'Mandate', id: any, position?: { __typename?: 'Position', id: string, name?: string | null, nameEn?: string | null } | null }> | null }, tags: Array<{ __typename?: 'Tag', id: any, name: string, nameEn: string, color?: string | null, isDefault: boolean }> } | null };

export type ArticleRequestsQueryVariables = Exact<{ [key: string]: never; }>;


export type ArticleRequestsQuery = { __typename?: 'Query', articleRequests: Array<{ __typename?: 'ArticleRequest', id: any, slug?: string | null, body: string, bodyEn?: string | null, header: string, headerEn?: string | null, status: ArticleRequestStatus, imageUrl?: any | null, createdDatetime: any, publishedDatetime?: any | null, author: { __typename: 'Mandate', start_date: any, end_date: any, member?: { __typename?: 'Member', id: any, student_id?: string | null, first_name?: string | null, nickname?: string | null, last_name?: string | null, picture_path?: string | null } | null, position?: { __typename?: 'Position', id: string, name?: string | null } | null } | { __typename: 'Member', id: any, student_id?: string | null, first_name?: string | null, nickname?: string | null, last_name?: string | null, picture_path?: string | null }, tags: Array<{ __typename?: 'Tag', id: any, name: string, nameEn: string, color?: string | null, isDefault: boolean }> } | null> };

export type RejectedRequestsQueryVariables = Exact<{
  page: Scalars['Int'];
  perPage: Scalars['Int'];
}>;


export type RejectedRequestsQuery = { __typename?: 'Query', rejectedRequests?: { __typename?: 'ArticleRequestPagination', articles: Array<{ __typename?: 'ArticleRequest', id: any, slug?: string | null, body: string, bodyEn?: string | null, header: string, headerEn?: string | null, status: ArticleRequestStatus, imageUrl?: any | null, createdDatetime: any, rejectedDatetime?: any | null, rejectionReason?: string | null, publishedDatetime?: any | null, author: { __typename: 'Mandate', start_date: any, end_date: any, member?: { __typename?: 'Member', id: any, student_id?: string | null, first_name?: string | null, nickname?: string | null, last_name?: string | null, picture_path?: string | null } | null, position?: { __typename?: 'Position', id: string, name?: string | null } | null } | { __typename: 'Member', id: any, student_id?: string | null, first_name?: string | null, nickname?: string | null, last_name?: string | null, picture_path?: string | null }, handledBy?: { __typename?: 'Member', id: any, student_id?: string | null, first_name?: string | null, nickname?: string | null, last_name?: string | null, picture_path?: string | null } | null, tags: Array<{ __typename?: 'Tag', id: any, name: string, nameEn: string, color?: string | null, isDefault: boolean }> } | null>, pageInfo: { __typename?: 'PaginationInfo', totalPages: number } } | null };

export type ApproveRequestMutationVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type ApproveRequestMutation = { __typename?: 'Mutation', requests?: { __typename?: 'RequestMutations', approve?: { __typename?: 'ArticleRequest', id: any } | null } | null };

export type RejectRequestMutationVariables = Exact<{
  id: Scalars['UUID'];
  reason?: InputMaybe<Scalars['String']>;
}>;


export type RejectRequestMutation = { __typename?: 'Mutation', requests?: { __typename?: 'RequestMutations', reject?: { __typename?: 'ArticleRequest', id: any } | null } | null };

export type UndoRejectionMutationVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type UndoRejectionMutation = { __typename?: 'Mutation', requests?: { __typename?: 'RequestMutations', undoRejection?: { __typename?: 'ArticleRequest', id: any } | null } | null };

export type UpdateArticleMutationVariables = Exact<{
  id: Scalars['UUID'];
  header?: InputMaybe<Scalars['String']>;
  body?: InputMaybe<Scalars['String']>;
  headerEn?: InputMaybe<Scalars['String']>;
  bodyEn?: InputMaybe<Scalars['String']>;
  imageName?: InputMaybe<Scalars['String']>;
  mandateId?: InputMaybe<Scalars['UUID']>;
  tagIds?: InputMaybe<Array<Scalars['UUID']> | Scalars['UUID']>;
}>;


export type UpdateArticleMutation = { __typename?: 'Mutation', article?: { __typename?: 'ArticleMutations', update?: { __typename?: 'UpdateArticlePayload', uploadUrl?: any | null, article: { __typename?: 'Article', id: any, header: string, body: string, headerEn?: string | null, bodyEn?: string | null, imageUrl?: any | null } } | null } | null };

export type CreateArticleMutationVariables = Exact<{
  header: Scalars['String'];
  body: Scalars['String'];
  headerEn: Scalars['String'];
  bodyEn: Scalars['String'];
  imageName?: InputMaybe<Scalars['String']>;
  mandateId?: InputMaybe<Scalars['UUID']>;
  tagIds?: InputMaybe<Array<Scalars['UUID']> | Scalars['UUID']>;
  sendNotification?: InputMaybe<Scalars['Boolean']>;
  notificationBody?: InputMaybe<Scalars['String']>;
  notificationBodyEn?: InputMaybe<Scalars['String']>;
}>;


export type CreateArticleMutation = { __typename?: 'Mutation', article?: { __typename?: 'ArticleMutations', create?: { __typename?: 'CreateArticlePayload', uploadUrl?: any | null, article: { __typename?: 'Article', id: any, header: string, body: string, headerEn?: string | null, bodyEn?: string | null, imageUrl?: any | null } } | null } | null };

export type LikeArticleMutationVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type LikeArticleMutation = { __typename?: 'Mutation', article?: { __typename?: 'ArticleMutations', like?: { __typename?: 'ArticlePayload', article: { __typename?: 'Article', id: any } } | null } | null };

export type UnlikeArticleMutationVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type UnlikeArticleMutation = { __typename?: 'Mutation', article?: { __typename?: 'ArticleMutations', unlike?: { __typename?: 'ArticlePayload', article: { __typename?: 'Article', id: any } } | null } | null };

export type RemoveArticleMutationVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type RemoveArticleMutation = { __typename?: 'Mutation', article?: { __typename?: 'ArticleMutations', remove?: { __typename?: 'ArticlePayload', article: { __typename?: 'Article', id: any } } | null } | null };

export type CommentArticleMutationVariables = Exact<{
  id: Scalars['UUID'];
  content: Scalars['String'];
}>;


export type CommentArticleMutation = { __typename?: 'Mutation', article?: { __typename?: 'ArticleMutations', comment?: { __typename?: 'ArticlePayload', article: { __typename?: 'Article', id: any, comments: Array<{ __typename?: 'Comment', id: any, content: string, published: any, member: { __typename?: 'Member', id: any, student_id?: string | null, first_name?: string | null, last_name?: string | null, nickname?: string | null, picture_path?: string | null } } | null>, likers: Array<{ __typename?: 'Member', id: any, student_id?: string | null, first_name?: string | null, last_name?: string | null, nickname?: string | null, picture_path?: string | null } | null> } } | null } | null };

export type RemoveCommentMutationVariables = Exact<{
  commentId: Scalars['UUID'];
}>;


export type RemoveCommentMutation = { __typename?: 'Mutation', article?: { __typename?: 'ArticleMutations', removeComment?: { __typename?: 'ArticlePayload', article: { __typename?: 'Article', id: any, comments: Array<{ __typename?: 'Comment', id: any, content: string, published: any, member: { __typename?: 'Member', id: any, student_id?: string | null, first_name?: string | null, last_name?: string | null, nickname?: string | null, picture_path?: string | null } } | null>, likers: Array<{ __typename?: 'Member', id: any, student_id?: string | null, first_name?: string | null, last_name?: string | null, nickname?: string | null, picture_path?: string | null } | null> } } | null } | null };

export type GetUploadDataMutationVariables = Exact<{
  fileName: Scalars['String'];
  header: Scalars['String'];
}>;


export type GetUploadDataMutation = { __typename?: 'Mutation', article?: { __typename?: 'ArticleMutations', getUploadData?: { __typename?: 'UploadData', uploadUrl: string } | null } | null };

export type NotificationsQueryVariables = Exact<{ [key: string]: never; }>;


export type NotificationsQuery = { __typename?: 'Query', myNotifications: Array<{ __typename?: 'Notification', id: string, type: string, createdAt: any, updatedAt: any, title: string, message: string, link: string, readAt?: any | null }> };

export type MarkAsReadMutationVariables = Exact<{
  ids: Array<Scalars['UUID']> | Scalars['UUID'];
}>;


export type MarkAsReadMutation = { __typename?: 'Mutation', markAsRead: Array<{ __typename?: 'Notification', id: string, type: string, createdAt: any, updatedAt: any, title: string, message: string, link: string, readAt?: any | null }> };

export type DeleteNotificationsMutationVariables = Exact<{
  ids: Array<Scalars['UUID']> | Scalars['UUID'];
}>;


export type DeleteNotificationsMutation = { __typename?: 'Mutation', deleteNotifications: Array<{ __typename?: 'Notification', id: string, type: string, createdAt: any, updatedAt: any, title: string, message: string, link: string, readAt?: any | null }> };

export type GetMySubscriptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMySubscriptionsQuery = { __typename?: 'Query', mySubscriptionSettings: Array<{ __typename?: 'SubscriptionSetting', id: any, pushNotification: boolean, type: { __typename?: 'SubscriptionType', type: string, title: string } }> };

export type GetSubscriptionTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSubscriptionTypesQuery = { __typename?: 'Query', getSubscriptionTypes: Array<{ __typename?: 'SubscriptionType', type: string, title: string, titleEn?: string | null, description: string, descriptionEn?: string | null }> };

export type ModifySubscriptionSettingMutationVariables = Exact<{
  type: Scalars['String'];
  pushNotification: Scalars['Boolean'];
  enabled: Scalars['Boolean'];
}>;


export type ModifySubscriptionSettingMutation = { __typename?: 'Mutation', subscriptionSettings: { __typename?: 'SubscriptionSettingsMutations', update?: { __typename?: 'SubscriptionSetting', id: any, pushNotification: boolean, type: { __typename?: 'SubscriptionType', type: string, title: string } } | null } };

export type GetMyTagSubscriptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyTagSubscriptionsQuery = { __typename?: 'Query', myTagSubscriptions: Array<{ __typename?: 'Tag', id: any, name: string, nameEn: string, isDefault: boolean, color?: string | null }> };

export type SubscribeToTagMutationVariables = Exact<{
  tagId: Scalars['UUID'];
}>;


export type SubscribeToTagMutation = { __typename?: 'Mutation', tagSubscriptions: { __typename?: 'TagSubscriptionsMutations', subscribe?: Array<any> | null } };

export type UnsubscribeToTagMutationVariables = Exact<{
  tagId: Scalars['UUID'];
}>;


export type UnsubscribeToTagMutation = { __typename?: 'Mutation', tagSubscriptions: { __typename?: 'TagSubscriptionsMutations', unsubscribe?: number | null } };

export type UploadTokenMutationVariables = Exact<{
  token: Scalars['String'];
}>;


export type UploadTokenMutation = { __typename?: 'Mutation', token: { __typename?: 'TokenMutations', register?: { __typename?: 'Token', expo_token: string, id: any } | null } };

export type InitiatePaymentMutationVariables = Exact<{
  phoneNumber: Scalars['String'];
}>;


export type InitiatePaymentMutation = { __typename?: 'Mutation', webshop?: { __typename?: 'WebshopMutations', initiatePayment?: { __typename?: 'Payment', id: any, amount: number, currency: string, paymentStatus: string, paymentMethod: string, createdAt: any, updatedAt: any } | null } | null };

export type CheckoutFreeCartMutationVariables = Exact<{ [key: string]: never; }>;


export type CheckoutFreeCartMutation = { __typename?: 'Mutation', webshop?: { __typename?: 'WebshopMutations', freeCheckout?: { __typename?: 'Payment', id: any, amount: number, currency: string, paymentStatus: string, paymentMethod: string, createdAt: any, updatedAt: any } | null } | null };

export type UpdatePaymentStatusMutationVariables = Exact<{
  paymentId: Scalars['String'];
  status: PaymentStatus;
}>;


export type UpdatePaymentStatusMutation = { __typename?: 'Mutation', webshop?: { __typename?: 'WebshopMutations', updatePaymentStatus?: { __typename?: 'Payment', id: any, amount: number, currency: string, paymentStatus: string, paymentMethod: string, createdAt: any, updatedAt: any } | null } | null };

export type GetPaymentQueryVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type GetPaymentQuery = { __typename?: 'Query', payment?: { __typename?: 'Payment', id: any, amount: number, currency: string, paymentStatus: string, paymentMethod: string, createdAt: any, updatedAt: any } | null };

export type GetPingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPingsQuery = { __typename?: 'Query', pings: Array<{ __typename?: 'Ping', counter: number, lastPing: any, from: { __typename?: 'Member', id: any, student_id?: string | null, first_name?: string | null, nickname?: string | null, last_name?: string | null, picture_path?: string | null } }> };

export type PositionsByCommitteeQueryVariables = Exact<{
  committeeId?: InputMaybe<Scalars['UUID']>;
  shortName?: InputMaybe<Scalars['String']>;
  year?: InputMaybe<Scalars['Int']>;
}>;


export type PositionsByCommitteeQuery = { __typename?: 'Query', positions?: { __typename?: 'PositionPagination', positions: Array<{ __typename?: 'Position', id: string, name?: string | null, nameEn?: string | null, description?: string | null, descriptionEn?: string | null, email?: string | null, emailAliases?: Array<string> | null, committee?: { __typename?: 'Committee', id: any, name?: string | null, shortName: string } | null, activeMandates?: Array<{ __typename?: 'Mandate', id: any, start_date: any, end_date: any, position?: { __typename?: 'Position', id: string, name?: string | null, nameEn?: string | null } | null, member?: { __typename?: 'Member', id: any, picture_path?: string | null, student_id?: string | null, first_name?: string | null, last_name?: string | null } | null } | null> | null } | null>, pageInfo: { __typename?: 'PaginationInfo', hasNextPage: boolean } } | null };

export type PositionQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']>;
}>;


export type PositionQuery = { __typename?: 'Query', positions?: { __typename?: 'PositionPagination', positions: Array<{ __typename?: 'Position', id: string, name?: string | null, nameEn?: string | null, description?: string | null, descriptionEn?: string | null, email?: string | null, emailAliases?: Array<string> | null, active?: boolean | null, boardMember?: boolean | null, committee?: { __typename?: 'Committee', id: any, name?: string | null, name_en?: string | null, shortName: string } | null } | null> } | null, mandatePagination?: { __typename?: 'MandatePagination', mandates: Array<{ __typename?: 'FastMandate', id: any, start_date: any, end_date: any, member?: { __typename?: 'Member', id: any, picture_path?: string | null, student_id?: string | null, first_name?: string | null, nickname?: string | null, last_name?: string | null } | null } | null> } | null };

export type AllPositionsQueryVariables = Exact<{
  committeeId?: InputMaybe<Scalars['UUID']>;
}>;


export type AllPositionsQuery = { __typename?: 'Query', positions?: { __typename?: 'PositionPagination', positions: Array<{ __typename?: 'Position', id: string, name?: string | null, nameEn?: string | null } | null> } | null };

export type UpdatePositionMutationVariables = Exact<{
  id: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
  nameEn?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  descriptionEn?: InputMaybe<Scalars['String']>;
  committee_id?: InputMaybe<Scalars['UUID']>;
  email?: InputMaybe<Scalars['String']>;
}>;


export type UpdatePositionMutation = { __typename?: 'Mutation', position?: { __typename?: 'PositionMutations', update?: { __typename?: 'Position', id: string, name?: string | null, nameEn?: string | null, description?: string | null, descriptionEn?: string | null, email?: string | null, emailAliases?: Array<string> | null, active?: boolean | null, boardMember?: boolean | null, committee?: { __typename?: 'Committee', id: any, name?: string | null, name_en?: string | null, shortName: string } | null } | null } | null };

export type ProductsQueryVariables = Exact<{
  categoryId?: InputMaybe<Scalars['UUID']>;
}>;


export type ProductsQuery = { __typename?: 'Query', products: Array<{ __typename?: 'Product', id: any, name: string, description: string, price: number, maxPerUser: number, imageUrl: string, inventory: Array<{ __typename?: 'ProductInventory', id: any, variant?: string | null, quantity: number } | null>, category?: { __typename?: 'ProductCategory', id: any, name: string, description: string } | null } | null> };

export type ProductCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type ProductCategoriesQuery = { __typename?: 'Query', productCategories: Array<{ __typename?: 'ProductCategory', id: any, name: string, description: string } | null> };

export type SongsQueryVariables = Exact<{ [key: string]: never; }>;


export type SongsQuery = { __typename?: 'Query', songs?: Array<{ __typename?: 'Song', id: any, title: string, lyrics: string, melody: string, category: string, created_at: any, updated_at?: any | null } | null> | null };

export type SongByTitleQueryVariables = Exact<{
  title: Scalars['String'];
}>;


export type SongByTitleQuery = { __typename?: 'Query', songByTitle?: { __typename?: 'Song', id: any, title: string, lyrics: string, melody: string, category: string, created_at: any, updated_at?: any | null } | null };

export type GetTagsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTagsQuery = { __typename?: 'Query', tags: Array<{ __typename?: 'Tag', id: any, name: string, nameEn: string, isDefault: boolean, color?: string | null }> };

export type GetTagQueryVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type GetTagQuery = { __typename?: 'Query', tag?: { __typename?: 'Tag', id: any, name: string, nameEn: string, isDefault: boolean, color?: string | null } | null };

export type CreateTagMutationVariables = Exact<{
  name: Scalars['String'];
  nameEn?: InputMaybe<Scalars['String']>;
  color?: InputMaybe<Scalars['String']>;
  isDefault?: InputMaybe<Scalars['Boolean']>;
}>;


export type CreateTagMutation = { __typename?: 'Mutation', tags?: { __typename?: 'TagMutations', create?: { __typename?: 'Tag', id: any, name: string, nameEn: string, isDefault: boolean, color?: string | null } | null } | null };

export type UpdateTagMutationVariables = Exact<{
  id: Scalars['UUID'];
  name?: InputMaybe<Scalars['String']>;
  nameEn?: InputMaybe<Scalars['String']>;
  color?: InputMaybe<Scalars['String']>;
  isDefault?: InputMaybe<Scalars['Boolean']>;
}>;


export type UpdateTagMutation = { __typename?: 'Mutation', tags?: { __typename?: 'TagMutations', update?: { __typename?: 'Tag', id: any, name: string, nameEn: string, isDefault: boolean, color?: string | null } | null } | null };


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
export const UpdateSearchIndexDocument = gql`
    mutation UpdateSearchIndex {
  admin {
    updateSearchIndex
  }
}
    `;
export type UpdateSearchIndexMutationFn = Apollo.MutationFunction<UpdateSearchIndexMutation, UpdateSearchIndexMutationVariables>;

/**
 * __useUpdateSearchIndexMutation__
 *
 * To run a mutation, you first call `useUpdateSearchIndexMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSearchIndexMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSearchIndexMutation, { data, loading, error }] = useUpdateSearchIndexMutation({
 *   variables: {
 *   },
 * });
 */
export function useUpdateSearchIndexMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSearchIndexMutation, UpdateSearchIndexMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSearchIndexMutation, UpdateSearchIndexMutationVariables>(UpdateSearchIndexDocument, options);
      }
export type UpdateSearchIndexMutationHookResult = ReturnType<typeof useUpdateSearchIndexMutation>;
export type UpdateSearchIndexMutationResult = Apollo.MutationResult<UpdateSearchIndexMutation>;
export type UpdateSearchIndexMutationOptions = Apollo.BaseMutationOptions<UpdateSearchIndexMutation, UpdateSearchIndexMutationVariables>;
export const SyncMandatesWithKeycloakDocument = gql`
    mutation SyncMandatesWithKeycloak {
  admin {
    syncMandatesWithKeycloak
  }
}
    `;
export type SyncMandatesWithKeycloakMutationFn = Apollo.MutationFunction<SyncMandatesWithKeycloakMutation, SyncMandatesWithKeycloakMutationVariables>;

/**
 * __useSyncMandatesWithKeycloakMutation__
 *
 * To run a mutation, you first call `useSyncMandatesWithKeycloakMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSyncMandatesWithKeycloakMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [syncMandatesWithKeycloakMutation, { data, loading, error }] = useSyncMandatesWithKeycloakMutation({
 *   variables: {
 *   },
 * });
 */
export function useSyncMandatesWithKeycloakMutation(baseOptions?: Apollo.MutationHookOptions<SyncMandatesWithKeycloakMutation, SyncMandatesWithKeycloakMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SyncMandatesWithKeycloakMutation, SyncMandatesWithKeycloakMutationVariables>(SyncMandatesWithKeycloakDocument, options);
      }
export type SyncMandatesWithKeycloakMutationHookResult = ReturnType<typeof useSyncMandatesWithKeycloakMutation>;
export type SyncMandatesWithKeycloakMutationResult = Apollo.MutationResult<SyncMandatesWithKeycloakMutation>;
export type SyncMandatesWithKeycloakMutationOptions = Apollo.BaseMutationOptions<SyncMandatesWithKeycloakMutation, SyncMandatesWithKeycloakMutationVariables>;
export const SeedDatabaseDocument = gql`
    mutation SeedDatabase {
  admin {
    seed
  }
}
    `;
export type SeedDatabaseMutationFn = Apollo.MutationFunction<SeedDatabaseMutation, SeedDatabaseMutationVariables>;

/**
 * __useSeedDatabaseMutation__
 *
 * To run a mutation, you first call `useSeedDatabaseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSeedDatabaseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [seedDatabaseMutation, { data, loading, error }] = useSeedDatabaseMutation({
 *   variables: {
 *   },
 * });
 */
export function useSeedDatabaseMutation(baseOptions?: Apollo.MutationHookOptions<SeedDatabaseMutation, SeedDatabaseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SeedDatabaseMutation, SeedDatabaseMutationVariables>(SeedDatabaseDocument, options);
      }
export type SeedDatabaseMutationHookResult = ReturnType<typeof useSeedDatabaseMutation>;
export type SeedDatabaseMutationResult = Apollo.MutationResult<SeedDatabaseMutation>;
export type SeedDatabaseMutationOptions = Apollo.BaseMutationOptions<SeedDatabaseMutation, SeedDatabaseMutationVariables>;
export const GetAdminSettingsDocument = gql`
    query GetAdminSettings {
  adminSettings {
    key
    value
  }
}
    `;

/**
 * __useGetAdminSettingsQuery__
 *
 * To run a query within a React component, call `useGetAdminSettingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAdminSettingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAdminSettingsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAdminSettingsQuery(baseOptions?: Apollo.QueryHookOptions<GetAdminSettingsQuery, GetAdminSettingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAdminSettingsQuery, GetAdminSettingsQueryVariables>(GetAdminSettingsDocument, options);
      }
export function useGetAdminSettingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAdminSettingsQuery, GetAdminSettingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAdminSettingsQuery, GetAdminSettingsQueryVariables>(GetAdminSettingsDocument, options);
        }
export type GetAdminSettingsQueryHookResult = ReturnType<typeof useGetAdminSettingsQuery>;
export type GetAdminSettingsLazyQueryHookResult = ReturnType<typeof useGetAdminSettingsLazyQuery>;
export type GetAdminSettingsQueryResult = Apollo.QueryResult<GetAdminSettingsQuery, GetAdminSettingsQueryVariables>;
export const CreateAdminSettingDocument = gql`
    mutation CreateAdminSetting($key: String!, $value: String!) {
  admin {
    createSetting(key: $key, value: $value) {
      key
      value
    }
  }
}
    `;
export type CreateAdminSettingMutationFn = Apollo.MutationFunction<CreateAdminSettingMutation, CreateAdminSettingMutationVariables>;

/**
 * __useCreateAdminSettingMutation__
 *
 * To run a mutation, you first call `useCreateAdminSettingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAdminSettingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAdminSettingMutation, { data, loading, error }] = useCreateAdminSettingMutation({
 *   variables: {
 *      key: // value for 'key'
 *      value: // value for 'value'
 *   },
 * });
 */
export function useCreateAdminSettingMutation(baseOptions?: Apollo.MutationHookOptions<CreateAdminSettingMutation, CreateAdminSettingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAdminSettingMutation, CreateAdminSettingMutationVariables>(CreateAdminSettingDocument, options);
      }
export type CreateAdminSettingMutationHookResult = ReturnType<typeof useCreateAdminSettingMutation>;
export type CreateAdminSettingMutationResult = Apollo.MutationResult<CreateAdminSettingMutation>;
export type CreateAdminSettingMutationOptions = Apollo.BaseMutationOptions<CreateAdminSettingMutation, CreateAdminSettingMutationVariables>;
export const UpdateAdminSettingDocument = gql`
    mutation UpdateAdminSetting($key: String!, $value: String!) {
  admin {
    updateSetting(key: $key, value: $value) {
      key
      value
    }
  }
}
    `;
export type UpdateAdminSettingMutationFn = Apollo.MutationFunction<UpdateAdminSettingMutation, UpdateAdminSettingMutationVariables>;

/**
 * __useUpdateAdminSettingMutation__
 *
 * To run a mutation, you first call `useUpdateAdminSettingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAdminSettingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAdminSettingMutation, { data, loading, error }] = useUpdateAdminSettingMutation({
 *   variables: {
 *      key: // value for 'key'
 *      value: // value for 'value'
 *   },
 * });
 */
export function useUpdateAdminSettingMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAdminSettingMutation, UpdateAdminSettingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAdminSettingMutation, UpdateAdminSettingMutationVariables>(UpdateAdminSettingDocument, options);
      }
export type UpdateAdminSettingMutationHookResult = ReturnType<typeof useUpdateAdminSettingMutation>;
export type UpdateAdminSettingMutationResult = Apollo.MutationResult<UpdateAdminSettingMutation>;
export type UpdateAdminSettingMutationOptions = Apollo.BaseMutationOptions<UpdateAdminSettingMutation, UpdateAdminSettingMutationVariables>;
export const DeleteAdminSettingDocument = gql`
    mutation DeleteAdminSetting($key: String!) {
  admin {
    deleteSetting(key: $key) {
      key
      value
    }
  }
}
    `;
export type DeleteAdminSettingMutationFn = Apollo.MutationFunction<DeleteAdminSettingMutation, DeleteAdminSettingMutationVariables>;

/**
 * __useDeleteAdminSettingMutation__
 *
 * To run a mutation, you first call `useDeleteAdminSettingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAdminSettingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAdminSettingMutation, { data, loading, error }] = useDeleteAdminSettingMutation({
 *   variables: {
 *      key: // value for 'key'
 *   },
 * });
 */
export function useDeleteAdminSettingMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAdminSettingMutation, DeleteAdminSettingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAdminSettingMutation, DeleteAdminSettingMutationVariables>(DeleteAdminSettingDocument, options);
      }
export type DeleteAdminSettingMutationHookResult = ReturnType<typeof useDeleteAdminSettingMutation>;
export type DeleteAdminSettingMutationResult = Apollo.MutationResult<DeleteAdminSettingMutation>;
export type DeleteAdminSettingMutationOptions = Apollo.BaseMutationOptions<DeleteAdminSettingMutation, DeleteAdminSettingMutationVariables>;
export const SetStabHiddenPeriodDocument = gql`
    mutation SetStabHiddenPeriod($start: Date!, $end: Date!) {
  admin {
    setStabHiddenPeriod(start: $start, end: $end) {
      key
      value
    }
  }
}
    `;
export type SetStabHiddenPeriodMutationFn = Apollo.MutationFunction<SetStabHiddenPeriodMutation, SetStabHiddenPeriodMutationVariables>;

/**
 * __useSetStabHiddenPeriodMutation__
 *
 * To run a mutation, you first call `useSetStabHiddenPeriodMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetStabHiddenPeriodMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setStabHiddenPeriodMutation, { data, loading, error }] = useSetStabHiddenPeriodMutation({
 *   variables: {
 *      start: // value for 'start'
 *      end: // value for 'end'
 *   },
 * });
 */
export function useSetStabHiddenPeriodMutation(baseOptions?: Apollo.MutationHookOptions<SetStabHiddenPeriodMutation, SetStabHiddenPeriodMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetStabHiddenPeriodMutation, SetStabHiddenPeriodMutationVariables>(SetStabHiddenPeriodDocument, options);
      }
export type SetStabHiddenPeriodMutationHookResult = ReturnType<typeof useSetStabHiddenPeriodMutation>;
export type SetStabHiddenPeriodMutationResult = Apollo.MutationResult<SetStabHiddenPeriodMutation>;
export type SetStabHiddenPeriodMutationOptions = Apollo.BaseMutationOptions<SetStabHiddenPeriodMutation, SetStabHiddenPeriodMutationVariables>;
export const AlertsDocument = gql`
    query Alerts {
  alerts {
    id
    message
    messageEn
    severity
  }
}
    `;

/**
 * __useAlertsQuery__
 *
 * To run a query within a React component, call `useAlertsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAlertsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAlertsQuery({
 *   variables: {
 *   },
 * });
 */
export function useAlertsQuery(baseOptions?: Apollo.QueryHookOptions<AlertsQuery, AlertsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AlertsQuery, AlertsQueryVariables>(AlertsDocument, options);
      }
export function useAlertsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AlertsQuery, AlertsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AlertsQuery, AlertsQueryVariables>(AlertsDocument, options);
        }
export type AlertsQueryHookResult = ReturnType<typeof useAlertsQuery>;
export type AlertsLazyQueryHookResult = ReturnType<typeof useAlertsLazyQuery>;
export type AlertsQueryResult = Apollo.QueryResult<AlertsQuery, AlertsQueryVariables>;
export const CreateAlertDocument = gql`
    mutation CreateAlert($message: String!, $messageEn: String!, $severity: AlertColor!) {
  alert {
    create(message: $message, messageEn: $messageEn, severity: $severity) {
      id
      message
      messageEn
      severity
    }
  }
}
    `;
export type CreateAlertMutationFn = Apollo.MutationFunction<CreateAlertMutation, CreateAlertMutationVariables>;

/**
 * __useCreateAlertMutation__
 *
 * To run a mutation, you first call `useCreateAlertMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAlertMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAlertMutation, { data, loading, error }] = useCreateAlertMutation({
 *   variables: {
 *      message: // value for 'message'
 *      messageEn: // value for 'messageEn'
 *      severity: // value for 'severity'
 *   },
 * });
 */
export function useCreateAlertMutation(baseOptions?: Apollo.MutationHookOptions<CreateAlertMutation, CreateAlertMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAlertMutation, CreateAlertMutationVariables>(CreateAlertDocument, options);
      }
export type CreateAlertMutationHookResult = ReturnType<typeof useCreateAlertMutation>;
export type CreateAlertMutationResult = Apollo.MutationResult<CreateAlertMutation>;
export type CreateAlertMutationOptions = Apollo.BaseMutationOptions<CreateAlertMutation, CreateAlertMutationVariables>;
export const RemoveAlertDocument = gql`
    mutation RemoveAlert($id: UUID!) {
  alert {
    remove(id: $id) {
      id
      message
      messageEn
      severity
    }
  }
}
    `;
export type RemoveAlertMutationFn = Apollo.MutationFunction<RemoveAlertMutation, RemoveAlertMutationVariables>;

/**
 * __useRemoveAlertMutation__
 *
 * To run a mutation, you first call `useRemoveAlertMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveAlertMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeAlertMutation, { data, loading, error }] = useRemoveAlertMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveAlertMutation(baseOptions?: Apollo.MutationHookOptions<RemoveAlertMutation, RemoveAlertMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveAlertMutation, RemoveAlertMutationVariables>(RemoveAlertDocument, options);
      }
export type RemoveAlertMutationHookResult = ReturnType<typeof useRemoveAlertMutation>;
export type RemoveAlertMutationResult = Apollo.MutationResult<RemoveAlertMutation>;
export type RemoveAlertMutationOptions = Apollo.BaseMutationOptions<RemoveAlertMutation, RemoveAlertMutationVariables>;
export const GetBookablesDocument = gql`
    query GetBookables {
  bookables(includeDisabled: false) {
    id
    name
    name_en
    door {
      id
      name
    }
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
export const GetAllBookablesDocument = gql`
    query GetAllBookables {
  bookables(includeDisabled: true) {
    id
    name
    name_en
    isDisabled
    door {
      id
      name
    }
  }
}
    `;

/**
 * __useGetAllBookablesQuery__
 *
 * To run a query within a React component, call `useGetAllBookablesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllBookablesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllBookablesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllBookablesQuery(baseOptions?: Apollo.QueryHookOptions<GetAllBookablesQuery, GetAllBookablesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllBookablesQuery, GetAllBookablesQueryVariables>(GetAllBookablesDocument, options);
      }
export function useGetAllBookablesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllBookablesQuery, GetAllBookablesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllBookablesQuery, GetAllBookablesQueryVariables>(GetAllBookablesDocument, options);
        }
export type GetAllBookablesQueryHookResult = ReturnType<typeof useGetAllBookablesQuery>;
export type GetAllBookablesLazyQueryHookResult = ReturnType<typeof useGetAllBookablesLazyQuery>;
export type GetAllBookablesQueryResult = Apollo.QueryResult<GetAllBookablesQuery, GetAllBookablesQueryVariables>;
export const GetBookingsDocument = gql`
    query GetBookings($from: Datetime, $to: Datetime, $status: BookingStatus) {
  bookingRequests(filter: {from: $from, to: $to, status: $status}) {
    id
    start
    end
    event
    booker {
      id
      student_id
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
        isDisabled
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
    accept(id: $id, acceptWithAccess: true)
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
export const RemoveBookingRequestDocument = gql`
    mutation RemoveBookingRequest($id: UUID!) {
  bookingRequest {
    remove(id: $id) {
      id
    }
  }
}
    `;
export type RemoveBookingRequestMutationFn = Apollo.MutationFunction<RemoveBookingRequestMutation, RemoveBookingRequestMutationVariables>;

/**
 * __useRemoveBookingRequestMutation__
 *
 * To run a mutation, you first call `useRemoveBookingRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveBookingRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeBookingRequestMutation, { data, loading, error }] = useRemoveBookingRequestMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveBookingRequestMutation(baseOptions?: Apollo.MutationHookOptions<RemoveBookingRequestMutation, RemoveBookingRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveBookingRequestMutation, RemoveBookingRequestMutationVariables>(RemoveBookingRequestDocument, options);
      }
export type RemoveBookingRequestMutationHookResult = ReturnType<typeof useRemoveBookingRequestMutation>;
export type RemoveBookingRequestMutationResult = Apollo.MutationResult<RemoveBookingRequestMutation>;
export type RemoveBookingRequestMutationOptions = Apollo.BaseMutationOptions<RemoveBookingRequestMutation, RemoveBookingRequestMutationVariables>;
export const CreateBookableDocument = gql`
    mutation CreateBookable($input: CreateBookable!) {
  bookable {
    create(input: $input) {
      id
      name
      name_en
      isDisabled
    }
  }
}
    `;
export type CreateBookableMutationFn = Apollo.MutationFunction<CreateBookableMutation, CreateBookableMutationVariables>;

/**
 * __useCreateBookableMutation__
 *
 * To run a mutation, you first call `useCreateBookableMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateBookableMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createBookableMutation, { data, loading, error }] = useCreateBookableMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateBookableMutation(baseOptions?: Apollo.MutationHookOptions<CreateBookableMutation, CreateBookableMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateBookableMutation, CreateBookableMutationVariables>(CreateBookableDocument, options);
      }
export type CreateBookableMutationHookResult = ReturnType<typeof useCreateBookableMutation>;
export type CreateBookableMutationResult = Apollo.MutationResult<CreateBookableMutation>;
export type CreateBookableMutationOptions = Apollo.BaseMutationOptions<CreateBookableMutation, CreateBookableMutationVariables>;
export const EditBookableDocument = gql`
    mutation EditBookable($id: UUID!, $input: UpdateBookable!) {
  bookable {
    update(id: $id, input: $input) {
      id
      name
      name_en
      isDisabled
    }
  }
}
    `;
export type EditBookableMutationFn = Apollo.MutationFunction<EditBookableMutation, EditBookableMutationVariables>;

/**
 * __useEditBookableMutation__
 *
 * To run a mutation, you first call `useEditBookableMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditBookableMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editBookableMutation, { data, loading, error }] = useEditBookableMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEditBookableMutation(baseOptions?: Apollo.MutationHookOptions<EditBookableMutation, EditBookableMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditBookableMutation, EditBookableMutationVariables>(EditBookableDocument, options);
      }
export type EditBookableMutationHookResult = ReturnType<typeof useEditBookableMutation>;
export type EditBookableMutationResult = Apollo.MutationResult<EditBookableMutation>;
export type EditBookableMutationOptions = Apollo.BaseMutationOptions<EditBookableMutation, EditBookableMutationVariables>;
export const MyCartDocument = gql`
    query MyCart {
  myCart {
    id
    cartItems {
      id
      name
      description
      price
      maxPerUser
      imageUrl
      inventory {
        id
        inventoryId
        variant
        quantity
      }
      category {
        id
        name
        description
      }
    }
    totalPrice
    totalQuantity
    expiresAt
  }
}
    `;

/**
 * __useMyCartQuery__
 *
 * To run a query within a React component, call `useMyCartQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyCartQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyCartQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyCartQuery(baseOptions?: Apollo.QueryHookOptions<MyCartQuery, MyCartQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyCartQuery, MyCartQueryVariables>(MyCartDocument, options);
      }
export function useMyCartLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyCartQuery, MyCartQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyCartQuery, MyCartQueryVariables>(MyCartDocument, options);
        }
export type MyCartQueryHookResult = ReturnType<typeof useMyCartQuery>;
export type MyCartLazyQueryHookResult = ReturnType<typeof useMyCartLazyQuery>;
export type MyCartQueryResult = Apollo.QueryResult<MyCartQuery, MyCartQueryVariables>;
export const AddToMyCartDocument = gql`
    mutation AddToMyCart($inventoryId: UUID!, $quantity: Int!) {
  webshop {
    addToMyCart(inventoryId: $inventoryId, quantity: $quantity) {
      id
      cartItems {
        id
        name
        description
        price
        maxPerUser
        imageUrl
        inventory {
          id
          inventoryId
          variant
          quantity
        }
        category {
          id
          name
          description
        }
      }
      totalPrice
      totalQuantity
      expiresAt
    }
  }
}
    `;
export type AddToMyCartMutationFn = Apollo.MutationFunction<AddToMyCartMutation, AddToMyCartMutationVariables>;

/**
 * __useAddToMyCartMutation__
 *
 * To run a mutation, you first call `useAddToMyCartMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddToMyCartMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addToMyCartMutation, { data, loading, error }] = useAddToMyCartMutation({
 *   variables: {
 *      inventoryId: // value for 'inventoryId'
 *      quantity: // value for 'quantity'
 *   },
 * });
 */
export function useAddToMyCartMutation(baseOptions?: Apollo.MutationHookOptions<AddToMyCartMutation, AddToMyCartMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddToMyCartMutation, AddToMyCartMutationVariables>(AddToMyCartDocument, options);
      }
export type AddToMyCartMutationHookResult = ReturnType<typeof useAddToMyCartMutation>;
export type AddToMyCartMutationResult = Apollo.MutationResult<AddToMyCartMutation>;
export type AddToMyCartMutationOptions = Apollo.BaseMutationOptions<AddToMyCartMutation, AddToMyCartMutationVariables>;
export const RemoveFromMyCartDocument = gql`
    mutation RemoveFromMyCart($inventoryId: UUID!, $quantity: Int!) {
  webshop {
    removeFromMyCart(inventoryId: $inventoryId, quantity: $quantity) {
      id
      cartItems {
        id
        name
        description
        price
        maxPerUser
        imageUrl
        inventory {
          id
          inventoryId
          variant
          quantity
        }
        category {
          id
          name
          description
        }
      }
      totalPrice
      totalQuantity
      expiresAt
    }
  }
}
    `;
export type RemoveFromMyCartMutationFn = Apollo.MutationFunction<RemoveFromMyCartMutation, RemoveFromMyCartMutationVariables>;

/**
 * __useRemoveFromMyCartMutation__
 *
 * To run a mutation, you first call `useRemoveFromMyCartMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveFromMyCartMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeFromMyCartMutation, { data, loading, error }] = useRemoveFromMyCartMutation({
 *   variables: {
 *      inventoryId: // value for 'inventoryId'
 *      quantity: // value for 'quantity'
 *   },
 * });
 */
export function useRemoveFromMyCartMutation(baseOptions?: Apollo.MutationHookOptions<RemoveFromMyCartMutation, RemoveFromMyCartMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveFromMyCartMutation, RemoveFromMyCartMutationVariables>(RemoveFromMyCartDocument, options);
      }
export type RemoveFromMyCartMutationHookResult = ReturnType<typeof useRemoveFromMyCartMutation>;
export type RemoveFromMyCartMutationResult = Apollo.MutationResult<RemoveFromMyCartMutation>;
export type RemoveFromMyCartMutationOptions = Apollo.BaseMutationOptions<RemoveFromMyCartMutation, RemoveFromMyCartMutationVariables>;
export const RemoveMyCartDocument = gql`
    mutation RemoveMyCart {
  webshop {
    removeMyCart
  }
}
    `;
export type RemoveMyCartMutationFn = Apollo.MutationFunction<RemoveMyCartMutation, RemoveMyCartMutationVariables>;

/**
 * __useRemoveMyCartMutation__
 *
 * To run a mutation, you first call `useRemoveMyCartMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveMyCartMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeMyCartMutation, { data, loading, error }] = useRemoveMyCartMutation({
 *   variables: {
 *   },
 * });
 */
export function useRemoveMyCartMutation(baseOptions?: Apollo.MutationHookOptions<RemoveMyCartMutation, RemoveMyCartMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveMyCartMutation, RemoveMyCartMutationVariables>(RemoveMyCartDocument, options);
      }
export type RemoveMyCartMutationHookResult = ReturnType<typeof useRemoveMyCartMutation>;
export type RemoveMyCartMutationResult = Apollo.MutationResult<RemoveMyCartMutation>;
export type RemoveMyCartMutationOptions = Apollo.BaseMutationOptions<RemoveMyCartMutation, RemoveMyCartMutationVariables>;
export const MyChestDocument = gql`
    query MyChest($studentId: String!) {
  chest(studentId: $studentId) {
    id
    items {
      id
      name
      description
      paidPrice
      imageUrl
      variant
      category {
        id
        name
        description
      }
      paidAt
      consumedAt
    }
  }
}
    `;

/**
 * __useMyChestQuery__
 *
 * To run a query within a React component, call `useMyChestQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyChestQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyChestQuery({
 *   variables: {
 *      studentId: // value for 'studentId'
 *   },
 * });
 */
export function useMyChestQuery(baseOptions: Apollo.QueryHookOptions<MyChestQuery, MyChestQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyChestQuery, MyChestQueryVariables>(MyChestDocument, options);
      }
export function useMyChestLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyChestQuery, MyChestQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyChestQuery, MyChestQueryVariables>(MyChestDocument, options);
        }
export type MyChestQueryHookResult = ReturnType<typeof useMyChestQuery>;
export type MyChestLazyQueryHookResult = ReturnType<typeof useMyChestLazyQuery>;
export type MyChestQueryResult = Apollo.QueryResult<MyChestQuery, MyChestQueryVariables>;
export const ConsumeItemDocument = gql`
    mutation ConsumeItem($itemId: UUID!) {
  webshop {
    consumeItem(itemId: $itemId) {
      id
      items {
        id
        name
        description
        paidPrice
        imageUrl
        variant
        category {
          id
          name
          description
        }
        paidAt
        consumedAt
      }
    }
  }
}
    `;
export type ConsumeItemMutationFn = Apollo.MutationFunction<ConsumeItemMutation, ConsumeItemMutationVariables>;

/**
 * __useConsumeItemMutation__
 *
 * To run a mutation, you first call `useConsumeItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConsumeItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [consumeItemMutation, { data, loading, error }] = useConsumeItemMutation({
 *   variables: {
 *      itemId: // value for 'itemId'
 *   },
 * });
 */
export function useConsumeItemMutation(baseOptions?: Apollo.MutationHookOptions<ConsumeItemMutation, ConsumeItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ConsumeItemMutation, ConsumeItemMutationVariables>(ConsumeItemDocument, options);
      }
export type ConsumeItemMutationHookResult = ReturnType<typeof useConsumeItemMutation>;
export type ConsumeItemMutationResult = Apollo.MutationResult<ConsumeItemMutation>;
export type ConsumeItemMutationOptions = Apollo.BaseMutationOptions<ConsumeItemMutation, ConsumeItemMutationVariables>;
export const GetCommitteesDocument = gql`
    query GetCommittees {
  committees(perPage: 50) {
    committees {
      id
      name
      name_en
      shortName
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
export const GetPermanentDoorMembersDocument = gql`
    query getPermanentDoorMembers {
  mandatePagination(
    filter: {position_ids: ["dsek.infu.dwww.mastare", "dsek.km.rootm.root", "dsek.ordf", "dsek.km.mastare"], start_date: "2021-12-31"}
  ) {
    mandates {
      member {
        student_id
      }
    }
  }
}
    `;

/**
 * __useGetPermanentDoorMembersQuery__
 *
 * To run a query within a React component, call `useGetPermanentDoorMembersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPermanentDoorMembersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPermanentDoorMembersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPermanentDoorMembersQuery(baseOptions?: Apollo.QueryHookOptions<GetPermanentDoorMembersQuery, GetPermanentDoorMembersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPermanentDoorMembersQuery, GetPermanentDoorMembersQueryVariables>(GetPermanentDoorMembersDocument, options);
      }
export function useGetPermanentDoorMembersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPermanentDoorMembersQuery, GetPermanentDoorMembersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPermanentDoorMembersQuery, GetPermanentDoorMembersQueryVariables>(GetPermanentDoorMembersDocument, options);
        }
export type GetPermanentDoorMembersQueryHookResult = ReturnType<typeof useGetPermanentDoorMembersQuery>;
export type GetPermanentDoorMembersLazyQueryHookResult = ReturnType<typeof useGetPermanentDoorMembersLazyQuery>;
export type GetPermanentDoorMembersQueryResult = Apollo.QueryResult<GetPermanentDoorMembersQuery, GetPermanentDoorMembersQueryVariables>;
export const DoorAccessDocument = gql`
    query DoorAccess($name: String!) {
  door(name: $name) {
    studentIds
  }
}
    `;

/**
 * __useDoorAccessQuery__
 *
 * To run a query within a React component, call `useDoorAccessQuery` and pass it any options that fit your needs.
 * When your component renders, `useDoorAccessQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDoorAccessQuery({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useDoorAccessQuery(baseOptions: Apollo.QueryHookOptions<DoorAccessQuery, DoorAccessQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DoorAccessQuery, DoorAccessQueryVariables>(DoorAccessDocument, options);
      }
export function useDoorAccessLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DoorAccessQuery, DoorAccessQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DoorAccessQuery, DoorAccessQueryVariables>(DoorAccessDocument, options);
        }
export type DoorAccessQueryHookResult = ReturnType<typeof useDoorAccessQuery>;
export type DoorAccessLazyQueryHookResult = ReturnType<typeof useDoorAccessLazyQuery>;
export type DoorAccessQueryResult = Apollo.QueryResult<DoorAccessQuery, DoorAccessQueryVariables>;
export const AlarmShouldBeActiveDocument = gql`
    query AlarmShouldBeActive {
  alarmShouldBeActive
}
    `;

/**
 * __useAlarmShouldBeActiveQuery__
 *
 * To run a query within a React component, call `useAlarmShouldBeActiveQuery` and pass it any options that fit your needs.
 * When your component renders, `useAlarmShouldBeActiveQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAlarmShouldBeActiveQuery({
 *   variables: {
 *   },
 * });
 */
export function useAlarmShouldBeActiveQuery(baseOptions?: Apollo.QueryHookOptions<AlarmShouldBeActiveQuery, AlarmShouldBeActiveQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AlarmShouldBeActiveQuery, AlarmShouldBeActiveQueryVariables>(AlarmShouldBeActiveDocument, options);
      }
export function useAlarmShouldBeActiveLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AlarmShouldBeActiveQuery, AlarmShouldBeActiveQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AlarmShouldBeActiveQuery, AlarmShouldBeActiveQueryVariables>(AlarmShouldBeActiveDocument, options);
        }
export type AlarmShouldBeActiveQueryHookResult = ReturnType<typeof useAlarmShouldBeActiveQuery>;
export type AlarmShouldBeActiveLazyQueryHookResult = ReturnType<typeof useAlarmShouldBeActiveLazyQuery>;
export type AlarmShouldBeActiveQueryResult = Apollo.QueryResult<AlarmShouldBeActiveQuery, AlarmShouldBeActiveQueryVariables>;
export const EventsDocument = gql`
    query Events($start_datetime: Datetime, $end_datetime: Datetime, $id: UUID, $page: Int, $perPage: Int) {
  events(
    page: $page
    perPage: $perPage
    filter: {start_datetime: $start_datetime, end_datetime: $end_datetime, id: $id}
  ) {
    pageInfo {
      totalPages
    }
    events {
      title
      id
      slug
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
      iAmInterested
      iAmGoing
      peopleGoing {
        id
        student_id
        first_name
        last_name
        nickname
        picture_path
      }
      peopleInterested {
        id
        student_id
        first_name
        last_name
        nickname
        picture_path
      }
      author {
        id
      }
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
 *      id: // value for 'id'
 *      page: // value for 'page'
 *      perPage: // value for 'perPage'
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
    query Event($id: UUID, $slug: String) {
  event(id: $id, slug: $slug) {
    title
    id
    alarm_active
    slug
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
    iAmInterested
    iAmGoing
    peopleGoing {
      id
      student_id
      first_name
      last_name
      nickname
      picture_path
    }
    peopleInterested {
      id
      student_id
      first_name
      last_name
      nickname
      picture_path
    }
    comments {
      id
      published
      content
      member {
        id
        student_id
        first_name
        last_name
        nickname
        picture_path
      }
    }
    author {
      id
    }
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
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useEventQuery(baseOptions?: Apollo.QueryHookOptions<EventQuery, EventQueryVariables>) {
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
    mutation UpdateEvent($id: UUID!, $title: String, $description: String, $short_description: String, $start_datetime: Datetime, $end_datetime: Datetime, $link: String, $location: String, $organizer: String, $title_en: String, $description_en: String, $short_description_en: String, $alarm_active: Boolean) {
  event {
    update(
      id: $id
      input: {title: $title, description: $description, short_description: $short_description, start_datetime: $start_datetime, end_datetime: $end_datetime, link: $link, location: $location, organizer: $organizer, title_en: $title_en, description_en: $description_en, short_description_en: $short_description_en, alarm_active: $alarm_active}
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
      author {
        id
      }
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
 *      alarm_active: // value for 'alarm_active'
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
    mutation CreateEvent($title: String!, $description: String!, $short_description: String!, $start_datetime: Datetime!, $end_datetime: Datetime!, $link: String, $location: String!, $organizer: String!, $title_en: String, $description_en: String, $short_description_en: String, $alarm_active: Boolean!) {
  event {
    create(
      input: {title: $title, description: $description, short_description: $short_description, start_datetime: $start_datetime, end_datetime: $end_datetime, link: $link, location: $location, organizer: $organizer, title_en: $title_en, description_en: $description_en, short_description_en: $short_description_en, alarm_active: $alarm_active}
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
 *      alarm_active: // value for 'alarm_active'
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
export const SetGoingToEventDocument = gql`
    mutation SetGoingToEvent($id: UUID!) {
  event {
    setGoing(id: $id) {
      id
    }
  }
}
    `;
export type SetGoingToEventMutationFn = Apollo.MutationFunction<SetGoingToEventMutation, SetGoingToEventMutationVariables>;

/**
 * __useSetGoingToEventMutation__
 *
 * To run a mutation, you first call `useSetGoingToEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetGoingToEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setGoingToEventMutation, { data, loading, error }] = useSetGoingToEventMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSetGoingToEventMutation(baseOptions?: Apollo.MutationHookOptions<SetGoingToEventMutation, SetGoingToEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetGoingToEventMutation, SetGoingToEventMutationVariables>(SetGoingToEventDocument, options);
      }
export type SetGoingToEventMutationHookResult = ReturnType<typeof useSetGoingToEventMutation>;
export type SetGoingToEventMutationResult = Apollo.MutationResult<SetGoingToEventMutation>;
export type SetGoingToEventMutationOptions = Apollo.BaseMutationOptions<SetGoingToEventMutation, SetGoingToEventMutationVariables>;
export const UnsetGoingToEventDocument = gql`
    mutation UnsetGoingToEvent($id: UUID!) {
  event {
    unsetGoing(id: $id) {
      id
    }
  }
}
    `;
export type UnsetGoingToEventMutationFn = Apollo.MutationFunction<UnsetGoingToEventMutation, UnsetGoingToEventMutationVariables>;

/**
 * __useUnsetGoingToEventMutation__
 *
 * To run a mutation, you first call `useUnsetGoingToEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnsetGoingToEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unsetGoingToEventMutation, { data, loading, error }] = useUnsetGoingToEventMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUnsetGoingToEventMutation(baseOptions?: Apollo.MutationHookOptions<UnsetGoingToEventMutation, UnsetGoingToEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnsetGoingToEventMutation, UnsetGoingToEventMutationVariables>(UnsetGoingToEventDocument, options);
      }
export type UnsetGoingToEventMutationHookResult = ReturnType<typeof useUnsetGoingToEventMutation>;
export type UnsetGoingToEventMutationResult = Apollo.MutationResult<UnsetGoingToEventMutation>;
export type UnsetGoingToEventMutationOptions = Apollo.BaseMutationOptions<UnsetGoingToEventMutation, UnsetGoingToEventMutationVariables>;
export const SetInterestedInEventDocument = gql`
    mutation SetInterestedInEvent($id: UUID!) {
  event {
    setInterested(id: $id) {
      id
    }
  }
}
    `;
export type SetInterestedInEventMutationFn = Apollo.MutationFunction<SetInterestedInEventMutation, SetInterestedInEventMutationVariables>;

/**
 * __useSetInterestedInEventMutation__
 *
 * To run a mutation, you first call `useSetInterestedInEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetInterestedInEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setInterestedInEventMutation, { data, loading, error }] = useSetInterestedInEventMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSetInterestedInEventMutation(baseOptions?: Apollo.MutationHookOptions<SetInterestedInEventMutation, SetInterestedInEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetInterestedInEventMutation, SetInterestedInEventMutationVariables>(SetInterestedInEventDocument, options);
      }
export type SetInterestedInEventMutationHookResult = ReturnType<typeof useSetInterestedInEventMutation>;
export type SetInterestedInEventMutationResult = Apollo.MutationResult<SetInterestedInEventMutation>;
export type SetInterestedInEventMutationOptions = Apollo.BaseMutationOptions<SetInterestedInEventMutation, SetInterestedInEventMutationVariables>;
export const UnsetInterestedInEventDocument = gql`
    mutation UnsetInterestedInEvent($id: UUID!) {
  event {
    unsetInterested(id: $id) {
      id
    }
  }
}
    `;
export type UnsetInterestedInEventMutationFn = Apollo.MutationFunction<UnsetInterestedInEventMutation, UnsetInterestedInEventMutationVariables>;

/**
 * __useUnsetInterestedInEventMutation__
 *
 * To run a mutation, you first call `useUnsetInterestedInEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnsetInterestedInEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unsetInterestedInEventMutation, { data, loading, error }] = useUnsetInterestedInEventMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUnsetInterestedInEventMutation(baseOptions?: Apollo.MutationHookOptions<UnsetInterestedInEventMutation, UnsetInterestedInEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnsetInterestedInEventMutation, UnsetInterestedInEventMutationVariables>(UnsetInterestedInEventDocument, options);
      }
export type UnsetInterestedInEventMutationHookResult = ReturnType<typeof useUnsetInterestedInEventMutation>;
export type UnsetInterestedInEventMutationResult = Apollo.MutationResult<UnsetInterestedInEventMutation>;
export type UnsetInterestedInEventMutationOptions = Apollo.BaseMutationOptions<UnsetInterestedInEventMutation, UnsetInterestedInEventMutationVariables>;
export const CommentEventDocument = gql`
    mutation CommentEvent($id: UUID!, $content: String!) {
  event {
    comment(id: $id, content: $content) {
      id
      comments {
        id
        content
        published
        member {
          id
          student_id
          first_name
          last_name
          nickname
          picture_path
        }
      }
    }
  }
}
    `;
export type CommentEventMutationFn = Apollo.MutationFunction<CommentEventMutation, CommentEventMutationVariables>;

/**
 * __useCommentEventMutation__
 *
 * To run a mutation, you first call `useCommentEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCommentEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [commentEventMutation, { data, loading, error }] = useCommentEventMutation({
 *   variables: {
 *      id: // value for 'id'
 *      content: // value for 'content'
 *   },
 * });
 */
export function useCommentEventMutation(baseOptions?: Apollo.MutationHookOptions<CommentEventMutation, CommentEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CommentEventMutation, CommentEventMutationVariables>(CommentEventDocument, options);
      }
export type CommentEventMutationHookResult = ReturnType<typeof useCommentEventMutation>;
export type CommentEventMutationResult = Apollo.MutationResult<CommentEventMutation>;
export type CommentEventMutationOptions = Apollo.BaseMutationOptions<CommentEventMutation, CommentEventMutationVariables>;
export const RemoveCommentFromEventDocument = gql`
    mutation RemoveCommentFromEvent($commentId: UUID!) {
  event {
    removeComment(commentId: $commentId) {
      id
      comments {
        id
        content
        published
        member {
          id
          student_id
          first_name
          last_name
          nickname
          picture_path
        }
      }
    }
  }
}
    `;
export type RemoveCommentFromEventMutationFn = Apollo.MutationFunction<RemoveCommentFromEventMutation, RemoveCommentFromEventMutationVariables>;

/**
 * __useRemoveCommentFromEventMutation__
 *
 * To run a mutation, you first call `useRemoveCommentFromEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveCommentFromEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeCommentFromEventMutation, { data, loading, error }] = useRemoveCommentFromEventMutation({
 *   variables: {
 *      commentId: // value for 'commentId'
 *   },
 * });
 */
export function useRemoveCommentFromEventMutation(baseOptions?: Apollo.MutationHookOptions<RemoveCommentFromEventMutation, RemoveCommentFromEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveCommentFromEventMutation, RemoveCommentFromEventMutationVariables>(RemoveCommentFromEventDocument, options);
      }
export type RemoveCommentFromEventMutationHookResult = ReturnType<typeof useRemoveCommentFromEventMutation>;
export type RemoveCommentFromEventMutationResult = Apollo.MutationResult<RemoveCommentFromEventMutation>;
export type RemoveCommentFromEventMutationOptions = Apollo.BaseMutationOptions<RemoveCommentFromEventMutation, RemoveCommentFromEventMutationVariables>;
export const FilesDocument = gql`
    query files($bucket: String!, $prefix: String!, $recursive: Boolean) {
  files(bucket: $bucket, prefix: $prefix, recursive: $recursive) {
    id
    name
    size
    isDir
    modDate
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
 *      recursive: // value for 'recursive'
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
export const RemoveMyProfilePictureDocument = gql`
    mutation RemoveMyProfilePicture($fileName: String!) {
  files {
    removeMyProfilePicture(fileName: $fileName) {
      id
      name
    }
  }
}
    `;
export type RemoveMyProfilePictureMutationFn = Apollo.MutationFunction<RemoveMyProfilePictureMutation, RemoveMyProfilePictureMutationVariables>;

/**
 * __useRemoveMyProfilePictureMutation__
 *
 * To run a mutation, you first call `useRemoveMyProfilePictureMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveMyProfilePictureMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeMyProfilePictureMutation, { data, loading, error }] = useRemoveMyProfilePictureMutation({
 *   variables: {
 *      fileName: // value for 'fileName'
 *   },
 * });
 */
export function useRemoveMyProfilePictureMutation(baseOptions?: Apollo.MutationHookOptions<RemoveMyProfilePictureMutation, RemoveMyProfilePictureMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveMyProfilePictureMutation, RemoveMyProfilePictureMutationVariables>(RemoveMyProfilePictureDocument, options);
      }
export type RemoveMyProfilePictureMutationHookResult = ReturnType<typeof useRemoveMyProfilePictureMutation>;
export type RemoveMyProfilePictureMutationResult = Apollo.MutationResult<RemoveMyProfilePictureMutation>;
export type RemoveMyProfilePictureMutationOptions = Apollo.BaseMutationOptions<RemoveMyProfilePictureMutation, RemoveMyProfilePictureMutationVariables>;
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
export const GetGoverningDocumentDocument = gql`
    query GetGoverningDocument($id: UUID!) {
  governingDocument(id: $id) {
    id
    title
    url
    type
  }
}
    `;

/**
 * __useGetGoverningDocumentQuery__
 *
 * To run a query within a React component, call `useGetGoverningDocumentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGoverningDocumentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGoverningDocumentQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetGoverningDocumentQuery(baseOptions: Apollo.QueryHookOptions<GetGoverningDocumentQuery, GetGoverningDocumentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGoverningDocumentQuery, GetGoverningDocumentQueryVariables>(GetGoverningDocumentDocument, options);
      }
export function useGetGoverningDocumentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGoverningDocumentQuery, GetGoverningDocumentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGoverningDocumentQuery, GetGoverningDocumentQueryVariables>(GetGoverningDocumentDocument, options);
        }
export type GetGoverningDocumentQueryHookResult = ReturnType<typeof useGetGoverningDocumentQuery>;
export type GetGoverningDocumentLazyQueryHookResult = ReturnType<typeof useGetGoverningDocumentLazyQuery>;
export type GetGoverningDocumentQueryResult = Apollo.QueryResult<GetGoverningDocumentQuery, GetGoverningDocumentQueryVariables>;
export const GetGoverningDocumentsDocument = gql`
    query GetGoverningDocuments {
  governingDocuments {
    id
    title
    url
    type
  }
}
    `;

/**
 * __useGetGoverningDocumentsQuery__
 *
 * To run a query within a React component, call `useGetGoverningDocumentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGoverningDocumentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGoverningDocumentsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetGoverningDocumentsQuery(baseOptions?: Apollo.QueryHookOptions<GetGoverningDocumentsQuery, GetGoverningDocumentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGoverningDocumentsQuery, GetGoverningDocumentsQueryVariables>(GetGoverningDocumentsDocument, options);
      }
export function useGetGoverningDocumentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGoverningDocumentsQuery, GetGoverningDocumentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGoverningDocumentsQuery, GetGoverningDocumentsQueryVariables>(GetGoverningDocumentsDocument, options);
        }
export type GetGoverningDocumentsQueryHookResult = ReturnType<typeof useGetGoverningDocumentsQuery>;
export type GetGoverningDocumentsLazyQueryHookResult = ReturnType<typeof useGetGoverningDocumentsLazyQuery>;
export type GetGoverningDocumentsQueryResult = Apollo.QueryResult<GetGoverningDocumentsQuery, GetGoverningDocumentsQueryVariables>;
export const GetPoliciesDocument = gql`
    query GetPolicies {
  policies {
    id
    title
    url
    type
  }
}
    `;

/**
 * __useGetPoliciesQuery__
 *
 * To run a query within a React component, call `useGetPoliciesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPoliciesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPoliciesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPoliciesQuery(baseOptions?: Apollo.QueryHookOptions<GetPoliciesQuery, GetPoliciesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPoliciesQuery, GetPoliciesQueryVariables>(GetPoliciesDocument, options);
      }
export function useGetPoliciesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPoliciesQuery, GetPoliciesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPoliciesQuery, GetPoliciesQueryVariables>(GetPoliciesDocument, options);
        }
export type GetPoliciesQueryHookResult = ReturnType<typeof useGetPoliciesQuery>;
export type GetPoliciesLazyQueryHookResult = ReturnType<typeof useGetPoliciesLazyQuery>;
export type GetPoliciesQueryResult = Apollo.QueryResult<GetPoliciesQuery, GetPoliciesQueryVariables>;
export const GetGuidelinesDocument = gql`
    query GetGuidelines {
  guidelines {
    id
    title
    url
    type
  }
}
    `;

/**
 * __useGetGuidelinesQuery__
 *
 * To run a query within a React component, call `useGetGuidelinesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGuidelinesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGuidelinesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetGuidelinesQuery(baseOptions?: Apollo.QueryHookOptions<GetGuidelinesQuery, GetGuidelinesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGuidelinesQuery, GetGuidelinesQueryVariables>(GetGuidelinesDocument, options);
      }
export function useGetGuidelinesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGuidelinesQuery, GetGuidelinesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGuidelinesQuery, GetGuidelinesQueryVariables>(GetGuidelinesDocument, options);
        }
export type GetGuidelinesQueryHookResult = ReturnType<typeof useGetGuidelinesQuery>;
export type GetGuidelinesLazyQueryHookResult = ReturnType<typeof useGetGuidelinesLazyQuery>;
export type GetGuidelinesQueryResult = Apollo.QueryResult<GetGuidelinesQuery, GetGuidelinesQueryVariables>;
export const CreateGoverningDocumentDocument = gql`
    mutation CreateGoverningDocument($title: String!, $url: String!, $type: GoverningDocumentType!) {
  governingDocument {
    create(input: {title: $title, url: $url, type: $type}) {
      title
      url
      type
    }
  }
}
    `;
export type CreateGoverningDocumentMutationFn = Apollo.MutationFunction<CreateGoverningDocumentMutation, CreateGoverningDocumentMutationVariables>;

/**
 * __useCreateGoverningDocumentMutation__
 *
 * To run a mutation, you first call `useCreateGoverningDocumentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateGoverningDocumentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createGoverningDocumentMutation, { data, loading, error }] = useCreateGoverningDocumentMutation({
 *   variables: {
 *      title: // value for 'title'
 *      url: // value for 'url'
 *      type: // value for 'type'
 *   },
 * });
 */
export function useCreateGoverningDocumentMutation(baseOptions?: Apollo.MutationHookOptions<CreateGoverningDocumentMutation, CreateGoverningDocumentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateGoverningDocumentMutation, CreateGoverningDocumentMutationVariables>(CreateGoverningDocumentDocument, options);
      }
export type CreateGoverningDocumentMutationHookResult = ReturnType<typeof useCreateGoverningDocumentMutation>;
export type CreateGoverningDocumentMutationResult = Apollo.MutationResult<CreateGoverningDocumentMutation>;
export type CreateGoverningDocumentMutationOptions = Apollo.BaseMutationOptions<CreateGoverningDocumentMutation, CreateGoverningDocumentMutationVariables>;
export const UpdateGoverningDocumentDocument = gql`
    mutation UpdateGoverningDocument($input: UpdateGoverningDocument!) {
  governingDocument {
    update(input: $input) {
      id
      title
      url
      type
    }
  }
}
    `;
export type UpdateGoverningDocumentMutationFn = Apollo.MutationFunction<UpdateGoverningDocumentMutation, UpdateGoverningDocumentMutationVariables>;

/**
 * __useUpdateGoverningDocumentMutation__
 *
 * To run a mutation, you first call `useUpdateGoverningDocumentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateGoverningDocumentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateGoverningDocumentMutation, { data, loading, error }] = useUpdateGoverningDocumentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateGoverningDocumentMutation(baseOptions?: Apollo.MutationHookOptions<UpdateGoverningDocumentMutation, UpdateGoverningDocumentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateGoverningDocumentMutation, UpdateGoverningDocumentMutationVariables>(UpdateGoverningDocumentDocument, options);
      }
export type UpdateGoverningDocumentMutationHookResult = ReturnType<typeof useUpdateGoverningDocumentMutation>;
export type UpdateGoverningDocumentMutationResult = Apollo.MutationResult<UpdateGoverningDocumentMutation>;
export type UpdateGoverningDocumentMutationOptions = Apollo.BaseMutationOptions<UpdateGoverningDocumentMutation, UpdateGoverningDocumentMutationVariables>;
export const DeleteGoverningDocumentDocument = gql`
    mutation DeleteGoverningDocument($id: UUID!) {
  governingDocument {
    delete(id: $id)
  }
}
    `;
export type DeleteGoverningDocumentMutationFn = Apollo.MutationFunction<DeleteGoverningDocumentMutation, DeleteGoverningDocumentMutationVariables>;

/**
 * __useDeleteGoverningDocumentMutation__
 *
 * To run a mutation, you first call `useDeleteGoverningDocumentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteGoverningDocumentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteGoverningDocumentMutation, { data, loading, error }] = useDeleteGoverningDocumentMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteGoverningDocumentMutation(baseOptions?: Apollo.MutationHookOptions<DeleteGoverningDocumentMutation, DeleteGoverningDocumentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteGoverningDocumentMutation, DeleteGoverningDocumentMutationVariables>(DeleteGoverningDocumentDocument, options);
      }
export type DeleteGoverningDocumentMutationHookResult = ReturnType<typeof useDeleteGoverningDocumentMutation>;
export type DeleteGoverningDocumentMutationResult = Apollo.MutationResult<DeleteGoverningDocumentMutation>;
export type DeleteGoverningDocumentMutationOptions = Apollo.BaseMutationOptions<DeleteGoverningDocumentMutation, DeleteGoverningDocumentMutationVariables>;
export const GetMailAliasesDocument = gql`
    query GetMailAliases {
  aliases {
    email
    policies {
      id
      position {
        id
        name
      }
      canSend
    }
  }
}
    `;

/**
 * __useGetMailAliasesQuery__
 *
 * To run a query within a React component, call `useGetMailAliasesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMailAliasesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMailAliasesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMailAliasesQuery(baseOptions?: Apollo.QueryHookOptions<GetMailAliasesQuery, GetMailAliasesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMailAliasesQuery, GetMailAliasesQueryVariables>(GetMailAliasesDocument, options);
      }
export function useGetMailAliasesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMailAliasesQuery, GetMailAliasesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMailAliasesQuery, GetMailAliasesQueryVariables>(GetMailAliasesDocument, options);
        }
export type GetMailAliasesQueryHookResult = ReturnType<typeof useGetMailAliasesQuery>;
export type GetMailAliasesLazyQueryHookResult = ReturnType<typeof useGetMailAliasesLazyQuery>;
export type GetMailAliasesQueryResult = Apollo.QueryResult<GetMailAliasesQuery, GetMailAliasesQueryVariables>;
export const GetMailAliasDocument = gql`
    query GetMailAlias($email: String!) {
  alias(email: $email) {
    email
    policies {
      id
      position {
        id
        name
      }
      canSend
    }
  }
}
    `;

/**
 * __useGetMailAliasQuery__
 *
 * To run a query within a React component, call `useGetMailAliasQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMailAliasQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMailAliasQuery({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useGetMailAliasQuery(baseOptions: Apollo.QueryHookOptions<GetMailAliasQuery, GetMailAliasQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMailAliasQuery, GetMailAliasQueryVariables>(GetMailAliasDocument, options);
      }
export function useGetMailAliasLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMailAliasQuery, GetMailAliasQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMailAliasQuery, GetMailAliasQueryVariables>(GetMailAliasDocument, options);
        }
export type GetMailAliasQueryHookResult = ReturnType<typeof useGetMailAliasQuery>;
export type GetMailAliasLazyQueryHookResult = ReturnType<typeof useGetMailAliasLazyQuery>;
export type GetMailAliasQueryResult = Apollo.QueryResult<GetMailAliasQuery, GetMailAliasQueryVariables>;
export const RemoveMailAliasDocument = gql`
    mutation RemoveMailAlias($id: UUID!) {
  alias {
    remove(id: $id) {
      email
    }
  }
}
    `;
export type RemoveMailAliasMutationFn = Apollo.MutationFunction<RemoveMailAliasMutation, RemoveMailAliasMutationVariables>;

/**
 * __useRemoveMailAliasMutation__
 *
 * To run a mutation, you first call `useRemoveMailAliasMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveMailAliasMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeMailAliasMutation, { data, loading, error }] = useRemoveMailAliasMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveMailAliasMutation(baseOptions?: Apollo.MutationHookOptions<RemoveMailAliasMutation, RemoveMailAliasMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveMailAliasMutation, RemoveMailAliasMutationVariables>(RemoveMailAliasDocument, options);
      }
export type RemoveMailAliasMutationHookResult = ReturnType<typeof useRemoveMailAliasMutation>;
export type RemoveMailAliasMutationResult = Apollo.MutationResult<RemoveMailAliasMutation>;
export type RemoveMailAliasMutationOptions = Apollo.BaseMutationOptions<RemoveMailAliasMutation, RemoveMailAliasMutationVariables>;
export const CreateMailAliasDocument = gql`
    mutation CreateMailAlias($email: String!, $position_id: String!) {
  alias {
    create(input: {email: $email, position_id: $position_id}) {
      email
    }
  }
}
    `;
export type CreateMailAliasMutationFn = Apollo.MutationFunction<CreateMailAliasMutation, CreateMailAliasMutationVariables>;

/**
 * __useCreateMailAliasMutation__
 *
 * To run a mutation, you first call `useCreateMailAliasMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMailAliasMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMailAliasMutation, { data, loading, error }] = useCreateMailAliasMutation({
 *   variables: {
 *      email: // value for 'email'
 *      position_id: // value for 'position_id'
 *   },
 * });
 */
export function useCreateMailAliasMutation(baseOptions?: Apollo.MutationHookOptions<CreateMailAliasMutation, CreateMailAliasMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMailAliasMutation, CreateMailAliasMutationVariables>(CreateMailAliasDocument, options);
      }
export type CreateMailAliasMutationHookResult = ReturnType<typeof useCreateMailAliasMutation>;
export type CreateMailAliasMutationResult = Apollo.MutationResult<CreateMailAliasMutation>;
export type CreateMailAliasMutationOptions = Apollo.BaseMutationOptions<CreateMailAliasMutation, CreateMailAliasMutationVariables>;
export const UpdateSenderStatusDocument = gql`
    mutation UpdateSenderStatus($input: [MailAliasStatus!]!) {
  alias {
    updateSenderStatus(input: $input)
  }
}
    `;
export type UpdateSenderStatusMutationFn = Apollo.MutationFunction<UpdateSenderStatusMutation, UpdateSenderStatusMutationVariables>;

/**
 * __useUpdateSenderStatusMutation__
 *
 * To run a mutation, you first call `useUpdateSenderStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSenderStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSenderStatusMutation, { data, loading, error }] = useUpdateSenderStatusMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateSenderStatusMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSenderStatusMutation, UpdateSenderStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSenderStatusMutation, UpdateSenderStatusMutationVariables>(UpdateSenderStatusDocument, options);
      }
export type UpdateSenderStatusMutationHookResult = ReturnType<typeof useUpdateSenderStatusMutation>;
export type UpdateSenderStatusMutationResult = Apollo.MutationResult<UpdateSenderStatusMutation>;
export type UpdateSenderStatusMutationOptions = Apollo.BaseMutationOptions<UpdateSenderStatusMutation, UpdateSenderStatusMutationVariables>;
export const ResolveRecipientsEmailDocument = gql`
    query ResolveRecipientsEmail {
  resolveRecipients {
    alias
    emailUsers {
      email
    }
  }
}
    `;

/**
 * __useResolveRecipientsEmailQuery__
 *
 * To run a query within a React component, call `useResolveRecipientsEmailQuery` and pass it any options that fit your needs.
 * When your component renders, `useResolveRecipientsEmailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useResolveRecipientsEmailQuery({
 *   variables: {
 *   },
 * });
 */
export function useResolveRecipientsEmailQuery(baseOptions?: Apollo.QueryHookOptions<ResolveRecipientsEmailQuery, ResolveRecipientsEmailQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ResolveRecipientsEmailQuery, ResolveRecipientsEmailQueryVariables>(ResolveRecipientsEmailDocument, options);
      }
export function useResolveRecipientsEmailLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ResolveRecipientsEmailQuery, ResolveRecipientsEmailQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ResolveRecipientsEmailQuery, ResolveRecipientsEmailQueryVariables>(ResolveRecipientsEmailDocument, options);
        }
export type ResolveRecipientsEmailQueryHookResult = ReturnType<typeof useResolveRecipientsEmailQuery>;
export type ResolveRecipientsEmailLazyQueryHookResult = ReturnType<typeof useResolveRecipientsEmailLazyQuery>;
export type ResolveRecipientsEmailQueryResult = Apollo.QueryResult<ResolveRecipientsEmailQuery, ResolveRecipientsEmailQueryVariables>;
export const ResolveSendersStudentIdDocument = gql`
    query ResolveSendersStudentId {
  resolveSenders {
    alias
    emailUsers {
      studentId
    }
  }
}
    `;

/**
 * __useResolveSendersStudentIdQuery__
 *
 * To run a query within a React component, call `useResolveSendersStudentIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useResolveSendersStudentIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useResolveSendersStudentIdQuery({
 *   variables: {
 *   },
 * });
 */
export function useResolveSendersStudentIdQuery(baseOptions?: Apollo.QueryHookOptions<ResolveSendersStudentIdQuery, ResolveSendersStudentIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ResolveSendersStudentIdQuery, ResolveSendersStudentIdQueryVariables>(ResolveSendersStudentIdDocument, options);
      }
export function useResolveSendersStudentIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ResolveSendersStudentIdQuery, ResolveSendersStudentIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ResolveSendersStudentIdQuery, ResolveSendersStudentIdQueryVariables>(ResolveSendersStudentIdDocument, options);
        }
export type ResolveSendersStudentIdQueryHookResult = ReturnType<typeof useResolveSendersStudentIdQuery>;
export type ResolveSendersStudentIdLazyQueryHookResult = ReturnType<typeof useResolveSendersStudentIdLazyQuery>;
export type ResolveSendersStudentIdQueryResult = Apollo.QueryResult<ResolveSendersStudentIdQuery, ResolveSendersStudentIdQueryVariables>;
export const SpecialSendersDocument = gql`
    query SpecialSenders($alias: String!) {
  specialSenders(alias: $alias) {
    id
    studentId
    keycloakId
  }
}
    `;

/**
 * __useSpecialSendersQuery__
 *
 * To run a query within a React component, call `useSpecialSendersQuery` and pass it any options that fit your needs.
 * When your component renders, `useSpecialSendersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSpecialSendersQuery({
 *   variables: {
 *      alias: // value for 'alias'
 *   },
 * });
 */
export function useSpecialSendersQuery(baseOptions: Apollo.QueryHookOptions<SpecialSendersQuery, SpecialSendersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SpecialSendersQuery, SpecialSendersQueryVariables>(SpecialSendersDocument, options);
      }
export function useSpecialSendersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SpecialSendersQuery, SpecialSendersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SpecialSendersQuery, SpecialSendersQueryVariables>(SpecialSendersDocument, options);
        }
export type SpecialSendersQueryHookResult = ReturnType<typeof useSpecialSendersQuery>;
export type SpecialSendersLazyQueryHookResult = ReturnType<typeof useSpecialSendersLazyQuery>;
export type SpecialSendersQueryResult = Apollo.QueryResult<SpecialSendersQuery, SpecialSendersQueryVariables>;
export const CreateSpecialSenderDocument = gql`
    mutation CreateSpecialSender($input: CreateSpecialSender!) {
  specialSender {
    create(input: $input) {
      id
      studentId
      keycloakId
    }
  }
}
    `;
export type CreateSpecialSenderMutationFn = Apollo.MutationFunction<CreateSpecialSenderMutation, CreateSpecialSenderMutationVariables>;

/**
 * __useCreateSpecialSenderMutation__
 *
 * To run a mutation, you first call `useCreateSpecialSenderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSpecialSenderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSpecialSenderMutation, { data, loading, error }] = useCreateSpecialSenderMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSpecialSenderMutation(baseOptions?: Apollo.MutationHookOptions<CreateSpecialSenderMutation, CreateSpecialSenderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSpecialSenderMutation, CreateSpecialSenderMutationVariables>(CreateSpecialSenderDocument, options);
      }
export type CreateSpecialSenderMutationHookResult = ReturnType<typeof useCreateSpecialSenderMutation>;
export type CreateSpecialSenderMutationResult = Apollo.MutationResult<CreateSpecialSenderMutation>;
export type CreateSpecialSenderMutationOptions = Apollo.BaseMutationOptions<CreateSpecialSenderMutation, CreateSpecialSenderMutationVariables>;
export const RemoveSpecialSenderDocument = gql`
    mutation RemoveSpecialSender($id: UUID!) {
  specialSender {
    remove(id: $id) {
      id
    }
  }
}
    `;
export type RemoveSpecialSenderMutationFn = Apollo.MutationFunction<RemoveSpecialSenderMutation, RemoveSpecialSenderMutationVariables>;

/**
 * __useRemoveSpecialSenderMutation__
 *
 * To run a mutation, you first call `useRemoveSpecialSenderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveSpecialSenderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeSpecialSenderMutation, { data, loading, error }] = useRemoveSpecialSenderMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveSpecialSenderMutation(baseOptions?: Apollo.MutationHookOptions<RemoveSpecialSenderMutation, RemoveSpecialSenderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveSpecialSenderMutation, RemoveSpecialSenderMutationVariables>(RemoveSpecialSenderDocument, options);
      }
export type RemoveSpecialSenderMutationHookResult = ReturnType<typeof useRemoveSpecialSenderMutation>;
export type RemoveSpecialSenderMutationResult = Apollo.MutationResult<RemoveSpecialSenderMutation>;
export type RemoveSpecialSenderMutationOptions = Apollo.BaseMutationOptions<RemoveSpecialSenderMutation, RemoveSpecialSenderMutationVariables>;
export const SpecialReceiversDocument = gql`
    query SpecialReceivers($alias: String!) {
  specialReceivers(alias: $alias) {
    id
    targetEmail
  }
}
    `;

/**
 * __useSpecialReceiversQuery__
 *
 * To run a query within a React component, call `useSpecialReceiversQuery` and pass it any options that fit your needs.
 * When your component renders, `useSpecialReceiversQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSpecialReceiversQuery({
 *   variables: {
 *      alias: // value for 'alias'
 *   },
 * });
 */
export function useSpecialReceiversQuery(baseOptions: Apollo.QueryHookOptions<SpecialReceiversQuery, SpecialReceiversQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SpecialReceiversQuery, SpecialReceiversQueryVariables>(SpecialReceiversDocument, options);
      }
export function useSpecialReceiversLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SpecialReceiversQuery, SpecialReceiversQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SpecialReceiversQuery, SpecialReceiversQueryVariables>(SpecialReceiversDocument, options);
        }
export type SpecialReceiversQueryHookResult = ReturnType<typeof useSpecialReceiversQuery>;
export type SpecialReceiversLazyQueryHookResult = ReturnType<typeof useSpecialReceiversLazyQuery>;
export type SpecialReceiversQueryResult = Apollo.QueryResult<SpecialReceiversQuery, SpecialReceiversQueryVariables>;
export const CreateSpecialReceiverDocument = gql`
    mutation CreateSpecialReceiver($input: CreateSpecialReceiver!) {
  specialReceiver {
    create(input: $input) {
      id
      targetEmail
    }
  }
}
    `;
export type CreateSpecialReceiverMutationFn = Apollo.MutationFunction<CreateSpecialReceiverMutation, CreateSpecialReceiverMutationVariables>;

/**
 * __useCreateSpecialReceiverMutation__
 *
 * To run a mutation, you first call `useCreateSpecialReceiverMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSpecialReceiverMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSpecialReceiverMutation, { data, loading, error }] = useCreateSpecialReceiverMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSpecialReceiverMutation(baseOptions?: Apollo.MutationHookOptions<CreateSpecialReceiverMutation, CreateSpecialReceiverMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSpecialReceiverMutation, CreateSpecialReceiverMutationVariables>(CreateSpecialReceiverDocument, options);
      }
export type CreateSpecialReceiverMutationHookResult = ReturnType<typeof useCreateSpecialReceiverMutation>;
export type CreateSpecialReceiverMutationResult = Apollo.MutationResult<CreateSpecialReceiverMutation>;
export type CreateSpecialReceiverMutationOptions = Apollo.BaseMutationOptions<CreateSpecialReceiverMutation, CreateSpecialReceiverMutationVariables>;
export const RemoveSpecialReceiverDocument = gql`
    mutation RemoveSpecialReceiver($id: UUID!) {
  specialReceiver {
    remove(id: $id) {
      id
    }
  }
}
    `;
export type RemoveSpecialReceiverMutationFn = Apollo.MutationFunction<RemoveSpecialReceiverMutation, RemoveSpecialReceiverMutationVariables>;

/**
 * __useRemoveSpecialReceiverMutation__
 *
 * To run a mutation, you first call `useRemoveSpecialReceiverMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveSpecialReceiverMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeSpecialReceiverMutation, { data, loading, error }] = useRemoveSpecialReceiverMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveSpecialReceiverMutation(baseOptions?: Apollo.MutationHookOptions<RemoveSpecialReceiverMutation, RemoveSpecialReceiverMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveSpecialReceiverMutation, RemoveSpecialReceiverMutationVariables>(RemoveSpecialReceiverDocument, options);
      }
export type RemoveSpecialReceiverMutationHookResult = ReturnType<typeof useRemoveSpecialReceiverMutation>;
export type RemoveSpecialReceiverMutationResult = Apollo.MutationResult<RemoveSpecialReceiverMutation>;
export type RemoveSpecialReceiverMutationOptions = Apollo.BaseMutationOptions<RemoveSpecialReceiverMutation, RemoveSpecialReceiverMutationVariables>;
export const AllEmailsDocument = gql`
    query AllEmails {
  allEmails
}
    `;

/**
 * __useAllEmailsQuery__
 *
 * To run a query within a React component, call `useAllEmailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllEmailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllEmailsQuery({
 *   variables: {
 *   },
 * });
 */
export function useAllEmailsQuery(baseOptions?: Apollo.QueryHookOptions<AllEmailsQuery, AllEmailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllEmailsQuery, AllEmailsQueryVariables>(AllEmailsDocument, options);
      }
export function useAllEmailsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllEmailsQuery, AllEmailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllEmailsQuery, AllEmailsQueryVariables>(AllEmailsDocument, options);
        }
export type AllEmailsQueryHookResult = ReturnType<typeof useAllEmailsQuery>;
export type AllEmailsLazyQueryHookResult = ReturnType<typeof useAllEmailsLazyQuery>;
export type AllEmailsQueryResult = Apollo.QueryResult<AllEmailsQuery, AllEmailsQueryVariables>;
export const GetMandatesByPeriodDocument = gql`
    query GetMandatesByPeriod($page: Int!, $perPage: Int!, $start_date: Date, $end_date: Date) {
  mandatePagination(
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
        student_id
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
    student_id
    first_name
    nickname
    last_name
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
      student_id
      first_name
      nickname
      last_name
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
    query MemberPage($id: UUID, $student_id: String) {
  member(id: $id, student_id: $student_id) {
    id
    student_id
    first_name
    nickname
    last_name
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
        committee {
          name
        }
      }
    }
    activeMandates: mandates(onlyActive: true) {
      position {
        id
        name
        nameEn
        email
        committee {
          name
        }
      }
    }
    canPing
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
 *      student_id: // value for 'student_id'
 *   },
 * });
 */
export function useMemberPageQuery(baseOptions?: Apollo.QueryHookOptions<MemberPageQuery, MemberPageQueryVariables>) {
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
      student_id
      first_name
      last_name
      class_programme
      class_year
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
export const PingMemberDocument = gql`
    mutation PingMember($id: UUID!) {
  member {
    ping(id: $id)
  }
}
    `;
export type PingMemberMutationFn = Apollo.MutationFunction<PingMemberMutation, PingMemberMutationVariables>;

/**
 * __usePingMemberMutation__
 *
 * To run a mutation, you first call `usePingMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePingMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [pingMemberMutation, { data, loading, error }] = usePingMemberMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePingMemberMutation(baseOptions?: Apollo.MutationHookOptions<PingMemberMutation, PingMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PingMemberMutation, PingMemberMutationVariables>(PingMemberDocument, options);
      }
export type PingMemberMutationHookResult = ReturnType<typeof usePingMemberMutation>;
export type PingMemberMutationResult = Apollo.MutationResult<PingMemberMutation>;
export type PingMemberMutationOptions = Apollo.BaseMutationOptions<PingMemberMutation, PingMemberMutationVariables>;
export const NewsPageDocument = gql`
    query NewsPage($page_number: Int!, $per_page: Int!, $tagIds: [String!]) {
  news(page: $page_number, perPage: $per_page, tagIds: $tagIds) {
    articles {
      id
      slug
      header
      headerEn
      body
      bodyEn
      isLikedByMe
      author {
        __typename
        ... on Member {
          id
          student_id
          first_name
          nickname
          last_name
          picture_path
        }
        ... on Mandate {
          member {
            id
            student_id
            first_name
            nickname
            last_name
            picture_path
          }
          position {
            id
            name
          }
        }
      }
      imageUrl
      publishedDatetime
      createdDatetime
      status
      latestEditDatetime
      tags {
        id
        name
        nameEn
        color
        isDefault
      }
      comments {
        id
        published
        content
        member {
          id
          student_id
          first_name
          last_name
          nickname
          picture_path
        }
      }
      likers {
        id
        student_id
        first_name
        last_name
        nickname
        picture_path
      }
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
 *      tagIds: // value for 'tagIds'
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
    query Article($id: UUID, $slug: String) {
  article(id: $id, slug: $slug) {
    id
    slug
    body
    bodyEn
    header
    headerEn
    isLikedByMe
    author {
      __typename
      ... on Member {
        id
        student_id
        first_name
        nickname
        last_name
        picture_path
      }
      ... on Mandate {
        member {
          id
          student_id
          first_name
          nickname
          last_name
          picture_path
        }
        position {
          id
          name
        }
      }
    }
    status
    handledBy {
      id
      student_id
      first_name
      nickname
      last_name
      picture_path
    }
    imageUrl
    publishedDatetime
    createdDatetime
    tags {
      id
      name
      nameEn
      color
      isDefault
    }
    comments {
      id
      content
      published
      member {
        id
        student_id
        first_name
        last_name
        nickname
        picture_path
      }
    }
    likers {
      id
      student_id
      first_name
      last_name
      nickname
      picture_path
    }
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
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useArticleQuery(baseOptions?: Apollo.QueryHookOptions<ArticleQuery, ArticleQueryVariables>) {
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
    slug
    body
    bodyEn
    header
    headerEn
    author {
      __typename
      ... on Member {
        id
        student_id
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
        picture_path
      }
      ... on Mandate {
        id
        member {
          id
          student_id
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
          picture_path
        }
        position {
          id
          name
        }
      }
    }
    imageUrl
    publishedDatetime
    tags {
      id
      name
      nameEn
      color
      isDefault
    }
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
export const ArticleRequestsDocument = gql`
    query ArticleRequests {
  articleRequests {
    id
    slug
    body
    bodyEn
    header
    headerEn
    status
    author {
      __typename
      ... on Member {
        id
        student_id
        first_name
        nickname
        last_name
        picture_path
      }
      ... on Mandate {
        member {
          id
          student_id
          first_name
          nickname
          last_name
          picture_path
        }
        position {
          id
          name
        }
        start_date
        end_date
      }
    }
    imageUrl
    createdDatetime
    publishedDatetime
    tags {
      id
      name
      nameEn
      color
      isDefault
    }
  }
}
    `;

/**
 * __useArticleRequestsQuery__
 *
 * To run a query within a React component, call `useArticleRequestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useArticleRequestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useArticleRequestsQuery({
 *   variables: {
 *   },
 * });
 */
export function useArticleRequestsQuery(baseOptions?: Apollo.QueryHookOptions<ArticleRequestsQuery, ArticleRequestsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ArticleRequestsQuery, ArticleRequestsQueryVariables>(ArticleRequestsDocument, options);
      }
export function useArticleRequestsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ArticleRequestsQuery, ArticleRequestsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ArticleRequestsQuery, ArticleRequestsQueryVariables>(ArticleRequestsDocument, options);
        }
export type ArticleRequestsQueryHookResult = ReturnType<typeof useArticleRequestsQuery>;
export type ArticleRequestsLazyQueryHookResult = ReturnType<typeof useArticleRequestsLazyQuery>;
export type ArticleRequestsQueryResult = Apollo.QueryResult<ArticleRequestsQuery, ArticleRequestsQueryVariables>;
export const RejectedRequestsDocument = gql`
    query RejectedRequests($page: Int!, $perPage: Int!) {
  rejectedRequests(page: $page, perPage: $perPage) {
    articles {
      id
      slug
      body
      bodyEn
      header
      headerEn
      status
      author {
        __typename
        ... on Member {
          id
          student_id
          first_name
          nickname
          last_name
          picture_path
        }
        ... on Mandate {
          member {
            id
            student_id
            first_name
            nickname
            last_name
            picture_path
          }
          position {
            id
            name
          }
          start_date
          end_date
        }
      }
      imageUrl
      createdDatetime
      rejectedDatetime
      rejectionReason
      handledBy {
        id
        student_id
        first_name
        nickname
        last_name
        picture_path
      }
      publishedDatetime
      tags {
        id
        name
        nameEn
        color
        isDefault
      }
    }
    pageInfo {
      totalPages
    }
  }
}
    `;

/**
 * __useRejectedRequestsQuery__
 *
 * To run a query within a React component, call `useRejectedRequestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useRejectedRequestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRejectedRequestsQuery({
 *   variables: {
 *      page: // value for 'page'
 *      perPage: // value for 'perPage'
 *   },
 * });
 */
export function useRejectedRequestsQuery(baseOptions: Apollo.QueryHookOptions<RejectedRequestsQuery, RejectedRequestsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RejectedRequestsQuery, RejectedRequestsQueryVariables>(RejectedRequestsDocument, options);
      }
export function useRejectedRequestsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RejectedRequestsQuery, RejectedRequestsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RejectedRequestsQuery, RejectedRequestsQueryVariables>(RejectedRequestsDocument, options);
        }
export type RejectedRequestsQueryHookResult = ReturnType<typeof useRejectedRequestsQuery>;
export type RejectedRequestsLazyQueryHookResult = ReturnType<typeof useRejectedRequestsLazyQuery>;
export type RejectedRequestsQueryResult = Apollo.QueryResult<RejectedRequestsQuery, RejectedRequestsQueryVariables>;
export const ApproveRequestDocument = gql`
    mutation ApproveRequest($id: UUID!) {
  requests {
    approve(id: $id) {
      id
    }
  }
}
    `;
export type ApproveRequestMutationFn = Apollo.MutationFunction<ApproveRequestMutation, ApproveRequestMutationVariables>;

/**
 * __useApproveRequestMutation__
 *
 * To run a mutation, you first call `useApproveRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useApproveRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [approveRequestMutation, { data, loading, error }] = useApproveRequestMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useApproveRequestMutation(baseOptions?: Apollo.MutationHookOptions<ApproveRequestMutation, ApproveRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ApproveRequestMutation, ApproveRequestMutationVariables>(ApproveRequestDocument, options);
      }
export type ApproveRequestMutationHookResult = ReturnType<typeof useApproveRequestMutation>;
export type ApproveRequestMutationResult = Apollo.MutationResult<ApproveRequestMutation>;
export type ApproveRequestMutationOptions = Apollo.BaseMutationOptions<ApproveRequestMutation, ApproveRequestMutationVariables>;
export const RejectRequestDocument = gql`
    mutation RejectRequest($id: UUID!, $reason: String) {
  requests {
    reject(id: $id, reason: $reason) {
      id
    }
  }
}
    `;
export type RejectRequestMutationFn = Apollo.MutationFunction<RejectRequestMutation, RejectRequestMutationVariables>;

/**
 * __useRejectRequestMutation__
 *
 * To run a mutation, you first call `useRejectRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRejectRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [rejectRequestMutation, { data, loading, error }] = useRejectRequestMutation({
 *   variables: {
 *      id: // value for 'id'
 *      reason: // value for 'reason'
 *   },
 * });
 */
export function useRejectRequestMutation(baseOptions?: Apollo.MutationHookOptions<RejectRequestMutation, RejectRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RejectRequestMutation, RejectRequestMutationVariables>(RejectRequestDocument, options);
      }
export type RejectRequestMutationHookResult = ReturnType<typeof useRejectRequestMutation>;
export type RejectRequestMutationResult = Apollo.MutationResult<RejectRequestMutation>;
export type RejectRequestMutationOptions = Apollo.BaseMutationOptions<RejectRequestMutation, RejectRequestMutationVariables>;
export const UndoRejectionDocument = gql`
    mutation UndoRejection($id: UUID!) {
  requests {
    undoRejection(id: $id) {
      id
    }
  }
}
    `;
export type UndoRejectionMutationFn = Apollo.MutationFunction<UndoRejectionMutation, UndoRejectionMutationVariables>;

/**
 * __useUndoRejectionMutation__
 *
 * To run a mutation, you first call `useUndoRejectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUndoRejectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [undoRejectionMutation, { data, loading, error }] = useUndoRejectionMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUndoRejectionMutation(baseOptions?: Apollo.MutationHookOptions<UndoRejectionMutation, UndoRejectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UndoRejectionMutation, UndoRejectionMutationVariables>(UndoRejectionDocument, options);
      }
export type UndoRejectionMutationHookResult = ReturnType<typeof useUndoRejectionMutation>;
export type UndoRejectionMutationResult = Apollo.MutationResult<UndoRejectionMutation>;
export type UndoRejectionMutationOptions = Apollo.BaseMutationOptions<UndoRejectionMutation, UndoRejectionMutationVariables>;
export const UpdateArticleDocument = gql`
    mutation UpdateArticle($id: UUID!, $header: String, $body: String, $headerEn: String, $bodyEn: String, $imageName: String, $mandateId: UUID, $tagIds: [UUID!]) {
  article {
    update(
      id: $id
      input: {header: $header, body: $body, headerEn: $headerEn, bodyEn: $bodyEn, imageName: $imageName, mandateId: $mandateId, tagIds: $tagIds}
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
 *      tagIds: // value for 'tagIds'
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
    mutation CreateArticle($header: String!, $body: String!, $headerEn: String!, $bodyEn: String!, $imageName: String, $mandateId: UUID, $tagIds: [UUID!], $sendNotification: Boolean, $notificationBody: String, $notificationBodyEn: String) {
  article {
    create(
      input: {header: $header, body: $body, headerEn: $headerEn, bodyEn: $bodyEn, imageName: $imageName, mandateId: $mandateId, tagIds: $tagIds, sendNotification: $sendNotification, notificationBody: $notificationBody, notificationBodyEn: $notificationBodyEn}
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
 *      tagIds: // value for 'tagIds'
 *      sendNotification: // value for 'sendNotification'
 *      notificationBody: // value for 'notificationBody'
 *      notificationBodyEn: // value for 'notificationBodyEn'
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
export const UnlikeArticleDocument = gql`
    mutation UnlikeArticle($id: UUID!) {
  article {
    unlike(id: $id) {
      article {
        id
      }
    }
  }
}
    `;
export type UnlikeArticleMutationFn = Apollo.MutationFunction<UnlikeArticleMutation, UnlikeArticleMutationVariables>;

/**
 * __useUnlikeArticleMutation__
 *
 * To run a mutation, you first call `useUnlikeArticleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnlikeArticleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unlikeArticleMutation, { data, loading, error }] = useUnlikeArticleMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUnlikeArticleMutation(baseOptions?: Apollo.MutationHookOptions<UnlikeArticleMutation, UnlikeArticleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnlikeArticleMutation, UnlikeArticleMutationVariables>(UnlikeArticleDocument, options);
      }
export type UnlikeArticleMutationHookResult = ReturnType<typeof useUnlikeArticleMutation>;
export type UnlikeArticleMutationResult = Apollo.MutationResult<UnlikeArticleMutation>;
export type UnlikeArticleMutationOptions = Apollo.BaseMutationOptions<UnlikeArticleMutation, UnlikeArticleMutationVariables>;
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
export const CommentArticleDocument = gql`
    mutation CommentArticle($id: UUID!, $content: String!) {
  article {
    comment(id: $id, content: $content) {
      article {
        id
        comments {
          id
          content
          published
          member {
            id
            student_id
            first_name
            last_name
            nickname
            picture_path
          }
        }
        likers {
          id
          student_id
          first_name
          last_name
          nickname
          picture_path
        }
      }
    }
  }
}
    `;
export type CommentArticleMutationFn = Apollo.MutationFunction<CommentArticleMutation, CommentArticleMutationVariables>;

/**
 * __useCommentArticleMutation__
 *
 * To run a mutation, you first call `useCommentArticleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCommentArticleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [commentArticleMutation, { data, loading, error }] = useCommentArticleMutation({
 *   variables: {
 *      id: // value for 'id'
 *      content: // value for 'content'
 *   },
 * });
 */
export function useCommentArticleMutation(baseOptions?: Apollo.MutationHookOptions<CommentArticleMutation, CommentArticleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CommentArticleMutation, CommentArticleMutationVariables>(CommentArticleDocument, options);
      }
export type CommentArticleMutationHookResult = ReturnType<typeof useCommentArticleMutation>;
export type CommentArticleMutationResult = Apollo.MutationResult<CommentArticleMutation>;
export type CommentArticleMutationOptions = Apollo.BaseMutationOptions<CommentArticleMutation, CommentArticleMutationVariables>;
export const RemoveCommentDocument = gql`
    mutation RemoveComment($commentId: UUID!) {
  article {
    removeComment(commentId: $commentId) {
      article {
        id
        comments {
          id
          content
          published
          member {
            id
            student_id
            first_name
            last_name
            nickname
            picture_path
          }
        }
        likers {
          id
          student_id
          first_name
          last_name
          nickname
          picture_path
        }
      }
    }
  }
}
    `;
export type RemoveCommentMutationFn = Apollo.MutationFunction<RemoveCommentMutation, RemoveCommentMutationVariables>;

/**
 * __useRemoveCommentMutation__
 *
 * To run a mutation, you first call `useRemoveCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeCommentMutation, { data, loading, error }] = useRemoveCommentMutation({
 *   variables: {
 *      commentId: // value for 'commentId'
 *   },
 * });
 */
export function useRemoveCommentMutation(baseOptions?: Apollo.MutationHookOptions<RemoveCommentMutation, RemoveCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveCommentMutation, RemoveCommentMutationVariables>(RemoveCommentDocument, options);
      }
export type RemoveCommentMutationHookResult = ReturnType<typeof useRemoveCommentMutation>;
export type RemoveCommentMutationResult = Apollo.MutationResult<RemoveCommentMutation>;
export type RemoveCommentMutationOptions = Apollo.BaseMutationOptions<RemoveCommentMutation, RemoveCommentMutationVariables>;
export const GetUploadDataDocument = gql`
    mutation getUploadData($fileName: String!, $header: String!) {
  article {
    getUploadData(fileName: $fileName, header: $header) {
      uploadUrl
    }
  }
}
    `;
export type GetUploadDataMutationFn = Apollo.MutationFunction<GetUploadDataMutation, GetUploadDataMutationVariables>;

/**
 * __useGetUploadDataMutation__
 *
 * To run a mutation, you first call `useGetUploadDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGetUploadDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [getUploadDataMutation, { data, loading, error }] = useGetUploadDataMutation({
 *   variables: {
 *      fileName: // value for 'fileName'
 *      header: // value for 'header'
 *   },
 * });
 */
export function useGetUploadDataMutation(baseOptions?: Apollo.MutationHookOptions<GetUploadDataMutation, GetUploadDataMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GetUploadDataMutation, GetUploadDataMutationVariables>(GetUploadDataDocument, options);
      }
export type GetUploadDataMutationHookResult = ReturnType<typeof useGetUploadDataMutation>;
export type GetUploadDataMutationResult = Apollo.MutationResult<GetUploadDataMutation>;
export type GetUploadDataMutationOptions = Apollo.BaseMutationOptions<GetUploadDataMutation, GetUploadDataMutationVariables>;
export const NotificationsDocument = gql`
    query Notifications {
  myNotifications {
    id
    type
    createdAt
    updatedAt
    title
    message
    link
    readAt
  }
}
    `;

/**
 * __useNotificationsQuery__
 *
 * To run a query within a React component, call `useNotificationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useNotificationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNotificationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useNotificationsQuery(baseOptions?: Apollo.QueryHookOptions<NotificationsQuery, NotificationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NotificationsQuery, NotificationsQueryVariables>(NotificationsDocument, options);
      }
export function useNotificationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NotificationsQuery, NotificationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NotificationsQuery, NotificationsQueryVariables>(NotificationsDocument, options);
        }
export type NotificationsQueryHookResult = ReturnType<typeof useNotificationsQuery>;
export type NotificationsLazyQueryHookResult = ReturnType<typeof useNotificationsLazyQuery>;
export type NotificationsQueryResult = Apollo.QueryResult<NotificationsQuery, NotificationsQueryVariables>;
export const MarkAsReadDocument = gql`
    mutation MarkAsRead($ids: [UUID!]!) {
  markAsRead(ids: $ids) {
    id
    type
    createdAt
    updatedAt
    title
    message
    link
    readAt
  }
}
    `;
export type MarkAsReadMutationFn = Apollo.MutationFunction<MarkAsReadMutation, MarkAsReadMutationVariables>;

/**
 * __useMarkAsReadMutation__
 *
 * To run a mutation, you first call `useMarkAsReadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkAsReadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markAsReadMutation, { data, loading, error }] = useMarkAsReadMutation({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useMarkAsReadMutation(baseOptions?: Apollo.MutationHookOptions<MarkAsReadMutation, MarkAsReadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MarkAsReadMutation, MarkAsReadMutationVariables>(MarkAsReadDocument, options);
      }
export type MarkAsReadMutationHookResult = ReturnType<typeof useMarkAsReadMutation>;
export type MarkAsReadMutationResult = Apollo.MutationResult<MarkAsReadMutation>;
export type MarkAsReadMutationOptions = Apollo.BaseMutationOptions<MarkAsReadMutation, MarkAsReadMutationVariables>;
export const DeleteNotificationsDocument = gql`
    mutation DeleteNotifications($ids: [UUID!]!) {
  deleteNotifications(ids: $ids) {
    id
    type
    createdAt
    updatedAt
    title
    message
    link
    readAt
  }
}
    `;
export type DeleteNotificationsMutationFn = Apollo.MutationFunction<DeleteNotificationsMutation, DeleteNotificationsMutationVariables>;

/**
 * __useDeleteNotificationsMutation__
 *
 * To run a mutation, you first call `useDeleteNotificationsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteNotificationsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteNotificationsMutation, { data, loading, error }] = useDeleteNotificationsMutation({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useDeleteNotificationsMutation(baseOptions?: Apollo.MutationHookOptions<DeleteNotificationsMutation, DeleteNotificationsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteNotificationsMutation, DeleteNotificationsMutationVariables>(DeleteNotificationsDocument, options);
      }
export type DeleteNotificationsMutationHookResult = ReturnType<typeof useDeleteNotificationsMutation>;
export type DeleteNotificationsMutationResult = Apollo.MutationResult<DeleteNotificationsMutation>;
export type DeleteNotificationsMutationOptions = Apollo.BaseMutationOptions<DeleteNotificationsMutation, DeleteNotificationsMutationVariables>;
export const GetMySubscriptionsDocument = gql`
    query GetMySubscriptions {
  mySubscriptionSettings {
    id
    type {
      type
      title
    }
    pushNotification
  }
}
    `;

/**
 * __useGetMySubscriptionsQuery__
 *
 * To run a query within a React component, call `useGetMySubscriptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMySubscriptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMySubscriptionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMySubscriptionsQuery(baseOptions?: Apollo.QueryHookOptions<GetMySubscriptionsQuery, GetMySubscriptionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMySubscriptionsQuery, GetMySubscriptionsQueryVariables>(GetMySubscriptionsDocument, options);
      }
export function useGetMySubscriptionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMySubscriptionsQuery, GetMySubscriptionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMySubscriptionsQuery, GetMySubscriptionsQueryVariables>(GetMySubscriptionsDocument, options);
        }
export type GetMySubscriptionsQueryHookResult = ReturnType<typeof useGetMySubscriptionsQuery>;
export type GetMySubscriptionsLazyQueryHookResult = ReturnType<typeof useGetMySubscriptionsLazyQuery>;
export type GetMySubscriptionsQueryResult = Apollo.QueryResult<GetMySubscriptionsQuery, GetMySubscriptionsQueryVariables>;
export const GetSubscriptionTypesDocument = gql`
    query GetSubscriptionTypes {
  getSubscriptionTypes {
    type
    title
    titleEn
    description
    descriptionEn
  }
}
    `;

/**
 * __useGetSubscriptionTypesQuery__
 *
 * To run a query within a React component, call `useGetSubscriptionTypesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSubscriptionTypesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSubscriptionTypesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSubscriptionTypesQuery(baseOptions?: Apollo.QueryHookOptions<GetSubscriptionTypesQuery, GetSubscriptionTypesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSubscriptionTypesQuery, GetSubscriptionTypesQueryVariables>(GetSubscriptionTypesDocument, options);
      }
export function useGetSubscriptionTypesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSubscriptionTypesQuery, GetSubscriptionTypesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSubscriptionTypesQuery, GetSubscriptionTypesQueryVariables>(GetSubscriptionTypesDocument, options);
        }
export type GetSubscriptionTypesQueryHookResult = ReturnType<typeof useGetSubscriptionTypesQuery>;
export type GetSubscriptionTypesLazyQueryHookResult = ReturnType<typeof useGetSubscriptionTypesLazyQuery>;
export type GetSubscriptionTypesQueryResult = Apollo.QueryResult<GetSubscriptionTypesQuery, GetSubscriptionTypesQueryVariables>;
export const ModifySubscriptionSettingDocument = gql`
    mutation ModifySubscriptionSetting($type: String!, $pushNotification: Boolean!, $enabled: Boolean!) {
  subscriptionSettings {
    update(type: $type, pushNotification: $pushNotification, enabled: $enabled) {
      id
      type {
        type
        title
      }
      pushNotification
    }
  }
}
    `;
export type ModifySubscriptionSettingMutationFn = Apollo.MutationFunction<ModifySubscriptionSettingMutation, ModifySubscriptionSettingMutationVariables>;

/**
 * __useModifySubscriptionSettingMutation__
 *
 * To run a mutation, you first call `useModifySubscriptionSettingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useModifySubscriptionSettingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [modifySubscriptionSettingMutation, { data, loading, error }] = useModifySubscriptionSettingMutation({
 *   variables: {
 *      type: // value for 'type'
 *      pushNotification: // value for 'pushNotification'
 *      enabled: // value for 'enabled'
 *   },
 * });
 */
export function useModifySubscriptionSettingMutation(baseOptions?: Apollo.MutationHookOptions<ModifySubscriptionSettingMutation, ModifySubscriptionSettingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ModifySubscriptionSettingMutation, ModifySubscriptionSettingMutationVariables>(ModifySubscriptionSettingDocument, options);
      }
export type ModifySubscriptionSettingMutationHookResult = ReturnType<typeof useModifySubscriptionSettingMutation>;
export type ModifySubscriptionSettingMutationResult = Apollo.MutationResult<ModifySubscriptionSettingMutation>;
export type ModifySubscriptionSettingMutationOptions = Apollo.BaseMutationOptions<ModifySubscriptionSettingMutation, ModifySubscriptionSettingMutationVariables>;
export const GetMyTagSubscriptionsDocument = gql`
    query GetMyTagSubscriptions {
  myTagSubscriptions {
    id
    name
    nameEn
    isDefault
    color
  }
}
    `;

/**
 * __useGetMyTagSubscriptionsQuery__
 *
 * To run a query within a React component, call `useGetMyTagSubscriptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyTagSubscriptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyTagSubscriptionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMyTagSubscriptionsQuery(baseOptions?: Apollo.QueryHookOptions<GetMyTagSubscriptionsQuery, GetMyTagSubscriptionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyTagSubscriptionsQuery, GetMyTagSubscriptionsQueryVariables>(GetMyTagSubscriptionsDocument, options);
      }
export function useGetMyTagSubscriptionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyTagSubscriptionsQuery, GetMyTagSubscriptionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyTagSubscriptionsQuery, GetMyTagSubscriptionsQueryVariables>(GetMyTagSubscriptionsDocument, options);
        }
export type GetMyTagSubscriptionsQueryHookResult = ReturnType<typeof useGetMyTagSubscriptionsQuery>;
export type GetMyTagSubscriptionsLazyQueryHookResult = ReturnType<typeof useGetMyTagSubscriptionsLazyQuery>;
export type GetMyTagSubscriptionsQueryResult = Apollo.QueryResult<GetMyTagSubscriptionsQuery, GetMyTagSubscriptionsQueryVariables>;
export const SubscribeToTagDocument = gql`
    mutation SubscribeToTag($tagId: UUID!) {
  tagSubscriptions {
    subscribe(tagIds: [$tagId])
  }
}
    `;
export type SubscribeToTagMutationFn = Apollo.MutationFunction<SubscribeToTagMutation, SubscribeToTagMutationVariables>;

/**
 * __useSubscribeToTagMutation__
 *
 * To run a mutation, you first call `useSubscribeToTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSubscribeToTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [subscribeToTagMutation, { data, loading, error }] = useSubscribeToTagMutation({
 *   variables: {
 *      tagId: // value for 'tagId'
 *   },
 * });
 */
export function useSubscribeToTagMutation(baseOptions?: Apollo.MutationHookOptions<SubscribeToTagMutation, SubscribeToTagMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SubscribeToTagMutation, SubscribeToTagMutationVariables>(SubscribeToTagDocument, options);
      }
export type SubscribeToTagMutationHookResult = ReturnType<typeof useSubscribeToTagMutation>;
export type SubscribeToTagMutationResult = Apollo.MutationResult<SubscribeToTagMutation>;
export type SubscribeToTagMutationOptions = Apollo.BaseMutationOptions<SubscribeToTagMutation, SubscribeToTagMutationVariables>;
export const UnsubscribeToTagDocument = gql`
    mutation UnsubscribeToTag($tagId: UUID!) {
  tagSubscriptions {
    unsubscribe(tagIds: [$tagId])
  }
}
    `;
export type UnsubscribeToTagMutationFn = Apollo.MutationFunction<UnsubscribeToTagMutation, UnsubscribeToTagMutationVariables>;

/**
 * __useUnsubscribeToTagMutation__
 *
 * To run a mutation, you first call `useUnsubscribeToTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnsubscribeToTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unsubscribeToTagMutation, { data, loading, error }] = useUnsubscribeToTagMutation({
 *   variables: {
 *      tagId: // value for 'tagId'
 *   },
 * });
 */
export function useUnsubscribeToTagMutation(baseOptions?: Apollo.MutationHookOptions<UnsubscribeToTagMutation, UnsubscribeToTagMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnsubscribeToTagMutation, UnsubscribeToTagMutationVariables>(UnsubscribeToTagDocument, options);
      }
export type UnsubscribeToTagMutationHookResult = ReturnType<typeof useUnsubscribeToTagMutation>;
export type UnsubscribeToTagMutationResult = Apollo.MutationResult<UnsubscribeToTagMutation>;
export type UnsubscribeToTagMutationOptions = Apollo.BaseMutationOptions<UnsubscribeToTagMutation, UnsubscribeToTagMutationVariables>;
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
export const InitiatePaymentDocument = gql`
    mutation InitiatePayment($phoneNumber: String!) {
  webshop {
    initiatePayment(phoneNumber: $phoneNumber) {
      id
      amount
      currency
      paymentStatus
      paymentMethod
      createdAt
      updatedAt
    }
  }
}
    `;
export type InitiatePaymentMutationFn = Apollo.MutationFunction<InitiatePaymentMutation, InitiatePaymentMutationVariables>;

/**
 * __useInitiatePaymentMutation__
 *
 * To run a mutation, you first call `useInitiatePaymentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInitiatePaymentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [initiatePaymentMutation, { data, loading, error }] = useInitiatePaymentMutation({
 *   variables: {
 *      phoneNumber: // value for 'phoneNumber'
 *   },
 * });
 */
export function useInitiatePaymentMutation(baseOptions?: Apollo.MutationHookOptions<InitiatePaymentMutation, InitiatePaymentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InitiatePaymentMutation, InitiatePaymentMutationVariables>(InitiatePaymentDocument, options);
      }
export type InitiatePaymentMutationHookResult = ReturnType<typeof useInitiatePaymentMutation>;
export type InitiatePaymentMutationResult = Apollo.MutationResult<InitiatePaymentMutation>;
export type InitiatePaymentMutationOptions = Apollo.BaseMutationOptions<InitiatePaymentMutation, InitiatePaymentMutationVariables>;
export const CheckoutFreeCartDocument = gql`
    mutation CheckoutFreeCart {
  webshop {
    freeCheckout {
      id
      amount
      currency
      paymentStatus
      paymentMethod
      createdAt
      updatedAt
    }
  }
}
    `;
export type CheckoutFreeCartMutationFn = Apollo.MutationFunction<CheckoutFreeCartMutation, CheckoutFreeCartMutationVariables>;

/**
 * __useCheckoutFreeCartMutation__
 *
 * To run a mutation, you first call `useCheckoutFreeCartMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCheckoutFreeCartMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [checkoutFreeCartMutation, { data, loading, error }] = useCheckoutFreeCartMutation({
 *   variables: {
 *   },
 * });
 */
export function useCheckoutFreeCartMutation(baseOptions?: Apollo.MutationHookOptions<CheckoutFreeCartMutation, CheckoutFreeCartMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CheckoutFreeCartMutation, CheckoutFreeCartMutationVariables>(CheckoutFreeCartDocument, options);
      }
export type CheckoutFreeCartMutationHookResult = ReturnType<typeof useCheckoutFreeCartMutation>;
export type CheckoutFreeCartMutationResult = Apollo.MutationResult<CheckoutFreeCartMutation>;
export type CheckoutFreeCartMutationOptions = Apollo.BaseMutationOptions<CheckoutFreeCartMutation, CheckoutFreeCartMutationVariables>;
export const UpdatePaymentStatusDocument = gql`
    mutation UpdatePaymentStatus($paymentId: String!, $status: PaymentStatus!) {
  webshop {
    updatePaymentStatus(paymentId: $paymentId, status: $status) {
      id
      amount
      currency
      paymentStatus
      paymentMethod
      createdAt
      updatedAt
    }
  }
}
    `;
export type UpdatePaymentStatusMutationFn = Apollo.MutationFunction<UpdatePaymentStatusMutation, UpdatePaymentStatusMutationVariables>;

/**
 * __useUpdatePaymentStatusMutation__
 *
 * To run a mutation, you first call `useUpdatePaymentStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePaymentStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePaymentStatusMutation, { data, loading, error }] = useUpdatePaymentStatusMutation({
 *   variables: {
 *      paymentId: // value for 'paymentId'
 *      status: // value for 'status'
 *   },
 * });
 */
export function useUpdatePaymentStatusMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePaymentStatusMutation, UpdatePaymentStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePaymentStatusMutation, UpdatePaymentStatusMutationVariables>(UpdatePaymentStatusDocument, options);
      }
export type UpdatePaymentStatusMutationHookResult = ReturnType<typeof useUpdatePaymentStatusMutation>;
export type UpdatePaymentStatusMutationResult = Apollo.MutationResult<UpdatePaymentStatusMutation>;
export type UpdatePaymentStatusMutationOptions = Apollo.BaseMutationOptions<UpdatePaymentStatusMutation, UpdatePaymentStatusMutationVariables>;
export const GetPaymentDocument = gql`
    query GetPayment($id: UUID!) {
  payment(id: $id) {
    id
    amount
    currency
    paymentStatus
    paymentMethod
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetPaymentQuery__
 *
 * To run a query within a React component, call `useGetPaymentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPaymentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPaymentQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPaymentQuery(baseOptions: Apollo.QueryHookOptions<GetPaymentQuery, GetPaymentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPaymentQuery, GetPaymentQueryVariables>(GetPaymentDocument, options);
      }
export function useGetPaymentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPaymentQuery, GetPaymentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPaymentQuery, GetPaymentQueryVariables>(GetPaymentDocument, options);
        }
export type GetPaymentQueryHookResult = ReturnType<typeof useGetPaymentQuery>;
export type GetPaymentLazyQueryHookResult = ReturnType<typeof useGetPaymentLazyQuery>;
export type GetPaymentQueryResult = Apollo.QueryResult<GetPaymentQuery, GetPaymentQueryVariables>;
export const GetPingsDocument = gql`
    query GetPings {
  pings {
    from {
      id
      student_id
      first_name
      nickname
      last_name
      picture_path
    }
    counter
    lastPing
  }
}
    `;

/**
 * __useGetPingsQuery__
 *
 * To run a query within a React component, call `useGetPingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPingsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPingsQuery(baseOptions?: Apollo.QueryHookOptions<GetPingsQuery, GetPingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPingsQuery, GetPingsQueryVariables>(GetPingsDocument, options);
      }
export function useGetPingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPingsQuery, GetPingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPingsQuery, GetPingsQueryVariables>(GetPingsDocument, options);
        }
export type GetPingsQueryHookResult = ReturnType<typeof useGetPingsQuery>;
export type GetPingsLazyQueryHookResult = ReturnType<typeof useGetPingsLazyQuery>;
export type GetPingsQueryResult = Apollo.QueryResult<GetPingsQuery, GetPingsQueryVariables>;
export const PositionsByCommitteeDocument = gql`
    query PositionsByCommittee($committeeId: UUID, $shortName: String, $year: Int) {
  positions(
    filter: {committee_id: $committeeId, committee_short_name: $shortName, year: $year}
    perPage: 1000
  ) {
    positions {
      id
      name
      nameEn
      description
      descriptionEn
      committee {
        id
        name
        shortName
      }
      email
      emailAliases
      activeMandates {
        id
        start_date
        end_date
        position {
          id
          name
          nameEn
          id
        }
        member {
          id
          picture_path
          student_id
          first_name
          last_name
        }
      }
    }
    pageInfo {
      hasNextPage
    }
  }
}
    `;

/**
 * __usePositionsByCommitteeQuery__
 *
 * To run a query within a React component, call `usePositionsByCommitteeQuery` and pass it any options that fit your needs.
 * When your component renders, `usePositionsByCommitteeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePositionsByCommitteeQuery({
 *   variables: {
 *      committeeId: // value for 'committeeId'
 *      shortName: // value for 'shortName'
 *      year: // value for 'year'
 *   },
 * });
 */
export function usePositionsByCommitteeQuery(baseOptions?: Apollo.QueryHookOptions<PositionsByCommitteeQuery, PositionsByCommitteeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PositionsByCommitteeQuery, PositionsByCommitteeQueryVariables>(PositionsByCommitteeDocument, options);
      }
export function usePositionsByCommitteeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PositionsByCommitteeQuery, PositionsByCommitteeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PositionsByCommitteeQuery, PositionsByCommitteeQueryVariables>(PositionsByCommitteeDocument, options);
        }
export type PositionsByCommitteeQueryHookResult = ReturnType<typeof usePositionsByCommitteeQuery>;
export type PositionsByCommitteeLazyQueryHookResult = ReturnType<typeof usePositionsByCommitteeLazyQuery>;
export type PositionsByCommitteeQueryResult = Apollo.QueryResult<PositionsByCommitteeQuery, PositionsByCommitteeQueryVariables>;
export const PositionDocument = gql`
    query Position($id: String) {
  positions(filter: {id: $id}, perPage: 1) {
    positions {
      id
      name
      nameEn
      description
      descriptionEn
      committee {
        id
        name
        name_en
        shortName
      }
      email
      emailAliases
      active
      boardMember
    }
  }
  mandatePagination(page: 0, perPage: 100000, filter: {position_id: $id}) {
    mandates {
      id
      start_date
      end_date
      member {
        id
        picture_path
        student_id
        first_name
        nickname
        last_name
      }
    }
  }
}
    `;

/**
 * __usePositionQuery__
 *
 * To run a query within a React component, call `usePositionQuery` and pass it any options that fit your needs.
 * When your component renders, `usePositionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePositionQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePositionQuery(baseOptions?: Apollo.QueryHookOptions<PositionQuery, PositionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PositionQuery, PositionQueryVariables>(PositionDocument, options);
      }
export function usePositionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PositionQuery, PositionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PositionQuery, PositionQueryVariables>(PositionDocument, options);
        }
export type PositionQueryHookResult = ReturnType<typeof usePositionQuery>;
export type PositionLazyQueryHookResult = ReturnType<typeof usePositionLazyQuery>;
export type PositionQueryResult = Apollo.QueryResult<PositionQuery, PositionQueryVariables>;
export const AllPositionsDocument = gql`
    query AllPositions($committeeId: UUID) {
  positions(filter: {committee_id: $committeeId}, perPage: 1000) {
    positions {
      id
      name
      nameEn
    }
  }
}
    `;

/**
 * __useAllPositionsQuery__
 *
 * To run a query within a React component, call `useAllPositionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllPositionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllPositionsQuery({
 *   variables: {
 *      committeeId: // value for 'committeeId'
 *   },
 * });
 */
export function useAllPositionsQuery(baseOptions?: Apollo.QueryHookOptions<AllPositionsQuery, AllPositionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllPositionsQuery, AllPositionsQueryVariables>(AllPositionsDocument, options);
      }
export function useAllPositionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllPositionsQuery, AllPositionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllPositionsQuery, AllPositionsQueryVariables>(AllPositionsDocument, options);
        }
export type AllPositionsQueryHookResult = ReturnType<typeof useAllPositionsQuery>;
export type AllPositionsLazyQueryHookResult = ReturnType<typeof useAllPositionsLazyQuery>;
export type AllPositionsQueryResult = Apollo.QueryResult<AllPositionsQuery, AllPositionsQueryVariables>;
export const UpdatePositionDocument = gql`
    mutation UpdatePosition($id: String!, $name: String, $nameEn: String, $description: String, $descriptionEn: String, $committee_id: UUID, $email: String) {
  position {
    update(
      id: $id
      input: {name: $name, nameEn: $nameEn, description: $description, descriptionEn: $descriptionEn, committee_id: $committee_id, email: $email}
    ) {
      id
      name
      nameEn
      description
      descriptionEn
      committee {
        id
        name
        name_en
        shortName
      }
      email
      emailAliases
      active
      boardMember
    }
  }
}
    `;
export type UpdatePositionMutationFn = Apollo.MutationFunction<UpdatePositionMutation, UpdatePositionMutationVariables>;

/**
 * __useUpdatePositionMutation__
 *
 * To run a mutation, you first call `useUpdatePositionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePositionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePositionMutation, { data, loading, error }] = useUpdatePositionMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *      nameEn: // value for 'nameEn'
 *      description: // value for 'description'
 *      descriptionEn: // value for 'descriptionEn'
 *      committee_id: // value for 'committee_id'
 *      email: // value for 'email'
 *   },
 * });
 */
export function useUpdatePositionMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePositionMutation, UpdatePositionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePositionMutation, UpdatePositionMutationVariables>(UpdatePositionDocument, options);
      }
export type UpdatePositionMutationHookResult = ReturnType<typeof useUpdatePositionMutation>;
export type UpdatePositionMutationResult = Apollo.MutationResult<UpdatePositionMutation>;
export type UpdatePositionMutationOptions = Apollo.BaseMutationOptions<UpdatePositionMutation, UpdatePositionMutationVariables>;
export const ProductsDocument = gql`
    query Products($categoryId: UUID) {
  products(categoryId: $categoryId) {
    id
    name
    description
    price
    maxPerUser
    imageUrl
    inventory {
      id
      variant
      quantity
    }
    category {
      id
      name
      description
    }
  }
}
    `;

/**
 * __useProductsQuery__
 *
 * To run a query within a React component, call `useProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductsQuery({
 *   variables: {
 *      categoryId: // value for 'categoryId'
 *   },
 * });
 */
export function useProductsQuery(baseOptions?: Apollo.QueryHookOptions<ProductsQuery, ProductsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductsQuery, ProductsQueryVariables>(ProductsDocument, options);
      }
export function useProductsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductsQuery, ProductsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductsQuery, ProductsQueryVariables>(ProductsDocument, options);
        }
export type ProductsQueryHookResult = ReturnType<typeof useProductsQuery>;
export type ProductsLazyQueryHookResult = ReturnType<typeof useProductsLazyQuery>;
export type ProductsQueryResult = Apollo.QueryResult<ProductsQuery, ProductsQueryVariables>;
export const ProductCategoriesDocument = gql`
    query ProductCategories {
  productCategories {
    id
    name
    description
  }
}
    `;

/**
 * __useProductCategoriesQuery__
 *
 * To run a query within a React component, call `useProductCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductCategoriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useProductCategoriesQuery(baseOptions?: Apollo.QueryHookOptions<ProductCategoriesQuery, ProductCategoriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductCategoriesQuery, ProductCategoriesQueryVariables>(ProductCategoriesDocument, options);
      }
export function useProductCategoriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductCategoriesQuery, ProductCategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductCategoriesQuery, ProductCategoriesQueryVariables>(ProductCategoriesDocument, options);
        }
export type ProductCategoriesQueryHookResult = ReturnType<typeof useProductCategoriesQuery>;
export type ProductCategoriesLazyQueryHookResult = ReturnType<typeof useProductCategoriesLazyQuery>;
export type ProductCategoriesQueryResult = Apollo.QueryResult<ProductCategoriesQuery, ProductCategoriesQueryVariables>;
export const SongsDocument = gql`
    query Songs {
  songs {
    id
    title
    lyrics
    melody
    category
    created_at
    updated_at
  }
}
    `;

/**
 * __useSongsQuery__
 *
 * To run a query within a React component, call `useSongsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSongsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSongsQuery({
 *   variables: {
 *   },
 * });
 */
export function useSongsQuery(baseOptions?: Apollo.QueryHookOptions<SongsQuery, SongsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SongsQuery, SongsQueryVariables>(SongsDocument, options);
      }
export function useSongsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SongsQuery, SongsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SongsQuery, SongsQueryVariables>(SongsDocument, options);
        }
export type SongsQueryHookResult = ReturnType<typeof useSongsQuery>;
export type SongsLazyQueryHookResult = ReturnType<typeof useSongsLazyQuery>;
export type SongsQueryResult = Apollo.QueryResult<SongsQuery, SongsQueryVariables>;
export const SongByTitleDocument = gql`
    query SongByTitle($title: String!) {
  songByTitle(title: $title) {
    id
    title
    lyrics
    melody
    category
    created_at
    updated_at
  }
}
    `;

/**
 * __useSongByTitleQuery__
 *
 * To run a query within a React component, call `useSongByTitleQuery` and pass it any options that fit your needs.
 * When your component renders, `useSongByTitleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSongByTitleQuery({
 *   variables: {
 *      title: // value for 'title'
 *   },
 * });
 */
export function useSongByTitleQuery(baseOptions: Apollo.QueryHookOptions<SongByTitleQuery, SongByTitleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SongByTitleQuery, SongByTitleQueryVariables>(SongByTitleDocument, options);
      }
export function useSongByTitleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SongByTitleQuery, SongByTitleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SongByTitleQuery, SongByTitleQueryVariables>(SongByTitleDocument, options);
        }
export type SongByTitleQueryHookResult = ReturnType<typeof useSongByTitleQuery>;
export type SongByTitleLazyQueryHookResult = ReturnType<typeof useSongByTitleLazyQuery>;
export type SongByTitleQueryResult = Apollo.QueryResult<SongByTitleQuery, SongByTitleQueryVariables>;
export const GetTagsDocument = gql`
    query GetTags {
  tags {
    id
    name
    nameEn
    isDefault
    color
  }
}
    `;

/**
 * __useGetTagsQuery__
 *
 * To run a query within a React component, call `useGetTagsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTagsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTagsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTagsQuery(baseOptions?: Apollo.QueryHookOptions<GetTagsQuery, GetTagsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTagsQuery, GetTagsQueryVariables>(GetTagsDocument, options);
      }
export function useGetTagsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTagsQuery, GetTagsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTagsQuery, GetTagsQueryVariables>(GetTagsDocument, options);
        }
export type GetTagsQueryHookResult = ReturnType<typeof useGetTagsQuery>;
export type GetTagsLazyQueryHookResult = ReturnType<typeof useGetTagsLazyQuery>;
export type GetTagsQueryResult = Apollo.QueryResult<GetTagsQuery, GetTagsQueryVariables>;
export const GetTagDocument = gql`
    query GetTag($id: UUID!) {
  tag(id: $id) {
    id
    name
    nameEn
    isDefault
    color
  }
}
    `;

/**
 * __useGetTagQuery__
 *
 * To run a query within a React component, call `useGetTagQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTagQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTagQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetTagQuery(baseOptions: Apollo.QueryHookOptions<GetTagQuery, GetTagQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTagQuery, GetTagQueryVariables>(GetTagDocument, options);
      }
export function useGetTagLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTagQuery, GetTagQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTagQuery, GetTagQueryVariables>(GetTagDocument, options);
        }
export type GetTagQueryHookResult = ReturnType<typeof useGetTagQuery>;
export type GetTagLazyQueryHookResult = ReturnType<typeof useGetTagLazyQuery>;
export type GetTagQueryResult = Apollo.QueryResult<GetTagQuery, GetTagQueryVariables>;
export const CreateTagDocument = gql`
    mutation CreateTag($name: String!, $nameEn: String, $color: String, $isDefault: Boolean) {
  tags {
    create(
      input: {name: $name, nameEn: $nameEn, color: $color, isDefault: $isDefault}
    ) {
      id
      name
      nameEn
      isDefault
      color
    }
  }
}
    `;
export type CreateTagMutationFn = Apollo.MutationFunction<CreateTagMutation, CreateTagMutationVariables>;

/**
 * __useCreateTagMutation__
 *
 * To run a mutation, you first call `useCreateTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTagMutation, { data, loading, error }] = useCreateTagMutation({
 *   variables: {
 *      name: // value for 'name'
 *      nameEn: // value for 'nameEn'
 *      color: // value for 'color'
 *      isDefault: // value for 'isDefault'
 *   },
 * });
 */
export function useCreateTagMutation(baseOptions?: Apollo.MutationHookOptions<CreateTagMutation, CreateTagMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTagMutation, CreateTagMutationVariables>(CreateTagDocument, options);
      }
export type CreateTagMutationHookResult = ReturnType<typeof useCreateTagMutation>;
export type CreateTagMutationResult = Apollo.MutationResult<CreateTagMutation>;
export type CreateTagMutationOptions = Apollo.BaseMutationOptions<CreateTagMutation, CreateTagMutationVariables>;
export const UpdateTagDocument = gql`
    mutation UpdateTag($id: UUID!, $name: String, $nameEn: String, $color: String, $isDefault: Boolean) {
  tags {
    update(
      id: $id
      input: {name: $name, nameEn: $nameEn, color: $color, isDefault: $isDefault}
    ) {
      id
      name
      nameEn
      isDefault
      color
    }
  }
}
    `;
export type UpdateTagMutationFn = Apollo.MutationFunction<UpdateTagMutation, UpdateTagMutationVariables>;

/**
 * __useUpdateTagMutation__
 *
 * To run a mutation, you first call `useUpdateTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTagMutation, { data, loading, error }] = useUpdateTagMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *      nameEn: // value for 'nameEn'
 *      color: // value for 'color'
 *      isDefault: // value for 'isDefault'
 *   },
 * });
 */
export function useUpdateTagMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTagMutation, UpdateTagMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTagMutation, UpdateTagMutationVariables>(UpdateTagDocument, options);
      }
export type UpdateTagMutationHookResult = ReturnType<typeof useUpdateTagMutation>;
export type UpdateTagMutationResult = Apollo.MutationResult<UpdateTagMutation>;
export type UpdateTagMutationOptions = Apollo.BaseMutationOptions<UpdateTagMutation, UpdateTagMutationVariables>;