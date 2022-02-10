# Create the main .env file
> .env
echo 'POSTGRES_HOST=database
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=dsek
POSTGRES_VERSION=13
PGADMIN_DEFAULT_EMAIL=user@dsek.se
PGADMIN_DEFAULT_PASSWORD=password
PGADMIN_DISABLE_POSTFIX=true

MINIO_ROOT_USER=user
MINIO_ROOT_PASSWORD=password
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false

MEILI_HOST=http://search:7700
MEILI_MASTER_KEY=password

GRAPHQL_ADDRESS=http://localhost:4000/graphql
' >> .env

# Create the frontend .env file
> frontend/.env.local
echo 'NEXT_PUBLIC_FRONTEND_ADDRESS=http://localhost:3000
NEXT_PUBLIC_MINIO_ADDRESS=http://localhost:9000
NEXT_PUBLIC_GRAPHQL_ADDRESS=http://localhost:4000/graphql

MEILI_HOST=http://localhost:7700
MEILI_MASTER_KEY=password' >> frontend/.env.local

# Install the eslint config
npm install

# Install and build shared javascript
cd backend/shared
npm install
npm run build
cd ../..

# Install frontend dependencies
cd frontend
npm install
cd ..

# Run the development docker command
docker compose --env-file .env -f docker-compose.yml -f docker-compose.minio.yml -f docker-compose.dev.yml up -d --build