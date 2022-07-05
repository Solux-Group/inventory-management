const mongoose = require("mongoose");

const barangSchema = new mongoose.Schema(
  {
    kode_barang: {
      type: String,
    },
    nama_barang: {
      type: String,
      required: true,
    },
    stok: {
      type: Number,
      required: true,
      default: 0,
    },
    harga_jual: {
      type: Number,
      required: true,
    },
    harga_beli: {
      type: Number,
      required: true,
    },
    id_kategori: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "kategori",
      required: true,
    },
    id_satuan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "satuan",
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

barangSchema.pre("save", function (next) {
  var self = this;
  mongoose
    .model("barang", barangSchema)
    .findOne(function (error, docs) {
      if (error) {
        next(error);
      } else {
        var kode_barang = docs ? docs.kode_barang : "B0000000";
        var zero = "0000000";
        kode_barang = parseInt(kode_barang.substr(1)) + 1;
        self.kode_barang = "B" + zero.slice(kode_barang.toString().length) + kode_barang;
        next();
      }
    })
    .sort({ kode_barang: -1 })
    .limit(1);
});

module.exports = mongoose.model("barang", barangSchema);
