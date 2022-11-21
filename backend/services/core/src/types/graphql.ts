import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | undefined;
export type InputMaybe<T> = T | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  Datetime: any;
  UUID: string;
  Url: any;
  _FieldSet: any;
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

export type Inventory = {
  __typename?: 'Inventory';
  discount?: Maybe<Discount>;
  id: Scalars['UUID'];
  quantity: Scalars['Int'];
  variant?: Maybe<Scalars['String']>;
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
  addToMyCart?: Maybe<Cart>;
  admin?: Maybe<AdminMutations>;
  alias?: Maybe<MailAliasMutations>;
  article?: Maybe<ArticleMutations>;
  bookable?: Maybe<BookableMutations>;
  bookingRequest?: Maybe<BookingRequestMutations>;
  committee?: Maybe<CommitteeMutations>;
  createProduct: Array<Maybe<Product>>;
  event?: Maybe<EventMutations>;
  files?: Maybe<FileMutations>;
  initiatePayment: Payment;
  mandate?: Maybe<MandateMutations>;
  markdown?: Maybe<MarkdownMutations>;
  member?: Maybe<MemberMutations>;
  position?: Maybe<PositionMutations>;
  removeFromMyCart?: Maybe<Cart>;
  removeMyCart: Scalars['Boolean'];
  tags?: Maybe<TagMutations>;
  token?: Maybe<TokenMutations>;
  updatePaymentStatus: Payment;
};


export type MutationAddToMyCartArgs = {
  inventoryId: Scalars['UUID'];
  quantity: Scalars['Int'];
};


export type MutationCreateProductArgs = {
  input: ProductInput;
};


export type MutationInitiatePaymentArgs = {
  phoneNumber: Scalars['String'];
};


export type MutationRemoveFromMyCartArgs = {
  inventoryId: Scalars['UUID'];
  quantity: Scalars['Int'];
};


export type MutationUpdatePaymentStatusArgs = {
  paymentId: Scalars['String'];
  status: PaymentStatus;
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

export type Product = {
  __typename?: 'Product';
  category?: Maybe<ProductCategory>;
  description: Scalars['String'];
  id: Scalars['UUID'];
  imageUrl: Scalars['String'];
  inventory: Array<Maybe<Inventory>>;
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
  maxPerUser?: InputMaybe<Scalars['Int']>;
  name: Scalars['String'];
  price: Scalars['Float'];
  quantity: Scalars['Int'];
  variant?: InputMaybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  alarmShouldBeActive: Scalars['Boolean'];
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
  getPayment?: Maybe<Payment>;
  mandatePagination?: Maybe<MandatePagination>;
  markdown?: Maybe<Markdown>;
  markdowns: Array<Maybe<Markdown>>;
  me?: Maybe<Member>;
  member?: Maybe<Member>;
  memberById?: Maybe<Member>;
  members?: Maybe<MemberPagination>;
  myCart?: Maybe<Cart>;
  news?: Maybe<ArticlePagination>;
  positions?: Maybe<PositionPagination>;
  presignedPutUrl?: Maybe<Scalars['String']>;
  product?: Maybe<Product>;
  productCategories: Array<Maybe<ProductCategory>>;
  products: Array<Maybe<Product>>;
  resolveAlias?: Maybe<Array<Maybe<Scalars['String']>>>;
  resolveRecipients: Array<Maybe<MailRecipient>>;
  songById?: Maybe<Song>;
  songByTitle?: Maybe<Song>;
  songs?: Maybe<Array<Maybe<Song>>>;
  tag?: Maybe<Tag>;
  tags: Array<Tag>;
  token?: Maybe<Token>;
  userHasAccessToAlias: Scalars['Boolean'];
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


export type QueryGetPaymentArgs = {
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

export type FileChange = {
  __typename?: 'fileChange';
  file: FileData;
  oldFile?: Maybe<FileData>;
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
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

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
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

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
  AccessMutations: ResolverTypeWrapper<AccessMutations>;
  AccessPolicy: ResolverTypeWrapper<AccessPolicy>;
  String: ResolverTypeWrapper<Scalars['String']>;
  AdminMutations: ResolverTypeWrapper<AdminMutations>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Api: ResolverTypeWrapper<Api>;
  Article: ResolverTypeWrapper<Omit<Article, 'author'> & { author: ResolversTypes['Author'] }>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  ArticleMutations: ResolverTypeWrapper<ArticleMutations>;
  ArticlePagination: ResolverTypeWrapper<ArticlePagination>;
  ArticlePayload: ResolverTypeWrapper<ArticlePayload>;
  Author: ResolversTypes['Mandate'] | ResolversTypes['Member'];
  Bookable: ResolverTypeWrapper<Bookable>;
  BookableCategory: ResolverTypeWrapper<BookableCategory>;
  BookableMutations: ResolverTypeWrapper<BookableMutations>;
  BookingFilter: BookingFilter;
  BookingRequest: ResolverTypeWrapper<BookingRequest>;
  BookingRequestMutations: ResolverTypeWrapper<BookingRequestMutations>;
  BookingStatus: BookingStatus;
  Cart: ResolverTypeWrapper<Cart>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  CartInventory: ResolverTypeWrapper<CartInventory>;
  CartItem: ResolverTypeWrapper<CartItem>;
  Comment: ResolverTypeWrapper<Comment>;
  Committee: ResolverTypeWrapper<Committee>;
  CommitteeFilter: CommitteeFilter;
  CommitteeMutations: ResolverTypeWrapper<CommitteeMutations>;
  CommitteePagination: ResolverTypeWrapper<CommitteePagination>;
  CreateApiAccessPolicy: CreateApiAccessPolicy;
  CreateArticle: CreateArticle;
  CreateArticlePayload: ResolverTypeWrapper<CreateArticlePayload>;
  CreateBookable: CreateBookable;
  CreateBookingRequest: CreateBookingRequest;
  CreateCommittee: CreateCommittee;
  CreateDoor: CreateDoor;
  CreateDoorAccessPolicy: CreateDoorAccessPolicy;
  CreateEvent: CreateEvent;
  CreateMailAlias: CreateMailAlias;
  CreateMandate: CreateMandate;
  CreateMarkdown: CreateMarkdown;
  CreateMember: CreateMember;
  CreatePosition: CreatePosition;
  CreateTag: CreateTag;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  Datetime: ResolverTypeWrapper<Scalars['Datetime']>;
  Discount: ResolverTypeWrapper<Discount>;
  Door: ResolverTypeWrapper<Door>;
  DoorMutations: ResolverTypeWrapper<DoorMutations>;
  Event: ResolverTypeWrapper<Event>;
  EventFilter: EventFilter;
  EventMutations: ResolverTypeWrapper<EventMutations>;
  EventPagination: ResolverTypeWrapper<EventPagination>;
  FastMandate: ResolverTypeWrapper<FastMandate>;
  FileData: ResolverTypeWrapper<FileData>;
  FileMutations: ResolverTypeWrapper<FileMutations>;
  Inventory: ResolverTypeWrapper<Inventory>;
  MailAlias: ResolverTypeWrapper<MailAlias>;
  MailAliasMutations: ResolverTypeWrapper<MailAliasMutations>;
  MailAliasPolicy: ResolverTypeWrapper<MailAliasPolicy>;
  MailRecipient: ResolverTypeWrapper<MailRecipient>;
  Mandate: ResolverTypeWrapper<Mandate>;
  MandateFilter: MandateFilter;
  MandateMutations: ResolverTypeWrapper<MandateMutations>;
  MandatePagination: ResolverTypeWrapper<MandatePagination>;
  Markdown: ResolverTypeWrapper<Markdown>;
  MarkdownMutations: ResolverTypeWrapper<MarkdownMutations>;
  MarkdownPayload: ResolverTypeWrapper<MarkdownPayload>;
  Member: ResolverTypeWrapper<Member>;
  MemberFilter: MemberFilter;
  MemberMutations: ResolverTypeWrapper<MemberMutations>;
  MemberPagination: ResolverTypeWrapper<MemberPagination>;
  Mutation: ResolverTypeWrapper<{}>;
  Order: ResolverTypeWrapper<Order>;
  PaginationInfo: ResolverTypeWrapper<PaginationInfo>;
  Payment: ResolverTypeWrapper<Payment>;
  PaymentStatus: PaymentStatus;
  PolicyMutations: ResolverTypeWrapper<PolicyMutations>;
  Position: ResolverTypeWrapper<Position>;
  PositionFilter: PositionFilter;
  PositionMutations: ResolverTypeWrapper<PositionMutations>;
  PositionPagination: ResolverTypeWrapper<PositionPagination>;
  Product: ResolverTypeWrapper<Product>;
  ProductCategory: ResolverTypeWrapper<ProductCategory>;
  ProductInput: ProductInput;
  Query: ResolverTypeWrapper<{}>;
  Song: ResolverTypeWrapper<Song>;
  Tag: ResolverTypeWrapper<Tag>;
  TagMutations: ResolverTypeWrapper<TagMutations>;
  Token: ResolverTypeWrapper<Token>;
  TokenMutations: ResolverTypeWrapper<TokenMutations>;
  UUID: ResolverTypeWrapper<Scalars['UUID']>;
  UpdateArticle: UpdateArticle;
  UpdateArticlePayload: ResolverTypeWrapper<UpdateArticlePayload>;
  UpdateBookable: UpdateBookable;
  UpdateBookingRequest: UpdateBookingRequest;
  UpdateBookingRequestStatus: UpdateBookingRequestStatus;
  UpdateCommittee: UpdateCommittee;
  UpdateEvent: UpdateEvent;
  UpdateMandate: UpdateMandate;
  UpdateMarkdown: UpdateMarkdown;
  UpdateMember: UpdateMember;
  UpdatePosition: UpdatePosition;
  UpdateTag: UpdateTag;
  UploadData: ResolverTypeWrapper<UploadData>;
  Url: ResolverTypeWrapper<Scalars['Url']>;
  fileChange: ResolverTypeWrapper<FileChange>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AccessMutations: AccessMutations;
  AccessPolicy: AccessPolicy;
  String: Scalars['String'];
  AdminMutations: AdminMutations;
  Boolean: Scalars['Boolean'];
  Api: Api;
  Article: Omit<Article, 'author'> & { author: ResolversParentTypes['Author'] };
  Int: Scalars['Int'];
  ArticleMutations: ArticleMutations;
  ArticlePagination: ArticlePagination;
  ArticlePayload: ArticlePayload;
  Author: ResolversParentTypes['Mandate'] | ResolversParentTypes['Member'];
  Bookable: Bookable;
  BookableCategory: BookableCategory;
  BookableMutations: BookableMutations;
  BookingFilter: BookingFilter;
  BookingRequest: BookingRequest;
  BookingRequestMutations: BookingRequestMutations;
  Cart: Cart;
  Float: Scalars['Float'];
  CartInventory: CartInventory;
  CartItem: CartItem;
  Comment: Comment;
  Committee: Committee;
  CommitteeFilter: CommitteeFilter;
  CommitteeMutations: CommitteeMutations;
  CommitteePagination: CommitteePagination;
  CreateApiAccessPolicy: CreateApiAccessPolicy;
  CreateArticle: CreateArticle;
  CreateArticlePayload: CreateArticlePayload;
  CreateBookable: CreateBookable;
  CreateBookingRequest: CreateBookingRequest;
  CreateCommittee: CreateCommittee;
  CreateDoor: CreateDoor;
  CreateDoorAccessPolicy: CreateDoorAccessPolicy;
  CreateEvent: CreateEvent;
  CreateMailAlias: CreateMailAlias;
  CreateMandate: CreateMandate;
  CreateMarkdown: CreateMarkdown;
  CreateMember: CreateMember;
  CreatePosition: CreatePosition;
  CreateTag: CreateTag;
  Date: Scalars['Date'];
  Datetime: Scalars['Datetime'];
  Discount: Discount;
  Door: Door;
  DoorMutations: DoorMutations;
  Event: Event;
  EventFilter: EventFilter;
  EventMutations: EventMutations;
  EventPagination: EventPagination;
  FastMandate: FastMandate;
  FileData: FileData;
  FileMutations: FileMutations;
  Inventory: Inventory;
  MailAlias: MailAlias;
  MailAliasMutations: MailAliasMutations;
  MailAliasPolicy: MailAliasPolicy;
  MailRecipient: MailRecipient;
  Mandate: Mandate;
  MandateFilter: MandateFilter;
  MandateMutations: MandateMutations;
  MandatePagination: MandatePagination;
  Markdown: Markdown;
  MarkdownMutations: MarkdownMutations;
  MarkdownPayload: MarkdownPayload;
  Member: Member;
  MemberFilter: MemberFilter;
  MemberMutations: MemberMutations;
  MemberPagination: MemberPagination;
  Mutation: {};
  Order: Order;
  PaginationInfo: PaginationInfo;
  Payment: Payment;
  PolicyMutations: PolicyMutations;
  Position: Position;
  PositionFilter: PositionFilter;
  PositionMutations: PositionMutations;
  PositionPagination: PositionPagination;
  Product: Product;
  ProductCategory: ProductCategory;
  ProductInput: ProductInput;
  Query: {};
  Song: Song;
  Tag: Tag;
  TagMutations: TagMutations;
  Token: Token;
  TokenMutations: TokenMutations;
  UUID: Scalars['UUID'];
  UpdateArticle: UpdateArticle;
  UpdateArticlePayload: UpdateArticlePayload;
  UpdateBookable: UpdateBookable;
  UpdateBookingRequest: UpdateBookingRequest;
  UpdateBookingRequestStatus: UpdateBookingRequestStatus;
  UpdateCommittee: UpdateCommittee;
  UpdateEvent: UpdateEvent;
  UpdateMandate: UpdateMandate;
  UpdateMarkdown: UpdateMarkdown;
  UpdateMember: UpdateMember;
  UpdatePosition: UpdatePosition;
  UpdateTag: UpdateTag;
  UploadData: UploadData;
  Url: Scalars['Url'];
  fileChange: FileChange;
}>;

export type AccessMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['AccessMutations'] = ResolversParentTypes['AccessMutations']> = ResolversObject<{
  door?: Resolver<Maybe<ResolversTypes['DoorMutations']>, ParentType, ContextType>;
  policy?: Resolver<Maybe<ResolversTypes['PolicyMutations']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AccessPolicyResolvers<ContextType = any, ParentType extends ResolversParentTypes['AccessPolicy'] = ResolversParentTypes['AccessPolicy']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['AccessPolicy']>, { __typename: 'AccessPolicy' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  accessor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  end_datetime?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  start_datetime?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AdminMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['AdminMutations'] = ResolversParentTypes['AdminMutations']> = ResolversObject<{
  seed?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  syncMandatesWithKeycloak?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  updateSearchIndex?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ApiResolvers<ContextType = any, ParentType extends ResolversParentTypes['Api'] = ResolversParentTypes['Api']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Api']>, { __typename: 'Api' } & GraphQLRecursivePick<ParentType, {"name":true}>, ContextType>;
  accessPolicies?: Resolver<Maybe<Array<ResolversTypes['AccessPolicy']>>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ArticleResolvers<ContextType = any, ParentType extends ResolversParentTypes['Article'] = ResolversParentTypes['Article']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Article']>, { __typename: 'Article' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  author?: Resolver<ResolversTypes['Author'], ParentType, ContextType>;
  body?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  bodyEn?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  comments?: Resolver<Array<Maybe<ResolversTypes['Comment']>>, ParentType, ContextType>;
  header?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  headerEn?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  imageUrl?: Resolver<Maybe<ResolversTypes['Url']>, ParentType, ContextType>;
  isLikedByMe?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  latestEditDatetime?: Resolver<Maybe<ResolversTypes['Datetime']>, ParentType, ContextType>;
  likers?: Resolver<Array<Maybe<ResolversTypes['Member']>>, ParentType, ContextType>;
  likes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  publishedDatetime?: Resolver<ResolversTypes['Datetime'], ParentType, ContextType>;
  slug?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tags?: Resolver<Array<ResolversTypes['Tag']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ArticleMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['ArticleMutations'] = ResolversParentTypes['ArticleMutations']> = ResolversObject<{
  comment?: Resolver<Maybe<ResolversTypes['ArticlePayload']>, ParentType, ContextType, RequireFields<ArticleMutationsCommentArgs, 'content' | 'id'>>;
  create?: Resolver<Maybe<ResolversTypes['CreateArticlePayload']>, ParentType, ContextType, RequireFields<ArticleMutationsCreateArgs, 'input'>>;
  getUploadData?: Resolver<Maybe<ResolversTypes['UploadData']>, ParentType, ContextType, RequireFields<ArticleMutationsGetUploadDataArgs, 'fileName' | 'header'>>;
  like?: Resolver<Maybe<ResolversTypes['ArticlePayload']>, ParentType, ContextType, RequireFields<ArticleMutationsLikeArgs, 'id'>>;
  remove?: Resolver<Maybe<ResolversTypes['ArticlePayload']>, ParentType, ContextType, RequireFields<ArticleMutationsRemoveArgs, 'id'>>;
  removeComment?: Resolver<Maybe<ResolversTypes['ArticlePayload']>, ParentType, ContextType, RequireFields<ArticleMutationsRemoveCommentArgs, 'commentId'>>;
  unlike?: Resolver<Maybe<ResolversTypes['ArticlePayload']>, ParentType, ContextType, RequireFields<ArticleMutationsUnlikeArgs, 'id'>>;
  update?: Resolver<Maybe<ResolversTypes['UpdateArticlePayload']>, ParentType, ContextType, RequireFields<ArticleMutationsUpdateArgs, 'id' | 'input'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ArticlePaginationResolvers<ContextType = any, ParentType extends ResolversParentTypes['ArticlePagination'] = ResolversParentTypes['ArticlePagination']> = ResolversObject<{
  articles?: Resolver<Array<Maybe<ResolversTypes['Article']>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PaginationInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ArticlePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['ArticlePayload'] = ResolversParentTypes['ArticlePayload']> = ResolversObject<{
  article?: Resolver<ResolversTypes['Article'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Author'] = ResolversParentTypes['Author']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Mandate' | 'Member', ParentType, ContextType>;
}>;

export type BookableResolvers<ContextType = any, ParentType extends ResolversParentTypes['Bookable'] = ResolversParentTypes['Bookable']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Bookable']>, { __typename: 'Bookable' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  category?: Resolver<Maybe<ResolversTypes['BookableCategory']>, ParentType, ContextType>;
  door?: Resolver<Maybe<ResolversTypes['Door']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  isDisabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name_en?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BookableCategoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['BookableCategory'] = ResolversParentTypes['BookableCategory']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['BookableCategory']>, { __typename: 'BookableCategory' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name_en?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BookableMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['BookableMutations'] = ResolversParentTypes['BookableMutations']> = ResolversObject<{
  create?: Resolver<Maybe<ResolversTypes['Bookable']>, ParentType, ContextType, RequireFields<BookableMutationsCreateArgs, 'input'>>;
  update?: Resolver<Maybe<ResolversTypes['Bookable']>, ParentType, ContextType, RequireFields<BookableMutationsUpdateArgs, 'id' | 'input'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BookingRequestResolvers<ContextType = any, ParentType extends ResolversParentTypes['BookingRequest'] = ResolversParentTypes['BookingRequest']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['BookingRequest']>, { __typename: 'BookingRequest' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  booker?: Resolver<ResolversTypes['Member'], ParentType, ContextType>;
  created?: Resolver<ResolversTypes['Datetime'], ParentType, ContextType>;
  end?: Resolver<ResolversTypes['Datetime'], ParentType, ContextType>;
  event?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  last_modified?: Resolver<Maybe<ResolversTypes['Datetime']>, ParentType, ContextType>;
  start?: Resolver<ResolversTypes['Datetime'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['BookingStatus'], ParentType, ContextType>;
  what?: Resolver<Array<ResolversTypes['Bookable']>, ParentType, ContextType>;
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

export type CartResolvers<ContextType = any, ParentType extends ResolversParentTypes['Cart'] = ResolversParentTypes['Cart']> = ResolversObject<{
  cartItems?: Resolver<Array<Maybe<ResolversTypes['CartItem']>>, ParentType, ContextType>;
  expiresAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  totalPrice?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalQuantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CartInventoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['CartInventory'] = ResolversParentTypes['CartInventory']> = ResolversObject<{
  discount?: Resolver<Maybe<ResolversTypes['Discount']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  inventoryId?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  variant?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CartItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['CartItem'] = ResolversParentTypes['CartItem']> = ResolversObject<{
  category?: Resolver<Maybe<ResolversTypes['ProductCategory']>, ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  imageUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  inventory?: Resolver<Array<Maybe<ResolversTypes['CartInventory']>>, ParentType, ContextType>;
  maxPerUser?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CommentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Comment'] = ResolversParentTypes['Comment']> = ResolversObject<{
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  member?: Resolver<ResolversTypes['Member'], ParentType, ContextType>;
  published?: Resolver<ResolversTypes['Datetime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CommitteeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Committee'] = ResolversParentTypes['Committee']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Committee']>, { __typename: 'Committee' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  shortName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CommitteeMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['CommitteeMutations'] = ResolversParentTypes['CommitteeMutations']> = ResolversObject<{
  create?: Resolver<Maybe<ResolversTypes['Committee']>, ParentType, ContextType, RequireFields<CommitteeMutationsCreateArgs, 'input'>>;
  remove?: Resolver<Maybe<ResolversTypes['Committee']>, ParentType, ContextType, RequireFields<CommitteeMutationsRemoveArgs, 'id'>>;
  update?: Resolver<Maybe<ResolversTypes['Committee']>, ParentType, ContextType, RequireFields<CommitteeMutationsUpdateArgs, 'id' | 'input'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CommitteePaginationResolvers<ContextType = any, ParentType extends ResolversParentTypes['CommitteePagination'] = ResolversParentTypes['CommitteePagination']> = ResolversObject<{
  committees?: Resolver<Array<Maybe<ResolversTypes['Committee']>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PaginationInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateArticlePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateArticlePayload'] = ResolversParentTypes['CreateArticlePayload']> = ResolversObject<{
  article?: Resolver<ResolversTypes['Article'], ParentType, ContextType>;
  uploadUrl?: Resolver<Maybe<ResolversTypes['Url']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export interface DatetimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Datetime'], any> {
  name: 'Datetime';
}

export type DiscountResolvers<ContextType = any, ParentType extends ResolversParentTypes['Discount'] = ResolversParentTypes['Discount']> = ResolversObject<{
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  discountPercentage?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DoorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Door'] = ResolversParentTypes['Door']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Door']>, { __typename: 'Door' } & GraphQLRecursivePick<ParentType, {"name":true}>, ContextType>;
  accessPolicies?: Resolver<Maybe<Array<ResolversTypes['AccessPolicy']>>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  studentIds?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DoorMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['DoorMutations'] = ResolversParentTypes['DoorMutations']> = ResolversObject<{
  create?: Resolver<Maybe<ResolversTypes['Door']>, ParentType, ContextType, RequireFields<DoorMutationsCreateArgs, 'input'>>;
  remove?: Resolver<Maybe<ResolversTypes['Door']>, ParentType, ContextType, RequireFields<DoorMutationsRemoveArgs, 'name'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EventResolvers<ContextType = any, ParentType extends ResolversParentTypes['Event'] = ResolversParentTypes['Event']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Event']>, { __typename: 'Event' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  alarm_active?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  author?: Resolver<ResolversTypes['Member'], ParentType, ContextType>;
  comments?: Resolver<Array<Maybe<ResolversTypes['Comment']>>, ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description_en?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  end_datetime?: Resolver<ResolversTypes['Datetime'], ParentType, ContextType>;
  iAmGoing?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  iAmInterested?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  link?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  number_of_updates?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  organizer?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  peopleGoing?: Resolver<Array<Maybe<ResolversTypes['Member']>>, ParentType, ContextType>;
  peopleInterested?: Resolver<Array<Maybe<ResolversTypes['Member']>>, ParentType, ContextType>;
  short_description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  short_description_en?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  slug?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  start_datetime?: Resolver<ResolversTypes['Datetime'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title_en?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EventMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['EventMutations'] = ResolversParentTypes['EventMutations']> = ResolversObject<{
  comment?: Resolver<Maybe<ResolversTypes['Event']>, ParentType, ContextType, RequireFields<EventMutationsCommentArgs, 'content' | 'id'>>;
  create?: Resolver<Maybe<ResolversTypes['Event']>, ParentType, ContextType, RequireFields<EventMutationsCreateArgs, 'input'>>;
  remove?: Resolver<Maybe<ResolversTypes['Event']>, ParentType, ContextType, RequireFields<EventMutationsRemoveArgs, 'id'>>;
  removeComment?: Resolver<Maybe<ResolversTypes['Event']>, ParentType, ContextType, RequireFields<EventMutationsRemoveCommentArgs, 'commentId'>>;
  setGoing?: Resolver<Maybe<ResolversTypes['Event']>, ParentType, ContextType, RequireFields<EventMutationsSetGoingArgs, 'id'>>;
  setInterested?: Resolver<Maybe<ResolversTypes['Event']>, ParentType, ContextType, RequireFields<EventMutationsSetInterestedArgs, 'id'>>;
  unsetGoing?: Resolver<Maybe<ResolversTypes['Event']>, ParentType, ContextType, RequireFields<EventMutationsUnsetGoingArgs, 'id'>>;
  unsetInterested?: Resolver<Maybe<ResolversTypes['Event']>, ParentType, ContextType, RequireFields<EventMutationsUnsetInterestedArgs, 'id'>>;
  update?: Resolver<Maybe<ResolversTypes['Event']>, ParentType, ContextType, RequireFields<EventMutationsUpdateArgs, 'id' | 'input'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EventPaginationResolvers<ContextType = any, ParentType extends ResolversParentTypes['EventPagination'] = ResolversParentTypes['EventPagination']> = ResolversObject<{
  events?: Resolver<Array<Maybe<ResolversTypes['Event']>>, ParentType, ContextType>;
  pageInfo?: Resolver<Maybe<ResolversTypes['PaginationInfo']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FastMandateResolvers<ContextType = any, ParentType extends ResolversParentTypes['FastMandate'] = ResolversParentTypes['FastMandate']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['FastMandate']>, { __typename: 'FastMandate' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  end_date?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  member?: Resolver<Maybe<ResolversTypes['Member']>, ParentType, ContextType>;
  position?: Resolver<Maybe<ResolversTypes['Position']>, ParentType, ContextType>;
  start_date?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FileDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['FileData'] = ResolversParentTypes['FileData']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['FileData']>, { __typename: 'FileData' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  childrenCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  color?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  dndOpenable?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  draggable?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  droppable?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  ext?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isDir?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isEncrypted?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isHidden?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isSymlink?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  modDate?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  openable?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  selectable?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  size?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  thumbnailUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FileMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['FileMutations'] = ResolversParentTypes['FileMutations']> = ResolversObject<{
  move?: Resolver<Maybe<Array<Maybe<ResolversTypes['fileChange']>>>, ParentType, ContextType, RequireFields<FileMutationsMoveArgs, 'bucket' | 'fileNames' | 'newFolder'>>;
  remove?: Resolver<Maybe<Array<Maybe<ResolversTypes['FileData']>>>, ParentType, ContextType, RequireFields<FileMutationsRemoveArgs, 'bucket' | 'fileNames'>>;
  rename?: Resolver<Maybe<ResolversTypes['fileChange']>, ParentType, ContextType, RequireFields<FileMutationsRenameArgs, 'bucket' | 'fileName' | 'newFileName'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type InventoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Inventory'] = ResolversParentTypes['Inventory']> = ResolversObject<{
  discount?: Resolver<Maybe<ResolversTypes['Discount']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  variant?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MailAliasResolvers<ContextType = any, ParentType extends ResolversParentTypes['MailAlias'] = ResolversParentTypes['MailAlias']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['MailAlias']>, { __typename: 'MailAlias' } & GraphQLRecursivePick<ParentType, {"email":true}>, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  policies?: Resolver<Array<Maybe<ResolversTypes['MailAliasPolicy']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MailAliasMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['MailAliasMutations'] = ResolversParentTypes['MailAliasMutations']> = ResolversObject<{
  create?: Resolver<Maybe<ResolversTypes['MailAlias']>, ParentType, ContextType, RequireFields<MailAliasMutationsCreateArgs, 'input'>>;
  remove?: Resolver<Maybe<ResolversTypes['MailAlias']>, ParentType, ContextType, RequireFields<MailAliasMutationsRemoveArgs, 'id'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MailAliasPolicyResolvers<ContextType = any, ParentType extends ResolversParentTypes['MailAliasPolicy'] = ResolversParentTypes['MailAliasPolicy']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['MailAliasPolicy']>, { __typename: 'MailAliasPolicy' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  position?: Resolver<ResolversTypes['Position'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MailRecipientResolvers<ContextType = any, ParentType extends ResolversParentTypes['MailRecipient'] = ResolversParentTypes['MailRecipient']> = ResolversObject<{
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  emails?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MandateResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mandate'] = ResolversParentTypes['Mandate']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Mandate']>, { __typename: 'Mandate' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  end_date?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  member?: Resolver<Maybe<ResolversTypes['Member']>, ParentType, ContextType>;
  position?: Resolver<Maybe<ResolversTypes['Position']>, ParentType, ContextType>;
  start_date?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MandateMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['MandateMutations'] = ResolversParentTypes['MandateMutations']> = ResolversObject<{
  create?: Resolver<Maybe<ResolversTypes['Mandate']>, ParentType, ContextType, RequireFields<MandateMutationsCreateArgs, 'input'>>;
  remove?: Resolver<Maybe<ResolversTypes['Mandate']>, ParentType, ContextType, RequireFields<MandateMutationsRemoveArgs, 'id'>>;
  update?: Resolver<Maybe<ResolversTypes['Mandate']>, ParentType, ContextType, RequireFields<MandateMutationsUpdateArgs, 'id' | 'input'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MandatePaginationResolvers<ContextType = any, ParentType extends ResolversParentTypes['MandatePagination'] = ResolversParentTypes['MandatePagination']> = ResolversObject<{
  mandates?: Resolver<Array<Maybe<ResolversTypes['FastMandate']>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PaginationInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MarkdownResolvers<ContextType = any, ParentType extends ResolversParentTypes['Markdown'] = ResolversParentTypes['Markdown']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Markdown']>, { __typename: 'Markdown' } & GraphQLRecursivePick<ParentType, {"name":true}>, ContextType>;
  markdown?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  markdown_en?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MarkdownMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['MarkdownMutations'] = ResolversParentTypes['MarkdownMutations']> = ResolversObject<{
  create?: Resolver<Maybe<ResolversTypes['Markdown']>, ParentType, ContextType, RequireFields<MarkdownMutationsCreateArgs, 'input'>>;
  update?: Resolver<Maybe<ResolversTypes['Markdown']>, ParentType, ContextType, RequireFields<MarkdownMutationsUpdateArgs, 'input' | 'name'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MarkdownPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['MarkdownPayload'] = ResolversParentTypes['MarkdownPayload']> = ResolversObject<{
  markdown?: Resolver<ResolversTypes['Markdown'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MemberResolvers<ContextType = any, ParentType extends ResolversParentTypes['Member'] = ResolversParentTypes['Member']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Member']>, { __typename: 'Member' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  class_programme?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  class_year?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  first_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  last_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  mandates?: Resolver<Maybe<Array<ResolversTypes['Mandate']>>, ParentType, ContextType, RequireFields<MemberMandatesArgs, 'onlyActive'>>;
  nickname?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  picture_path?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  student_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MemberMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['MemberMutations'] = ResolversParentTypes['MemberMutations']> = ResolversObject<{
  create?: Resolver<Maybe<ResolversTypes['Member']>, ParentType, ContextType, RequireFields<MemberMutationsCreateArgs, 'input'>>;
  remove?: Resolver<Maybe<ResolversTypes['Member']>, ParentType, ContextType, RequireFields<MemberMutationsRemoveArgs, 'id'>>;
  update?: Resolver<Maybe<ResolversTypes['Member']>, ParentType, ContextType, RequireFields<MemberMutationsUpdateArgs, 'id' | 'input'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MemberPaginationResolvers<ContextType = any, ParentType extends ResolversParentTypes['MemberPagination'] = ResolversParentTypes['MemberPagination']> = ResolversObject<{
  members?: Resolver<Array<Maybe<ResolversTypes['Member']>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PaginationInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  access?: Resolver<Maybe<ResolversTypes['AccessMutations']>, ParentType, ContextType>;
  addToMyCart?: Resolver<Maybe<ResolversTypes['Cart']>, ParentType, ContextType, RequireFields<MutationAddToMyCartArgs, 'inventoryId' | 'quantity'>>;
  admin?: Resolver<Maybe<ResolversTypes['AdminMutations']>, ParentType, ContextType>;
  alias?: Resolver<Maybe<ResolversTypes['MailAliasMutations']>, ParentType, ContextType>;
  article?: Resolver<Maybe<ResolversTypes['ArticleMutations']>, ParentType, ContextType>;
  bookable?: Resolver<Maybe<ResolversTypes['BookableMutations']>, ParentType, ContextType>;
  bookingRequest?: Resolver<Maybe<ResolversTypes['BookingRequestMutations']>, ParentType, ContextType>;
  committee?: Resolver<Maybe<ResolversTypes['CommitteeMutations']>, ParentType, ContextType>;
  createProduct?: Resolver<Array<Maybe<ResolversTypes['Product']>>, ParentType, ContextType, RequireFields<MutationCreateProductArgs, 'input'>>;
  event?: Resolver<Maybe<ResolversTypes['EventMutations']>, ParentType, ContextType>;
  files?: Resolver<Maybe<ResolversTypes['FileMutations']>, ParentType, ContextType>;
  initiatePayment?: Resolver<ResolversTypes['Payment'], ParentType, ContextType, RequireFields<MutationInitiatePaymentArgs, 'phoneNumber'>>;
  mandate?: Resolver<Maybe<ResolversTypes['MandateMutations']>, ParentType, ContextType>;
  markdown?: Resolver<Maybe<ResolversTypes['MarkdownMutations']>, ParentType, ContextType>;
  member?: Resolver<Maybe<ResolversTypes['MemberMutations']>, ParentType, ContextType>;
  position?: Resolver<Maybe<ResolversTypes['PositionMutations']>, ParentType, ContextType>;
  removeFromMyCart?: Resolver<Maybe<ResolversTypes['Cart']>, ParentType, ContextType, RequireFields<MutationRemoveFromMyCartArgs, 'inventoryId' | 'quantity'>>;
  removeMyCart?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  tags?: Resolver<Maybe<ResolversTypes['TagMutations']>, ParentType, ContextType>;
  token?: Resolver<Maybe<ResolversTypes['TokenMutations']>, ParentType, ContextType>;
  updatePaymentStatus?: Resolver<ResolversTypes['Payment'], ParentType, ContextType, RequireFields<MutationUpdatePaymentStatusArgs, 'paymentId' | 'status'>>;
}>;

export type OrderResolvers<ContextType = any, ParentType extends ResolversParentTypes['Order'] = ResolversParentTypes['Order']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  payment?: Resolver<Maybe<ResolversTypes['Payment']>, ParentType, ContextType>;
  products?: Resolver<Maybe<Array<Maybe<ResolversTypes['Product']>>>, ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['Member'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PaginationInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['PaginationInfo'] = ResolversParentTypes['PaginationInfo']> = ResolversObject<{
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  page?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  perPage?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalPages?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PaymentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Payment'] = ResolversParentTypes['Payment']> = ResolversObject<{
  amount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  currency?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  paymentMethod?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  paymentStatus?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PolicyMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['PolicyMutations'] = ResolversParentTypes['PolicyMutations']> = ResolversObject<{
  createApiAccessPolicy?: Resolver<Maybe<ResolversTypes['AccessPolicy']>, ParentType, ContextType, RequireFields<PolicyMutationsCreateApiAccessPolicyArgs, 'input'>>;
  createDoorAccessPolicy?: Resolver<Maybe<ResolversTypes['AccessPolicy']>, ParentType, ContextType, RequireFields<PolicyMutationsCreateDoorAccessPolicyArgs, 'input'>>;
  remove?: Resolver<Maybe<ResolversTypes['AccessPolicy']>, ParentType, ContextType, RequireFields<PolicyMutationsRemoveArgs, 'id'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PositionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Position'] = ResolversParentTypes['Position']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Position']>, { __typename: 'Position' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  active?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  activeMandates?: Resolver<Maybe<Array<Maybe<ResolversTypes['Mandate']>>>, ParentType, ContextType>;
  boardMember?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  committee?: Resolver<Maybe<ResolversTypes['Committee']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  nameEn?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PositionMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['PositionMutations'] = ResolversParentTypes['PositionMutations']> = ResolversObject<{
  create?: Resolver<Maybe<ResolversTypes['Position']>, ParentType, ContextType, RequireFields<PositionMutationsCreateArgs, 'input'>>;
  remove?: Resolver<Maybe<ResolversTypes['Position']>, ParentType, ContextType, RequireFields<PositionMutationsRemoveArgs, 'id'>>;
  update?: Resolver<Maybe<ResolversTypes['Position']>, ParentType, ContextType, RequireFields<PositionMutationsUpdateArgs, 'id' | 'input'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PositionPaginationResolvers<ContextType = any, ParentType extends ResolversParentTypes['PositionPagination'] = ResolversParentTypes['PositionPagination']> = ResolversObject<{
  pageInfo?: Resolver<ResolversTypes['PaginationInfo'], ParentType, ContextType>;
  positions?: Resolver<Array<Maybe<ResolversTypes['Position']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProductResolvers<ContextType = any, ParentType extends ResolversParentTypes['Product'] = ResolversParentTypes['Product']> = ResolversObject<{
  category?: Resolver<Maybe<ResolversTypes['ProductCategory']>, ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  imageUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  inventory?: Resolver<Array<Maybe<ResolversTypes['Inventory']>>, ParentType, ContextType>;
  maxPerUser?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProductCategoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductCategory'] = ResolversParentTypes['ProductCategory']> = ResolversObject<{
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  alarmShouldBeActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  alias?: Resolver<Maybe<ResolversTypes['MailAlias']>, ParentType, ContextType, RequireFields<QueryAliasArgs, 'email'>>;
  aliases?: Resolver<Maybe<Array<Maybe<ResolversTypes['MailAlias']>>>, ParentType, ContextType>;
  api?: Resolver<Maybe<ResolversTypes['Api']>, ParentType, ContextType, RequireFields<QueryApiArgs, 'name'>>;
  apiAccess?: Resolver<Maybe<Array<ResolversTypes['Api']>>, ParentType, ContextType>;
  apis?: Resolver<Maybe<Array<ResolversTypes['Api']>>, ParentType, ContextType>;
  article?: Resolver<Maybe<ResolversTypes['Article']>, ParentType, ContextType, Partial<QueryArticleArgs>>;
  bookables?: Resolver<Maybe<Array<ResolversTypes['Bookable']>>, ParentType, ContextType, Partial<QueryBookablesArgs>>;
  bookingRequest?: Resolver<Maybe<ResolversTypes['BookingRequest']>, ParentType, ContextType, RequireFields<QueryBookingRequestArgs, 'id'>>;
  bookingRequests?: Resolver<Maybe<Array<ResolversTypes['BookingRequest']>>, ParentType, ContextType, Partial<QueryBookingRequestsArgs>>;
  committees?: Resolver<Maybe<ResolversTypes['CommitteePagination']>, ParentType, ContextType, RequireFields<QueryCommitteesArgs, 'page' | 'perPage'>>;
  door?: Resolver<Maybe<ResolversTypes['Door']>, ParentType, ContextType, RequireFields<QueryDoorArgs, 'name'>>;
  doors?: Resolver<Maybe<Array<ResolversTypes['Door']>>, ParentType, ContextType>;
  event?: Resolver<Maybe<ResolversTypes['Event']>, ParentType, ContextType, Partial<QueryEventArgs>>;
  events?: Resolver<Maybe<ResolversTypes['EventPagination']>, ParentType, ContextType, Partial<QueryEventsArgs>>;
  files?: Resolver<Maybe<Array<ResolversTypes['FileData']>>, ParentType, ContextType, RequireFields<QueryFilesArgs, 'bucket' | 'prefix'>>;
  getPayment?: Resolver<Maybe<ResolversTypes['Payment']>, ParentType, ContextType, RequireFields<QueryGetPaymentArgs, 'id'>>;
  mandatePagination?: Resolver<Maybe<ResolversTypes['MandatePagination']>, ParentType, ContextType, RequireFields<QueryMandatePaginationArgs, 'page' | 'perPage'>>;
  markdown?: Resolver<Maybe<ResolversTypes['Markdown']>, ParentType, ContextType, RequireFields<QueryMarkdownArgs, 'name'>>;
  markdowns?: Resolver<Array<Maybe<ResolversTypes['Markdown']>>, ParentType, ContextType>;
  me?: Resolver<Maybe<ResolversTypes['Member']>, ParentType, ContextType>;
  member?: Resolver<Maybe<ResolversTypes['Member']>, ParentType, ContextType, Partial<QueryMemberArgs>>;
  memberById?: Resolver<Maybe<ResolversTypes['Member']>, ParentType, ContextType, Partial<QueryMemberByIdArgs>>;
  members?: Resolver<Maybe<ResolversTypes['MemberPagination']>, ParentType, ContextType, RequireFields<QueryMembersArgs, 'page' | 'perPage'>>;
  myCart?: Resolver<Maybe<ResolversTypes['Cart']>, ParentType, ContextType>;
  news?: Resolver<Maybe<ResolversTypes['ArticlePagination']>, ParentType, ContextType, RequireFields<QueryNewsArgs, 'page' | 'perPage'>>;
  positions?: Resolver<Maybe<ResolversTypes['PositionPagination']>, ParentType, ContextType, RequireFields<QueryPositionsArgs, 'page' | 'perPage'>>;
  presignedPutUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<QueryPresignedPutUrlArgs, 'bucket' | 'fileName'>>;
  product?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<QueryProductArgs, 'id'>>;
  productCategories?: Resolver<Array<Maybe<ResolversTypes['ProductCategory']>>, ParentType, ContextType>;
  products?: Resolver<Array<Maybe<ResolversTypes['Product']>>, ParentType, ContextType, Partial<QueryProductsArgs>>;
  resolveAlias?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType, RequireFields<QueryResolveAliasArgs, 'alias'>>;
  resolveRecipients?: Resolver<Array<Maybe<ResolversTypes['MailRecipient']>>, ParentType, ContextType>;
  songById?: Resolver<Maybe<ResolversTypes['Song']>, ParentType, ContextType, RequireFields<QuerySongByIdArgs, 'id'>>;
  songByTitle?: Resolver<Maybe<ResolversTypes['Song']>, ParentType, ContextType, RequireFields<QuerySongByTitleArgs, 'title'>>;
  songs?: Resolver<Maybe<Array<Maybe<ResolversTypes['Song']>>>, ParentType, ContextType>;
  tag?: Resolver<Maybe<ResolversTypes['Tag']>, ParentType, ContextType, RequireFields<QueryTagArgs, 'id'>>;
  tags?: Resolver<Array<ResolversTypes['Tag']>, ParentType, ContextType>;
  token?: Resolver<Maybe<ResolversTypes['Token']>, ParentType, ContextType, RequireFields<QueryTokenArgs, 'expo_token'>>;
  userHasAccessToAlias?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<QueryUserHasAccessToAliasArgs, 'alias' | 'student_id'>>;
}>;

export type SongResolvers<ContextType = any, ParentType extends ResolversParentTypes['Song'] = ResolversParentTypes['Song']> = ResolversObject<{
  category?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  lyrics?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  melody?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TagResolvers<ContextType = any, ParentType extends ResolversParentTypes['Tag'] = ResolversParentTypes['Tag']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Tag']>, { __typename: 'Tag' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  color?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nameEn?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TagMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['TagMutations'] = ResolversParentTypes['TagMutations']> = ResolversObject<{
  create?: Resolver<Maybe<ResolversTypes['Tag']>, ParentType, ContextType, RequireFields<TagMutationsCreateArgs, 'input'>>;
  update?: Resolver<Maybe<ResolversTypes['Tag']>, ParentType, ContextType, RequireFields<TagMutationsUpdateArgs, 'id' | 'input'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TokenResolvers<ContextType = any, ParentType extends ResolversParentTypes['Token'] = ResolversParentTypes['Token']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Token']>, { __typename: 'Token' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  expo_token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  memberId?: Resolver<Maybe<ResolversTypes['UUID']>, ParentType, ContextType>;
  tagSubscriptions?: Resolver<Array<Maybe<ResolversTypes['Tag']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TokenMutationsResolvers<ContextType = any, ParentType extends ResolversParentTypes['TokenMutations'] = ResolversParentTypes['TokenMutations']> = ResolversObject<{
  register?: Resolver<Maybe<ResolversTypes['Token']>, ParentType, ContextType, RequireFields<TokenMutationsRegisterArgs, 'expo_token'>>;
  subscribe?: Resolver<Maybe<Array<ResolversTypes['UUID']>>, ParentType, ContextType, RequireFields<TokenMutationsSubscribeArgs, 'expo_token' | 'tagIds'>>;
  unsubscribe?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, RequireFields<TokenMutationsUnsubscribeArgs, 'expo_token' | 'tagIds'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface UuidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['UUID'], any> {
  name: 'UUID';
}

export type UpdateArticlePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateArticlePayload'] = ResolversParentTypes['UpdateArticlePayload']> = ResolversObject<{
  article?: Resolver<ResolversTypes['Article'], ParentType, ContextType>;
  uploadUrl?: Resolver<Maybe<ResolversTypes['Url']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UploadDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['UploadData'] = ResolversParentTypes['UploadData']> = ResolversObject<{
  fileUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uploadUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface UrlScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Url'], any> {
  name: 'Url';
}

export type FileChangeResolvers<ContextType = any, ParentType extends ResolversParentTypes['fileChange'] = ResolversParentTypes['fileChange']> = ResolversObject<{
  file?: Resolver<ResolversTypes['FileData'], ParentType, ContextType>;
  oldFile?: Resolver<Maybe<ResolversTypes['FileData']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  AccessMutations?: AccessMutationsResolvers<ContextType>;
  AccessPolicy?: AccessPolicyResolvers<ContextType>;
  AdminMutations?: AdminMutationsResolvers<ContextType>;
  Api?: ApiResolvers<ContextType>;
  Article?: ArticleResolvers<ContextType>;
  ArticleMutations?: ArticleMutationsResolvers<ContextType>;
  ArticlePagination?: ArticlePaginationResolvers<ContextType>;
  ArticlePayload?: ArticlePayloadResolvers<ContextType>;
  Author?: AuthorResolvers<ContextType>;
  Bookable?: BookableResolvers<ContextType>;
  BookableCategory?: BookableCategoryResolvers<ContextType>;
  BookableMutations?: BookableMutationsResolvers<ContextType>;
  BookingRequest?: BookingRequestResolvers<ContextType>;
  BookingRequestMutations?: BookingRequestMutationsResolvers<ContextType>;
  Cart?: CartResolvers<ContextType>;
  CartInventory?: CartInventoryResolvers<ContextType>;
  CartItem?: CartItemResolvers<ContextType>;
  Comment?: CommentResolvers<ContextType>;
  Committee?: CommitteeResolvers<ContextType>;
  CommitteeMutations?: CommitteeMutationsResolvers<ContextType>;
  CommitteePagination?: CommitteePaginationResolvers<ContextType>;
  CreateArticlePayload?: CreateArticlePayloadResolvers<ContextType>;
  Date?: GraphQLScalarType;
  Datetime?: GraphQLScalarType;
  Discount?: DiscountResolvers<ContextType>;
  Door?: DoorResolvers<ContextType>;
  DoorMutations?: DoorMutationsResolvers<ContextType>;
  Event?: EventResolvers<ContextType>;
  EventMutations?: EventMutationsResolvers<ContextType>;
  EventPagination?: EventPaginationResolvers<ContextType>;
  FastMandate?: FastMandateResolvers<ContextType>;
  FileData?: FileDataResolvers<ContextType>;
  FileMutations?: FileMutationsResolvers<ContextType>;
  Inventory?: InventoryResolvers<ContextType>;
  MailAlias?: MailAliasResolvers<ContextType>;
  MailAliasMutations?: MailAliasMutationsResolvers<ContextType>;
  MailAliasPolicy?: MailAliasPolicyResolvers<ContextType>;
  MailRecipient?: MailRecipientResolvers<ContextType>;
  Mandate?: MandateResolvers<ContextType>;
  MandateMutations?: MandateMutationsResolvers<ContextType>;
  MandatePagination?: MandatePaginationResolvers<ContextType>;
  Markdown?: MarkdownResolvers<ContextType>;
  MarkdownMutations?: MarkdownMutationsResolvers<ContextType>;
  MarkdownPayload?: MarkdownPayloadResolvers<ContextType>;
  Member?: MemberResolvers<ContextType>;
  MemberMutations?: MemberMutationsResolvers<ContextType>;
  MemberPagination?: MemberPaginationResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Order?: OrderResolvers<ContextType>;
  PaginationInfo?: PaginationInfoResolvers<ContextType>;
  Payment?: PaymentResolvers<ContextType>;
  PolicyMutations?: PolicyMutationsResolvers<ContextType>;
  Position?: PositionResolvers<ContextType>;
  PositionMutations?: PositionMutationsResolvers<ContextType>;
  PositionPagination?: PositionPaginationResolvers<ContextType>;
  Product?: ProductResolvers<ContextType>;
  ProductCategory?: ProductCategoryResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Song?: SongResolvers<ContextType>;
  Tag?: TagResolvers<ContextType>;
  TagMutations?: TagMutationsResolvers<ContextType>;
  Token?: TokenResolvers<ContextType>;
  TokenMutations?: TokenMutationsResolvers<ContextType>;
  UUID?: GraphQLScalarType;
  UpdateArticlePayload?: UpdateArticlePayloadResolvers<ContextType>;
  UploadData?: UploadDataResolvers<ContextType>;
  Url?: GraphQLScalarType;
  fileChange?: FileChangeResolvers<ContextType>;
}>;

