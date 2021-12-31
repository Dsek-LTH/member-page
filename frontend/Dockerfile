FROM node:16-alpine

RUN apk add curl
HEALTHCHECK CMD curl -f http://localhost:3000/api/health || exit 1

WORKDIR /project/app

ENV NODE_ENV=development

COPY ./frontend/package*.json ./

RUN npm install

CMD npm run dev