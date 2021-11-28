# Member page
This repository contains:
 - Frontend for members.dsek.se
 - Backend for api.dsek.se
 - File server for files.dsek.se

## Prerequisites
- Docker
- `.env` file in the root directory
- `.env.local` file in the frontend directory
- nodejs (version 16) and npm (development only)
- (recommended) Visual studio code for typescript and the eslint extension (development only)

### Example .env
```
POSTGRES_HOST=database
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=dsek
POSTGRES_VERSION=13
PGADMIN_DEFAULT_EMAIL=user@dsek.se
PGADMIN_DEFAULT_PASSWORD=password
PGADMIN_DISABLE_POSTFIX=true

MINIO_ROOT_USER=user
MINIO_ROOT_PASSWORD=password
MINIO_ENDPOINT=192.168.86.21
MINIO_PORT=9000
MINIO_USE_SSL=false

MEILI_HOST=http://search:7700
MEILI_MASTER_KEY=password

GRAPHQL_ADDRESS=http://192.168.86.21:4000/graphql

# Only during testing of keycloak integration
KEYCLOAK_ADMIN_USERNAME=# admin username
KEYCLOAK_ADMIN_PASSWORD=# admin password
KEYCLOAK_ENDPOINT=https://portal.dsek.se/
KEYCLOAK_ENABLED=false
```
To make sure the enpoint works correctly MINIO_ENDPOINT and GRAPHQL_ADDRESS has to be your local ip-address and can't be localhost.

### Example .env.local
```
NEXT_PUBLIC_FRONTEND_ADDRESS=http://localhost:3000
NEXT_PUBLIC_MINIO_ADDRESS=http://localhost:9000
NEXT_PUBLIC_GRAPHQL_ADDRESS=http://192.168.86.21:4000/graphql
```

## Deployment
Run the following command:
```bash
> docker-compose --env-file .env -f docker-compose.yml -f docker-compose.minio.yml -f docker-compose.prod.yml up -d --build
```

## Development
Run the following command:
```bash
cd member-page
npm install #If you have not done this before, this will install the eslint config
```

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

### Database setup
First time using pg Admin you need to connect it to the database. To do this add a new server with the following options:
Name: (Can be whatever)
Username (POSTGRES_USER from .env)
Password (POSTGRES_PASSWORD from .env)
Host: host.docker.internal
Port: 5432

### Generating a new service
To generate a new service run the following command:
```bash
cd tools/cli
npm install #If you have not done this before
npm run generate -- <serviceName> #Where <serviceName> is replaced with desired name
```

Note: \<serviceName> cannot be the same name as an existing service.

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
