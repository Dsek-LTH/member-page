FROM node:16-alpine


WORKDIR /project/app

ENV NODE_ENV=development

COPY ./frontend/package*.json ./

RUN npm install

CMD npm run dev