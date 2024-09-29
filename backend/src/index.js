require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const route = require("./routes");
const db = require("./config/database");

db.connect();

const mongodbURI = db.mongodbURI;

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

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
