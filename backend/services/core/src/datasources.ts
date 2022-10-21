import { knex } from './shared';
import MemberAPI from './datasources/Member';
import PositionAPI from './datasources/Position';
import CommitteeAPI from './datasources/Committee';
import MandateAPI from './datasources/Mandate';
import AccessAPI from './datasources/Access';
import MailAPI from './datasources/Mail';
import FilesApi from './datasources/Files';
import TagsAPI from './datasources/Tags';
import NewsAPI from './datasources/News';
import MarkdownsAPI from './datasources/Markdowns';
import NotificationsAPI from './datasources/Notifications';
import EventAPI from './datasources/Events';
import BookingRequestAPI from './datasources/BookingRequest';

export interface DataSources {
  memberAPI: MemberAPI,
  positionAPI: PositionAPI,
  committeeAPI: CommitteeAPI,
  mandateAPI: MandateAPI,
  accessAPI: AccessAPI,
  mailAPI: MailAPI,
  filesAPI: FilesApi,
  newsAPI: NewsAPI,
  markdownsAPI: MarkdownsAPI,
  notificationsAPI: NotificationsAPI,
  tagsAPI: TagsAPI,
  eventAPI: EventAPI
  bookingRequestAPI: BookingRequestAPI,
}

const dataSources = () => ({
  memberAPI: new MemberAPI(knex),
  positionAPI: new PositionAPI(knex),
  committeeAPI: new CommitteeAPI(knex),
  mandateAPI: new MandateAPI(knex),
  accessAPI: new AccessAPI(knex),
  mailAPI: new MailAPI(knex),
  filesAPI: new FilesApi(knex),
  newsAPI: new NewsAPI(knex),
  markdownsAPI: new MarkdownsAPI(knex),
  notificationsAPI: new NotificationsAPI(knex),
  tagsAPI: new TagsAPI(knex),
  eventAPI: new EventAPI(knex),
  bookingRequestAPI: new BookingRequestAPI(knex),
});

export default dataSources;
