FROM node:18-alpine AS builder

RUN apk add --no-cache python3 make g++ 

ENV NETWORK_URL=
ENV NEXT_PUBLIC_BACKEND_API=
ENV NEXT_PUBLIC_PAYPAL_CLIENT_ID=
ENV NEXT_PUBLIC_ADDRESS_LIMIT=
ENV NEXT_PUBLIC_ADDRESS_MARKET_NFT=

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine

ENV PORT=3000

WORKDIR /usr/src/frontend
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json


EXPOSE $PORT

CMD ["npm", "start"]