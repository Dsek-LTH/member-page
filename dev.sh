docker compose --env-file .env -f docker-compose.yml -f docker-compose.minio.yml -f docker-compose.dev.yml up -d --build
cd backend/shared && npm install && npm run dev