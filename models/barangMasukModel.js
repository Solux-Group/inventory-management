const mongoose = require("mongoose");
const moment = require("moment");

const barangMasukSchema = new mongoose.Schema(
  {
    no_transaksi: {
      type: String,
      unique: true,
      default: () => {
        return `TBM-${moment().format("YYYYMMDDHHmmss")}`;
      },
    },
    kode_barang: {
      type: String,
      required: true,
    },
    harga_beli: {
      type: Number,
      required: true,
    },
    kuantitas: {
      type: Number,
      required: true,
    },
    id_supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "supplier",
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

barangMasukSchema.virtual("barang_masuk", {
  ref: "barang",
  localField: "kode_barang",
  foreignField: "kode_barang",
  justOne: true
});

barangMasukSchema.virtual("user_input", {
  ref: "users",
  localField: "username",
  foreignField: "username",
  justOne: true
});

module.exports = mongoose.model("barangMasuk", barangMasukSchema);
