FROM node:12-alpine as builder

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

RUN mkdir /app
WORKDIR /app
COPY package.json yarn.lock /app/
RUN yarn --pure-lockfile
COPY . /app

CMD ["node", "src/index.js"]

EXPOSE 3000
