/* eslint-disable no-console */
const fs = require('fs');
const degit = require('degit');
const replace = require('replace-in-file');
const capitalize = require('capitalize');
const pluralize = require('pluralize');
const path = require('path');

const args = process.argv.slice(2);
const fsPromises = fs.promises;

const serviceTemplate = 'Dsek-LTH/service-template';

const dir = '/../../backend/services/';
const serviceName = args[0].toLowerCase();
const serviceDir = dir + serviceName;

const absPath = (relPath) => path.join(__dirname, serviceDir, relPath);

const serviceNameCapitalize = capitalize(serviceName);
const serviceNamePluralize = pluralize(serviceName);
const serviceNameCaptializePluralize = pluralize(serviceNameCapitalize);

const renameFiles = [
  {
    from: absPath('/src/datasources/__serviceNameCaptializePluralize__.ts'),
    to: absPath(`/src/datasources/${serviceNameCaptializePluralize}.ts`),
  },
  {
    from: absPath('/tests/__serviceName__.spec.ts'),
    to: absPath(`/tests/${serviceName}.spec.ts`),
  },
];

const options = {
  files: [
    absPath('/**/*.ts'),
    absPath('/**/*.json'),
    absPath('/**/Dockerfile*'),
  ],
  from: /__serviceName__/g,
  to: serviceName,
};

const optionsCapitalize = {
  files: [
    absPath('/**/*.ts'),
    absPath('/**/*.json'),
  ],
  from: /__serviceNameCapitalize__/g,
  to: serviceNameCapitalize,
};

const optionsPluralize = {
  files: [
    absPath('/**/*.ts'),
    absPath('/**/*.json'),
  ],
  from: /__serviceNamePluralize__/g,
  to: serviceNamePluralize,
};

const optionsCapitalizePluralize = {
  files: [
    absPath('/**/*.ts'),
    absPath('/**/*.json'),
  ],
  from: /__serviceNameCaptializePluralize__/g,
  to: serviceNameCaptializePluralize,
};

console.log(`Creating ${serviceName} in ${__dirname}${serviceDir}`);

const emitter = degit(serviceTemplate, {
  cache: false,
  force: false,
  verbose: true,
});

emitter.on('info', (info) => {
  console.log(info.message);
});

async function cloneTemplate() {
  try {
    await emitter.clone(absPath(''));
    await replace(options);
    await replace(optionsCapitalize);
    await replace(optionsPluralize);
    await replace(optionsCapitalizePluralize);
    await Promise.all(renameFiles.map(({ from, to }) => fsPromises.rename(from, to)));
    console.log('done');
  } catch (error) {
    if (error.code === 'DEST_NOT_EMPTY') {
      console.log(`${serviceName} is already in services`);
    } else {
      console.error(error);
    }
  }
}

cloneTemplate();
