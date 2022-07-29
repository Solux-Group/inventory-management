const mongoose = require("mongoose");

const showroomSchema = new mongoose.Schema({
  nama_showroom: {
    type: String,
    required: true,
  },
  emplacement1: {
    type: String,
    required: true,
  },
  emplacement2: {
    type: String,
    required: true,
  },
  emplacement3: {
    type: String,
    required: true,
  },
  emplacement4: {
    type: String,
    required: true,
  },
  emplacement5: {
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

module.exports = mongoose.model("showroom", showroomSchema);
