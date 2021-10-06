const routes = {
    root: '/',
    article: articleId => `/news/article/${articleId}`,
    member: memberId => `/members/${memberId}`,
    editMember: memberId => `/members/edit/${memberId}`,
    news: '/news',
    editArticle: articleId => `/news/article/edit/${articleId}`,
    createArticle: '/news/article/create',
    documents: '#documents',
    statues: '#statues',
    regulations: '#reglemente',
    meetingDocuments: '#meetingDocuments',
    calendar: '/calendar',
    booking: '/booking',
    archive: '#archive',
    pictures: '#pictures',
    songs: '#songs',
}

export default routes;