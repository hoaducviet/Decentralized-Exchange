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
const socket = require("./socket");
const event = require("./event");
const schedule = require("./schedule");

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
const io = socketIo(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      process.env.FRONTEND_URL,
      "https://viethoaduc.com",
    ],
    methods: ["GET", "POST"],
  },
});

socket(io);
schedule();

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
