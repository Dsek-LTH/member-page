FROM node:16-alpine

RUN apk add curl
HEALTHCHECK CMD curl -f http://localhost:3000/api/health || exit 1

WORKDIR /frontend

ENV NODE_ENV=development

COPY ./.git ../.git
CMD npm run dev