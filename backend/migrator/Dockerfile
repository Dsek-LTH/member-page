FROM node:16-alpine


WORKDIR /project/app

ENV NODE_ENV=development

COPY ./backend/migrator/package*.json ./

COPY ./backend/shared/package*.json ./backend/shared/tsconfig.json ../shared/
RUN cd ../shared && npm install

RUN npm install ../shared
RUN npm install

CMD npm start -- migrate seed