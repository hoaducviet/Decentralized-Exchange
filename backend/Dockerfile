FROM node:18-buster

RUN apt-get update && apt-get install -y libc6 libgcc1 libstdc++6

ENV PORT=8000

WORKDIR /usr/src/backend

COPY package*.json ./

RUN npm install

RUN npm install -g @babel/core @babel/cli

COPY . .

EXPOSE 8000

RUN npm run build-src

CMD ["npm", "run", "build"]