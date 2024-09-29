FROM node:16-alpine

WORKDIR /usr/src/backend

COPY package*.json ./

RUN npm install

# RUN npm install -g @babel/core @babel/cli

COPY . .

EXPOSE 8000
# RUN npm run build-src


CMD ["npm", "run", "build"]
