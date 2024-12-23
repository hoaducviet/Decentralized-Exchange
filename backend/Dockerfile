FROM node:18-alpine

ENV PORT=8000

WORKDIR /usr/src/backend

COPY package*.json ./

RUN npm install

RUN npm install -g @babel/core @babel/cli

COPY . .

EXPOSE 8000

RUN npm run build-src

CMD ["npm", "run", "build"]