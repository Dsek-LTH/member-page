async function meilisearchSeed(knex, meilisearch) {
    await meilisearch.deleteIndexIfExists('members');
    const members = await knex.select('id', 'student_id', 'first_name', 'nickname', 'last_name').from('members');
    const index = meilisearch.index('members');
    await index.addDocuments(members);
}

module.exports = meilisearchSeed;