const mongoose = require("mongoose");
const mongodbURI = process.env.MONGODBURI;

async function connect() {
  try {
    await mongoose.connect(mongodbURI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Failed Connect to MongoDB");
  }
}

module.exports = { connect, mongodbURI };
