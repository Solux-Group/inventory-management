const mongoose = require("mongoose");
const { MONGODB_URI } = process.env;
//const { MONGODB_URI } = process.env || "mongodb://127.0.0.1:27017/db_inventory";

exports.connect = () => {
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error"));
  db.once("open", () => {
    console.log("Database connected!");
  });
};
