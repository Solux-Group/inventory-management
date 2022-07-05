const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  nama_supplier: {
    type: String,
    required: true,
  },
  no_telp: {
    type: String,
    required: true,
  },
  alamat: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("supplier", supplierSchema);
