FROM node:18-alpine

RUN apk add --no-cache make bash

ENV PORT=8545

WORKDIR /usr/src/contract

COPY package*.json ./
COPY Makefile ./

RUN npm install


COPY . .

EXPOSE 8545


CMD ["npx", "hardhat", "node"]

