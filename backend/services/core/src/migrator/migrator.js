const { backOff } = require('exponential-backoff');
const {
  knex, minio, meilisearch, createLogger,
} = require('../shared');
const meilisearchSeed = require('./searchData');

const logger = createLogger('migrator');

const migrate = () => backOff(async () => {
  const pastVersion = await knex.migrate.currentVersion();
  await knex.migrate.latest();
  const newVersion = await knex.migrate.currentVersion();
  logger.info('Migration successful');
  if (pastVersion === newVersion) logger.info('Already latest version');
  else logger.info(`migrated from ${pastVersion} to ${newVersion}`);
}, {
  retry: (e, i) => {
    logger.error(`MIGRATION ATTEMPT ${i} FAILED`);
    logger.error(e);
    return true;
  },
}).then(() => true).catch(() => false);

const seed = async () => {
  try {
    const [seeds] = await knex.seed.run();
    logger.info('Seed successful');
    logger.info('Seeds applied:');
    seeds.forEach((s) => logger.info(`\t${s}`));
  } catch (e) {
    logger.error('SEEDS FAILED');
    logger.error(e);
  }
};

const seedMeilisearch = async () => {
  try {
    await meilisearchSeed(knex, meilisearch);
    logger.info('Meilisearch seed successful');
  } catch (e) {
    logger.error('MEILISEARCH SEEDS FAILED');
    logger.error(e);
  }
};

const buckets = [
  'news',
  'photos',
  'members',
  'documents',
  'files',
];

// https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html
const publicBucketPolicy = (bucket) => ({
  Version: '2012-10-17',
  Statement: [
    {
      Sid: 'PublicList',
      Action: ['s3:GetBucketLocation', 's3:ListBucket'],
      Effect: 'Allow',
      Principal: {
        AWS: ['*'],
      },
      Resource: [`arn:aws:s3:::${bucket}`],
    },
    {
      Sid: 'PublicRead',
      Action: ['s3:GetObject'],
      Effect: 'Allow',
      Principal: {
        AWS: ['*'],
      },
      Resource: [`arn:aws:s3:::${bucket}/public/*`],
    },
  ],
});

const createMinioBuckets = async () => {
  try {
    await Promise.all(buckets.map(async (b) => {
      const found = await minio.bucketExists(b);
      if (!found) {
        logger.info(`Bucket ${b} not found. Creating bucket ${b}`);
        minio.makeBucket(b);
        logger.info(`Setting ${b} access policy`);
        await minio.setBucketPolicy(b, JSON.stringify(publicBucketPolicy(b)));
        logger.info(`Bucket: ${b} access policy set`);
        logger.info(`Bucket: ${b} created`);
      } else {
        logger.info(`Bucket: ${b} already exists`);
        logger.info(`Setting ${b} access policy`);
        await minio.setBucketPolicy(b, JSON.stringify(publicBucketPolicy(b)));
        logger.info(`Bucket: ${b} access policy set`);
      }
    }));
  } catch (e) {
    logger.error('CREATING MINIO BUCKETS FAILED');
    logger.error(e);
  }
};

const run = async () => {
  logger.info('MIGRATE');
  const success = (process.argv.includes('migrate'))
    ? await migrate()
    : (() => { logger.info('No migrations applied'); return true; })();
  logger.info('===================');
  logger.info('SEED');
  if (process.env.NODE_ENV !== 'production' && success && process.argv.includes('seed')) await seed();
  else logger.info('No seeds applied');
  logger.info('===================');
  logger.info('MEILISEARCH SEED');
  if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') await seedMeilisearch();
  else logger.info('No meilisearch seeds applied');
  logger.info('===================');
  logger.info('MINIO');
  if (process.argv.includes('minio')) {
    logger.info('Creating minio buckets');
    await createMinioBuckets();
  } else {
    logger.info('No minio buckets created');
  }
  logger.info('===================');
  logger.info('DONE');
  process.exit(0);
};

run();
