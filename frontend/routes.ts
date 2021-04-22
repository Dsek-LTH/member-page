const routes = {
    root: '/',
    article: articleId => `/news/article/${articleId}`,
    member: memberId => `/members/${memberId}`,
    news: '/news',
    documents: '#documents',
    statues: '#statues',
    regulations: '#reglemente',
    meetingDocuments: '#meetingDocuments',
    calendar: '#calendar',
    booking: '#booking',
    archive: '#archive',
    pictures: '#pictures',
    songs: '#songs',

}

export default routes;