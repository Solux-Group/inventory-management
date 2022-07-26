const moment = require("moment");
const barangTransfertModel = require("../models/barangTransfertModel");
const barangModel = require("../models/barangModel");

module.exports = {
  getIncome: (req, res, next) => {
    barangTransfertModel
      .find()
      .select("harga_jual kuantitas")
      .exec((error, data) => {
        if (error) {
          return next(error);
        }

        var income = 0;

        data.forEach((value, index) => {
          income = income + value.harga_jual * value.kuantitas;
        });

        return res.json({
          status: 200,
          message: "OK",
          income: income,
          error: false,
        });
      });
  },
  getIncomeThisMonth: (req, res, next) => {
    const date = new Date("now");
    barangTransfertModel
      .find({
        created_at: {
          $gte: moment().startOf("month"),
          $lt: moment().endOf("month"),
        },
      })
      .select("harga_jual kuantitas created_at")
      .exec((error, data) => {
        if (error) {
          return next(error);
        }

        var income = new Array(moment().daysInMonth()).fill(0);

        data.forEach((value, index) => {
          const day = moment(value.created_at).format("D");
          income[day - 1] += value.harga_jual * value.kuantitas;
        });

        return res.json({
          status: 200,
          message: "OK",
          data: income,
          error: false,
        });
      });
  },
  getIncomeThisYear: (req, res, next) => {
    const date = new Date("now");
    barangTransfertModel
      .find({
        created_at: {
          $gte: moment().startOf("year"),
          $lt: moment().endOf("year"),
        },
      })
      .select("harga_jual kuantitas created_at")
      .exec((error, data) => {
        if (error) {
          return next(error);
        }

        var income = new Array(12).fill(0);

        data.forEach((value, index) => {
          const month = moment(value.created_at).format("M");
          income[month - 1] += value.harga_jual * value.kuantitas;
        });

        return res.json({
          status: 200,
          message: "OK",
          data: income,
          error: false,
        });
      });
  },
  getLaporan: (req, res, next) => {
    const query = req.query;
    const { mulai, sampai } = query;
    const filter = {
      created_at: {
        $gte: moment(mulai).toDate(),
        $lt: moment(sampai).toDate(),
      },
    };

    if (!moment(sampai).isValid()) {
      res
        .status(400)
        .json({ status: 400, message: "Request is not allowed", error: true });
    } else if (!moment(sampai).isValid()) {
      res
        .status(400)
        .json({ status: 400, message: "Request is not allowed", error: true });
    }

    barangTransfertModel
      .find(filter)
      .select(
        "no_transaksi kode_barang id_showroom_up id_showroom_down harga_jual kuantitas username created_at"
      )
      .sort([["created_at", -1]])
      .populate({
        path: "barang_transfert",
        select: "nama_barang id_satuan",
        populate: {
          path: "id_satuan",
          model: "satuan",
          select: "nama_satuan",
        },
      })
      .populate("id_showroom_up")
      .populate("id_showroom_down")
      .populate("user_input", "nama")
      .exec(function (error, data) {
        if (error) {
          return next(error);
        }

        res.json({
          status: 200,
          message: "OK",
          data: data,
          error: false,
        });
      });
  },
  getAll: (req, res, next) => {
    const query = req.query;
    const page = parseInt(query.page) || 1;
    const rows = parseInt(query.rows) || 10;
    let [field, direction] = query.sortby ? query.sortby.split(".") : [];
    direction = direction === "asc" ? 1 : -1;
    const filter = { no_transaksi: new RegExp(query.q, "i") };

    barangTransfertModel
      .find(filter)
      .select(
        "no_transaksi kode_barang id_showroom_up id_showroom_down harga_jual kuantitas username created_at"
      )
      .skip((page - 1) * rows)
      .limit(rows)
      .sort([[field, direction]])
      .populate({
        path: "barang_transfert",
        select: "nama_barang id_satuan",
        populate: {
          path: "id_satuan",
          model: "satuan",
          select: "nama_satuan",
        },
      })
      .populate("id_showroom_up")
      .populate("id_showroom_down")
      .populate("user_input", "nama")
      .exec(function (error, data) {
        if (error) {
          return next(error);
        }

        // count all
        barangTransfertModel.countDocuments().exec(function (error, count) {
          if (error) {
            return next(error);
          }

          // count all with filter
          barangTransfertModel
            .find(filter)
            .countDocuments()
            .exec(function (error, countFiltered) {
              if (error) {
                return next(error);
              }

              res.json({
                status: 200,
                message: "OK",
                data: data,
                page: page,
                total_rows: count,
                total_rows_filtered: countFiltered,
                error: false,
              });
            });
        });
      });
  },
  create: async (req, res, next) => {
    const { kode_barang, id_showroom_up, id_showroom_down, kuantitas, harga_jual, username } = req.body;
    var isError = false;

    if (kode_barang === undefined || kode_barang === "") {
      isError = true;
    } else if (id_showroom_up === undefined || id_showroom_up === "") {
      isError = true;
    } else if (id_showroom_down === undefined || id_showroom_down === "") {
      isError = true;
    } else if (
      kuantitas === undefined ||
      kuantitas === "" ||
      typeof kuantitas !== "number"
    ) {
      isError = true;
    } else if (
      harga_jual === undefined ||
      harga_jual === "" ||
      typeof harga_jual !== "number"
    ) {
      isError = true;
    } else if (username === undefined || username === "") {
      isError = true;
    }

    if (isError) {
      return res.json({
        status: 401,
        message: "Request not allowed",
        error: true,
      });
    }

    try {
      await barangModel.findOneAndUpdate(
        { kode_barang: kode_barang },
        { $inc: id_showroom === "62cfd0a4f824a84be4da0065" ? { stok1: -kuantitas } : id_showroom === "62ceeff20fe57200df0243a5" ? { stok2: -kuantitas } : 0},
        { $inc: { stok: -kuantitas } },
      );

      const newBarangTransfert = new barangTransfertModel({
        kode_barang: kode_barang,
        id_showroom_up: id_showroom_up,
        id_showroom_down: id_showroom_down,
        kuantitas: kuantitas,
        harga_jual: harga_jual,
        username: username,
      });

      await newBarangTransfert.save();

      return res.json({
        status: 200,
        message: "Ajouté avec succès",
        error: false,
      });
    } catch (error) {
      return next(error);
    }
  },
  delete: (req, res, next) => {
    const { id } = req.params;
    barangTransfertModel.findOneAndDelete({ no_transaksi: id }, function (error) {
      if (error) {
        return next(error);
      } else {
        res.json({
          status: 200,
          message: "Supprimé avec succès",
          error: false,
        });
      }
    });
  },
};
