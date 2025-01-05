const API = {
    addressLimit: process.env.NEXT_PUBLIC_ADDRESS_LIMIT,
    addressMarketNFT: process.env.NEXT_PUBLIC_ADDRESS_MARKET_NFT,
    paypalClientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    backendUrl: process.env.NEXT_PUBLIC_BACKEND_API || 'http://localhost/api',
    networkUrl: process.env.NEXT_PUBLIC_NETWORK_URL || 'http://localhost/network'
}

export default API;