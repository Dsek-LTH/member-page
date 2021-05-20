FROM node:lts-alpine

WORKDIR /project/app

ENV NODE_ENV=development

COPY ./backend/services/template/*.json ./backend/services/template/*.yml ./

COPY ./backend/shared/package*.json ./backend/shared/tsconfig.json ../shared/
RUN cd ../shared && npm install

RUN npm install ../shared
RUN npm install

EXPOSE 4000

CMD npm run dev