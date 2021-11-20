const routes = {
    root: '/',
    article: articleId => `/news/article/${articleId}`,
    member: memberId => `/members/${memberId}`,
    editMember: memberId => `/members/edit/${memberId}`,
    news: '/news',
    editArticle: articleId => `/news/article/edit/${articleId}`,
    createArticle: '/news/article/create',
    documents: '/documents',
    statues: 'https://github.com/Dsek-LTH/stadgar/releases/latest/download/stadgar.pdf',
    regulations: 'https://github.com/Dsek-LTH/reglemente/releases/latest/download/reglemente.pdf',
    meetingDocuments: '/documents',
    calendar: '/calendar',
    booking: '/booking',
    archive: '#archive',
    pictures: '#pictures',
    songs: '#songs',
}

export default routes;