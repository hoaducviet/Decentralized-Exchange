require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const socketIo = require("socket.io");
const http = require("http");
const route = require("./routes");
const db = require("./config/database");
const { provider } = require("./config/provider");
const { checkWallet } = require("./controllers/WalletController");
const socket = require("./socket");
const event = require("./event");

db.connect();

const app = express();

app.use(bodyParser.json());

app.use(cors());

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(morgan("combined"));
route(app);

// const wsProvider = new ethers.WebSocketProvider(
//   process.env.ALCHEMY_SEPOLIA_URL
// );

event(provider);

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

socket(io);

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
