const { ethers } = require("ethers");
const socketURI = process.env.SOCKET_NETWORK_URL;

const provider = new ethers.WebSocketProvider(socketURI);

module.exports = { provider, socketURI };
