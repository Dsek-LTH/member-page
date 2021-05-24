FROM node:16-alpine

WORKDIR /project/app

ENV NODE_ENV=development

COPY ./backend/services/news/*.json ./backend/services/news/*.yml ./

COPY ./backend/shared/package*.json ./backend/shared/tsconfig.json ../shared/
RUN cd ../shared && npm install

RUN npm install ../shared
RUN npm install

EXPOSE 4000

CMD npm run dev