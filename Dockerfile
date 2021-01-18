FROM node:12

WORKDIR /app

COPY package.json ./

RUN yarn

COPY . /app

RUN yarn tsc

CMD node ./build/server.js