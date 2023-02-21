const routes = {
  root: '/',
  webshop: '/webshop',
  cart: '/webshop/cart',
  checkout: '/webshop/checkout',
  awaitPayment: (paymentId: string) => `/webshop/await-payment/${paymentId}`,
  onboarding: '/onboarding',
  article: (articleId) => `/news/article/${articleId}`,
  member: (memberId) => `/members/${memberId}`,
  settings: '/settings',
  memberChest: (studentId) => `/members/${studentId}/chest`,
  editMember: (memberId) => `/members/${memberId}/edit`,
  changeProfilePicture: (memberId) => `/members/${memberId}/change-profile-picture`,
  news: '/news',
  editArticle: (articleId) => `/news/article/${articleId}/edit`,
  newsAdmin: '/news/admin',
  tags: '/news/admin/tags',
  editTag: (tagId) => `/news/admin/tags/${tagId}`,
  createTag: '/news/admin/tags/create',
  createArticle: '/news/article/create',
  mandateByYear: (year) => `/mandates/${year}`,
  guild: '/guild',
  committees: '/committees',
  committeePage: (committeeId) => `committees/${committeeId}`,
  events: '/events',
  passedEvents: '/events/passed',
  event: (eventId) => `/events/${eventId}`,
  editEvent: (eventId) => `/events/${eventId}/edit`,
  createEvent: '/events/create',
  documents: '/documents',
  statues:
    'https://github.com/Dsek-LTH/stadgar/releases/latest/download/stadgar.pdf',
  regulations:
    'https://github.com/Dsek-LTH/reglemente/releases/latest/download/reglemente.pdf',
  policy: '/documents/policy',
  srd: '/documents/srd',
  kravprofiler: '/documents/kravprofiler',
  meetingDocuments: '/documents',
  calendar: '/calendar',
  calendarDownload: (langaugeCode) => `/api/calendar/download/${langaugeCode}`,
  searchApi: '/api/search',
  eventsSearchApi: '/api/searchevents',
  articlesSearchApi: '/api/searcharticles',
  booking: '/booking',
  bookables: '/booking/bookables',
  editBookable: (id) => `/booking/bookables/${id}`,
  createBookable: '/booking/bookables/create',
  doors: '/doors/edit',
  editApis: '/apis/edit',
  archive: '#archive',
  photos: '/photos',
  songs: '/songs',
  song: (title) => `/songs/${title}`,
  cafe: '/cafe',
  mailAlias: '/mail-alias/edit',
  markdownsAdmin: '/markdowns/admin',
};
export default routes;
