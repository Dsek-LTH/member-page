const routes = {
  root: "/",
  onboarding: "/onboarding",
  article: (articleId) => `/news/article/${articleId}`,
  member: (memberId) => `/members/${memberId}`,
  editMember: (memberId) => `/members/${memberId}/edit`,
  news: "/news",
  editArticle: (articleId) => `/news/article/${articleId}/edit`,
  createArticle: "/news/article/create",
  mandateByYear: (year) => `/mandates/${year}`,
  committees: "/committees",
  positions: (committeeId) => `committees/${committeeId}/positions`,
  events: "/events",
  event: (eventId) => `/events/${eventId}`,
  editEvent: (eventId) => `/events/${eventId}/edit`,
  createEvent: "/events/create",
  documents: "#documents",
  statues:
    "https://github.com/Dsek-LTH/stadgar/releases/latest/download/stadgar.pdf",
  regulations:
    "https://github.com/Dsek-LTH/reglemente/releases/latest/download/reglemente.pdf",
  meetingDocuments: "/documents",
  calendar: "/calendar",
  booking: "/booking",
  archive: "#archive",
  pictures: "#pictures",
  songs: "#songs",
};
export default routes;
