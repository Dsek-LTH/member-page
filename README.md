# Member page
This repository contains:
 - Frontend for members.dsek.se
 - Backend for api.dsek.se
 - File server for files.dsek.se

## Prerequisites
- Docker
- `.env` file
- nodejs and npm (development only)
- (recommended) Visual studio code for typescript (development only)

### Example .env
```
MYSQL_ROOT_PASSWORD=password
MYSQL_USER=user
MYSQL_PASSWORD=password
MYSQL_DATABASE=dsek
MYSQL_HOST=database
MYSQL_VERSION=8.0

MINIO_ROOT_USER=user
MINIO_ROOT_PASSWORD=password
MINIO_ENDPOINT=192.168.86.21
MINIO_PORT=9000
MINIO_USE_SSL=false
```
MINIO_ENDPOINT has to be your local ip-address and can't be localhost for the endpoint to work correctly.

## Deployment
Run the following command:
```bash
> docker-compose --env-file .env -f docker-compose.yml -f docker-compose.minio.yml -f docker-compose.prod.yml up -d --build
```

## Development
Run the following command:
```bash
cd backend/shared
npm install #If you have not done this before
npm run dev
```
and (i a seperate console):
```bash
> docker-compose --env-file .env -f docker-compose.yml -f docker-compose.minio.yml -f docker-compose.dev.yml up -d --build
```

Note: Hot reload is enabled for the backend and frontend but you need to rebuild a container if a new package is added with npm.

## Commit messages

The commit messages in this project should follow this standard:

tag(issue number): Short description

Long description

    tag: What type of change it is, e.g. feature, refactor, bugfix.
        feature: new functionallity
        bugfix: fixes erroneous functionallity
        refactor: no functionallity change but nicer looking code
        config: changes to config files
        build: changes to build files, process etc.
        misc: other changes, e.g. README
    issue number: Which issue it relates to. Must begin with a hashtag.
    Short description: Should not be longer than 70 characters. Should be written in imperative mood.
    Long description: OPTIONAL, if a longer description is needed write in whatever format you want.

Example

feature(#4): Add a contribution description
# Member page
This repository contains:
 - Frontend for members.dsek.se
 - Backend for api.dsek.se
 - File server for files.dsek.se

## Prerequisites
- Docker
- `.env` file
- nodejs and npm (development only)
- (recommended) Visual studio code for typescript (development only)

### Example .env
```
MYSQL_ROOT_PASSWORD=password
MYSQL_USER=user
MYSQL_PASSWORD=password
MYSQL_DATABASE=dsek
MYSQL_HOST=database
MYSQL_VERSION=8.0

MINIO_ROOT_USER=user
MINIO_ROOT_PASSWORD=password
MINIO_ENDPOINT=192.168.86.21
MINIO_PORT=9000
MINIO_USE_SSL=false
```
MINIO_ENDPOINT has to be your local ip-address and can't be localhost for the endpoint to work correctly.

## Deployment
Run the following command:
```bash
> docker-compose --env-file .env -f docker-compose.yml -f docker-compose.minio.yml -f docker-compose.prod.yml up -d --build
```

## Development
Run the following command:
```bash
cd backend/shared
npm install #If you have not done this before
npm run dev
```
and (i a seperate console):
```bash
> docker-compose --env-file .env -f docker-compose.yml -f docker-compose.minio.yml -f docker-compose.dev.yml up -d --build
```

Note: Hot reload is enabled for the backend and frontend but you need to rebuild a container if a new package is added with npm.

## Commit messages

The commit messages in this project should follow this standard:

tag(issue number): Short description

Long description

    tag: What type of change it is, e.g. feature, refactor, bugfix.
        feature: new functionallity
        bugfix: fixes erroneous functionallity
        refactor: no functionallity change but nicer looking code
        config: changes to config files
        build: changes to build files, process etc.
        misc: other changes, e.g. README
    issue number: Which issue it relates to. Must begin with a hashtag.
    Short description: Should not be longer than 70 characters. Should be written in imperative mood.
    Long description: OPTIONAL, if a longer description is needed write in whatever format you want.

Example

feature(#4): Add a contribution description
