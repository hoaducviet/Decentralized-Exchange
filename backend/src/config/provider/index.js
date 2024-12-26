const { ethers } = require("ethers");
const socketURI = process.env.SOCKET_NETWORK_URL;
const privateKey = process.env.PRIVATE_KEY_ADDRESS;

const provider = new ethers.WebSocketProvider(socketURI);

const wallet = new ethers.Wallet(privateKey, provider);

module.exports = { provider, socketURI, wallet };
