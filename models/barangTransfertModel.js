const mongoose = require("mongoose");
const moment = require("moment");

const barangTransfertSchema = new mongoose.Schema(
  {
    no_transaksi: {
      type: String,
      unique: true,
      default: () => {
        return `TRANS-${moment().format("YYYYMMDDHHmmss")}`;
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
    id_showroom_up: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "showroom",
    },
    id_showroom_down: {
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

barangTransfertSchema.virtual("barang_transfert", {
  ref: "barang",
  localField: "kode_barang",
  foreignField: "kode_barang",
  justOne: true
});

barangTransfertSchema.virtual("user_input", {
  ref: "users",
  localField: "username",
  foreignField: "username",
  justOne: true
});

module.exports = mongoose.model("barangTransfert", barangTransfertSchema);
