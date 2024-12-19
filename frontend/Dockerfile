
FROM node:18-alpine AS builder

RUN apk add --no-cache python3 make g++ 

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine

ENV PORT=3000

ENV NEXT_PUBLIC_ADDRESS_LIMIT="0x66F625B8c4c635af8b74ECe2d7eD0D58b4af3C3d"
ENV NEXT_PUBLIC_ADDRESS_MARKET_NFT="0x5302E909d1e93e30F05B5D6Eea766363D14F9892"
ENV NEXT_PUBLIC_IPFSLINK="https://ipfs.io/ipfs/"
ENV NEXT_PUBLIC_PAYPAL_CLIENT_ID="AVaEIV9iJjClKsxVEw2_4nus4NQ8d4mJIqq_SCDMXVOUA6hXz429CdeYRh382vefxdQrzazmun8ZKXnh"
ENV NEXT_PUBLIC_BACKEND_API="http://localhost:8000"
ENV NETWORK_URL="http://localhost:8545"

ENV CONTRACT_ADDRESS_LOCK="0x5FbDB2315678afecb367f032d93F642f64180aa3"

WORKDIR /usr/src/frontend
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json


EXPOSE $PORT

CMD ["npm", "start"]