FROM node:16-alpine

RUN apk add curl
HEALTHCHECK CMD curl -f http://localhost:4000/.well-known/apollo/server-health || exit 1

WORKDIR /project/app

ENV NODE_ENV=development

COPY ./backend/gateway/package*.json ./backend/gateway/tsconfig.json ./

COPY ./backend/shared/package*.json ./backend/shared/tsconfig.json ../shared/
RUN cd ../shared && npm install

RUN npm install ../shared
RUN npm install

CMD npm run dev