FROM node:lts-alpine

WORKDIR /project/app

ENV NODE_ENV=development

COPY ./gateway/package*.json ./gateway/tsconfig.json ./

COPY ./shared/package*.json ./shared/tsconfig.json ../shared/
RUN cd ../shared && npm install

RUN npm install ../shared
RUN npm install

CMD npm run dev