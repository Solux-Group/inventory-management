const mongoose = require("mongoose");
const { MONGODB_URI } = process.env;

exports.connect = () => {
  mongoose.connect(MONGODB_URI || "mongodb://127.0.0.1:27017/db_inventory", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error"));
  db.once("open", () => {
    console.log("Database connected!");
  });
};
