FROM node:16-alpine

RUN apk add curl
HEALTHCHECK CMD curl -f http://localhost:4000/graphql?query=%7B__typename%7D || exit 1

WORKDIR /project/app

ENV NODE_ENV=development

COPY ./backend/services/core/*.json ./backend/services/core/*.yml ./

RUN apk add --no-cache --virtual .gyp python3 make g++
RUN npm install
RUN apk del .gyp

CMD npm run dev