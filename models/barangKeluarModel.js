const mongoose = require("mongoose");
const moment = require("moment");

const barangKeluarSchema = new mongoose.Schema(
  {
    no_transaksi: {
      type: String,
      unique: true,
      default: () => {
        return `SLX-${moment().format("YYYYMMDDHHmmss")}`;
      },
    },
    kode_barang: {
      type: String,
      required: true,
    },
    harga_jual: {
      type: Number,
      required: true,
    },
    id_showroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "showroom",
    },
    kuantitas: {
      type: Number,
      required: true,
    },
    username: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: "created_at" },
    toJSON: { virtuals: true },
  }
);

barangKeluarSchema.virtual("barang_keluar", {
  ref: "barang",
  localField: "kode_barang",
  foreignField: "kode_barang",
  justOne: true
});

barangKeluarSchema.virtual("user_input", {
  ref: "users",
  localField: "username",
  foreignField: "username",
  justOne: true
});

module.exports = mongoose.model("barangKeluar", barangKeluarSchema);
