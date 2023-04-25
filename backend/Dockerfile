FROM node:16-alpine

RUN apk add curl
HEALTHCHECK CMD curl -f http://localhost:4000/graphql?query=%7B__typename%7D || exit 1

WORKDIR /backend

ENV NODE_ENV=development

COPY ./backend/ ./

CMD npm run dev