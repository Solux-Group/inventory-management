const mongoose = require("mongoose");

const satuanSchema = new mongoose.Schema({
  nama_satuan: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("satuan", satuanSchema);
