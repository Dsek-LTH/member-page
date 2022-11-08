# Build details

### Create an .env file (example)
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

GRAPHQL_ADDRESS=http://localhost:4000/graphql
SANDBOX=true

# Only during testing of keycloak integration
KEYCLOAK_ADMIN_USERNAME=# admin username
KEYCLOAK_ADMIN_PASSWORD=# admin password
KEYCLOAK_ENDPOINT=https://portal.dsek.se/
KEYCLOAK_ENABLED=false
```
To make sure the enpoint works correctly MINIO_ENDPOINT and GRAPHQL_ADDRESS has to be your local ip-address and can't be localhost.

### Create .env.local file for frontend (example)
```
NEXT_PUBLIC_FRONTEND_ADDRESS=http://localhost:3000
NEXT_PUBLIC_MINIO_ADDRESS=http://localhost:9000
NEXT_PUBLIC_GRAPHQL_ADDRESS=http://localhost:4000/graphql
#NEXT_PUBLIC_GRAPHQL_ADDRESS=https://graphql.api.sandbox.dsek.se/
MEILI_HOST=http://localhost:7700
MEILI_MASTER_KEY=password
```

## Development
Run the following command:
```bash
cd member-page
npm install #If you have not done this before, this will install the eslint config

and then:
```bash
> docker compose --env-file .env -f docker-compose.yml -f docker-compose.minio.yml -f docker-compose.dev.yml up -d --build
```

## Deployment
Run the following command:
```bash
> docker compose --env-file .env -f docker-compose.yml -f docker-compose.minio.yml -f docker-compose.prod.yml up -d --build
```