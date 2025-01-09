require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const http = require("http");
const route = require("./routes");
const db = require("./config/database");
const { provider } = require("./config/provider");
const socket = require("./socket");
const event = require("./event");
const schedule = require("./schedule");
const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");

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

event(provider);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      process.env.FRONTEND_URL,
      "https://viethoaduc.com",
      "https://admin.socket.io",
    ],
    credentials: true,
    methods: ["GET", "POST"],
  },
  pingInterval: 30000,
  pingTimeout: 10000,
});
instrument(io, {
  auth: false,
  mode: "development",
});

socket(io);
schedule();

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
