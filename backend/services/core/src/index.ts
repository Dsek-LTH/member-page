import createApolloServer from './server';
import { context, knex } from 'dsek-shared';
import dataSources from './datasources';
import { schedule } from 'node-cron';
import kcClient from './keycloak';

schedule('0 0 * * *', async () => {
  const log = (msg: string) => console.log(`[${new Date().toISOString()}] ${msg}`);
  log(`Updating keycloak mandates`);

  const today = new Date()
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)

  const newMandates = await knex<{keycloak_id: string, position_id: string}>('mandates').join('keycloak', 'mandates.member_id', 'keycloak.member_id').where({start_date: today.toISOString().substring(0, 10)}).select('keycloak_id', 'position_id')
  log(`Found ${newMandates.length} new mandates`);

  const oldMandates = await knex('mandates').join('keycloak', 'mandates.member_id', 'keycloak.member_id').where({end_date: yesterday.toISOString().substring(0, 10)}).select('keycloak_id', 'position_id')
  log(`Found ${oldMandates.length} old mandates`);

  log(`Updating keycloak...`);
  await Promise.all(newMandates.map((mandate) => kcClient
    .createMandate(mandate.keycloak_id, mandate.position_id)
    .then(() => log(`Added mandate ${mandate.keycloak_id}->${mandate.position_id}`))
    .catch(() => log(`Failed to add mandate ${mandate.keycloak_id}->${mandate.position_id}`))
  ));

  await Promise.all(oldMandates.map((mandate) => kcClient
    .deleteMandate(mandate.keycloak_id, mandate.position_id)
    .then(() => log(`Added mandate ${mandate.keycloak_id}->${mandate.position_id}`))
    .catch(() => log(`Failed to add mandate ${mandate.keycloak_id}->${mandate.position_id}`))
  ));
  log(`Done updating mandates`);
});

const server = createApolloServer(context.deserializeContext, dataSources);

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});