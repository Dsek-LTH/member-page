const routes = {
  root: "/",
  article: (articleId) => `/news/article/${articleId}`,
  member: (memberId) => `/members/${memberId}`,
  editMember: (memberId) => `/members/${memberId}/edit`,
  news: "/news",
  editArticle: (articleId) => `/news/article/${articleId}/edit`,
  createArticle: "/news/article/create",
  event: (eventId) => `/event/${eventId}`,
  editEvent: (eventId) => `/event/${eventId}/edit`,
  createEvent: "/event/create",
  documents: "#documents",
  statues: "#statues",
  regulations: "#reglemente",
  meetingDocuments: "#meetingDocuments",
  calendar: "/calendar",
  booking: "/booking",
  archive: "#archive",
  pictures: "#pictures",
  songs: "#songs",
};

export default routes;
