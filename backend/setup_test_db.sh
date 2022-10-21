docker run --name postgres-test -p 9999:5432 -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -e POSTGRES_DB=dsek -d postgres:14-alpine
cd services/core
npm install
npm run migrate-test