FROM node:18-alpine AS builder

RUN apk add --no-cache python3 make g++ 

ARG NEXT_PUBLIC_NETWORK

ENV PORT=3000
ENV NEXT_PUBLIC_NETWORK_URL=$NEXT_PUBLIC_NETWORK
ENV NEXT_PUBLIC_PAYPAL_CLIENT_ID="AbEvzMa8gghbphtvK-C38-xH8S_7YF9QP5roUEfhnApqh_LL-ed9yExO4agkZSv-l5m9QkwgzKhFq_jA"
ENV NEXT_PUBLIC_ADDRESS_LIMIT="0x66F625B8c4c635af8b74ECe2d7eD0D58b4af3C3d"
ENV NEXT_PUBLIC_ADDRESS_MARKET_NFT="0x5302E909d1e93e30F05B5D6Eea766363D14F9892"

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