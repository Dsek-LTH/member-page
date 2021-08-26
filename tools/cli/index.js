const fs = require('fs');
const degit = require('degit');
const replace = require('replace-in-file');
const capitalize = require('capitalize');
const pluralize = require('pluralize');

const args = process.argv.slice(2);
const fsPromises = fs.promises;

const serviceTemplate = 'Dsek-LTH/service-template';

const dir = "/../../backend/services/";
const serviceName = args[0].toLowerCase();
const serviceDir = dir + serviceName

const serviceNameCapitalize = capitalize(serviceName);
const serviceNamePluralize = pluralize(serviceName);
const serviceNameCaptializePluralize = pluralize(serviceNameCapitalize);

const renameFiles = [
  {
    from: __dirname + serviceDir + '/src/datasources/__serviceNameCaptializePluralize__.ts',
    to: __dirname + serviceDir + '/src/datasources/' + serviceNameCaptializePluralize + '.ts',
  },
  {
    from: __dirname + serviceDir + '/tests/__serviceName__.spec.ts',
    to: __dirname + serviceDir + '/tests/' + serviceName + '.spec.ts',
  },
]

const options = {
  files: [
    __dirname + serviceDir + '/**/*.ts',
    __dirname + serviceDir + '/**/*.json',
    __dirname + serviceDir + '/**/Dockerfile*',
  ],
  from: /__serviceName__/g,
  to: serviceName,
};

const optionsCapitalize = {
  files: [
    __dirname + serviceDir + '/**/*.ts',
    __dirname + serviceDir + '/**/*.json',
  ],
  from: /__serviceNameCapitalize__/g,
  to: serviceNameCapitalize,
};

const optionsPluralize = {
  files: [
    __dirname + serviceDir + '/**/*.ts',
    __dirname + serviceDir + '/**/*.json',
  ],
  from: /__serviceNamePluralize__/g,
  to: serviceNamePluralize,
};

const optionsCapitalizePluralize = {
  files: [
    __dirname + serviceDir + '/**/*.ts',
    __dirname + serviceDir + '/**/*.json',
  ],
  from: /__serviceNameCaptializePluralize__/g,
  to: serviceNameCaptializePluralize,
};

console.log('Creating ' + serviceName + ' in ' + __dirname + serviceDir);

const emitter = degit(serviceTemplate, {
	cache: false,
	force: false,
	verbose: true,
});

emitter.on('info', info => {
	console.log(info.message);
});

async function cloneTemplate() {
  try {
    await emitter.clone(__dirname + serviceDir);
    await replace(options);
    await replace(optionsCapitalize);
    await replace(optionsPluralize);
    await replace(optionsCapitalizePluralize);
    for (file of renameFiles) {
      await fsPromises.rename(file.from, file.to);
    }
    console.log('done');
  } catch(error) {
    if (error.code === 'DEST_NOT_EMPTY') {
      console.log(serviceName + ' is already in services');
    } else {
      console.error(error);
    }
  }
}

cloneTemplate()