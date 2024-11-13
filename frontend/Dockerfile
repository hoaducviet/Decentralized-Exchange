
FROM node:18-alpine AS builder

RUN apk add --no-cache python3 make g++ 

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine

ENV PORT=3000
ENV ALCHEMY_SEPOLIA_URL="https://eth-sepolia.g.alchemy.com/v2/NYJHqIaI2H9v0prOyeBB8BEZgyc2jGeT"
ENV ACCOUNT_PRIVATE_KEY="400905baced628d6330cd54739016073ff332881a731069c4d9caec1c3791d5d"
ENV ETHERSCAN_API_KEY="WNV61QF4E5IYBBNRWVF2B7TWFEC1RC2ST6"
ENV NEXT_PUBLIC_NFT_MARKET_ADDRESS="0x6DcBc91229d812910b54dF91b5c2b592572CD6B0"
ENV NEXT_PUBLIC_IPFSLINK="https://ipfs.io/ipfs/"
ENV NEXT_PUBLIC_PAYPAL_CLIENT_ID="AVaEIV9iJjClKsxVEw2_4nus4NQ8d4mJIqq_SCDMXVOUA6hXz429CdeYRh382vefxdQrzazmun8ZKXnh"
ENV NEXT_PUBLIC_BACKEND_API="http://localhost:8000"


WORKDIR /usr/src/frontend
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json


EXPOSE $PORT

CMD ["npm", "start"]