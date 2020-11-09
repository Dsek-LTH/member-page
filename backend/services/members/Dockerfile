FROM node:lts-alpine

WORKDIR /project/app

ENV NODE_ENV=development

COPY ./services/members/*.json ./services/members/*.yml ./

COPY ./shared/package*.json ./shared/tsconfig.json ../shared/
RUN cd ../shared && npm install

RUN npm install ../shared
RUN npm install

EXPOSE 4000

CMD npm run dev