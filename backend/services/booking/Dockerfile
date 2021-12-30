FROM node:16-alpine

RUN apk add curl
HEALTHCHECK CMD curl -f http://localhost:4000/graphql?query=%7B__typename%7D || exit 1

WORKDIR /project/app

ENV NODE_ENV=development

COPY ./backend/services/booking/*.json ./backend/services/booking/*.yml ./

COPY ./backend/shared/package*.json ./backend/shared/tsconfig.json ../shared/

RUN apk add --no-cache --virtual .gyp python3 make g++
RUN cd ../shared && npm install

RUN npm install ../shared
RUN npm install
RUN apk del .gyp

CMD npm run dev