FROM node:latest

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY tsconfig.json ./
COPY src src

ENV REDIS_HOST="localhost"
ENV REDIS_PORT="6379"

CMD ["yarn", "start"]