const barangModel = require("../models/barangModel");

module.exports = {
  getCountAll: (req, res, next) => {
    barangModel.countDocuments((error, count) => {
      if (error) {
        return next(error);
      }

      return res.json({
        status: 200,
        message: "OK",
        count: count,
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
    const filter = {
      $and: [
        {
          $or: [
            { kode_barang: new RegExp(query.q, "i") },
            { nama_barang: new RegExp(query.q, "i") },
          ],
        },
      ],
    };

    barangModel
      .find(filter)
      .select(
        "kode_barang nama_barang stok harga_jual harga_beli id_kategori id_showroom1 stok1 id_showroom2 stok2 id_satuan"
      )
      .skip((page - 1) * rows)
      .limit(rows)
      .sort([[field, direction]])
      .populate("id_kategori")
      .populate("id_showroom1")
      .populate("stok1")
      .populate("id_showroom2")
      .populate("stok2")
      .populate("id_satuan")
      .exec(function (error, data) {
        if (error) {
          return next(error);
        }

        // count all
        barangModel.countDocuments().exec(function (error, count) {
          if (error) {
            return next(error);
          }

          // count all with filter
          barangModel
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
  getById: (req, res, next) => {
    const { id } = req.params;
    barangModel
      .findById(id, function (error, data) {
        if (error) {
          return next(error);
        } else {
          res.json({
            status: 200,
            message: "OK",
            data: data,
            error: false,
          });
        }
      })
      .select(
        "kode_barang nama_barang stok harga_jual harga_beli id_kategori id_showroom1 stok1 id_showroom2 stok2 id_satuan"
      );
  },
  create: (req, res, next) => {
    const {
      nama_barang,
      stok,
      harga_jual,
      harga_beli,
      id_kategori,
      id_showroom1,
      stok1,
      id_showroom2,
      stok2,
      id_satuan,
    } = req.body;
    var isError = false;

    if (nama_barang === undefined || nama_barang === "") {
      isError = true;
    } else if (stok === undefined || stok === "" || typeof stok !== 'number') {
      isError = true;
    } else if (stok1 === undefined || stok1 === "" || typeof stok1 !== 'number') {
      isError = true;
    } else if (stok2 === undefined || stok2 === "" || typeof stok2 !== 'number') {
      isError = true;
    } else if (
      harga_jual === undefined ||
      harga_jual === "" ||
      typeof harga_jual !== 'number'
    ) {
      isError = true;
    } else if (
      harga_beli === undefined ||
      harga_beli === "" ||
      typeof harga_beli !== 'number'
    ) {
      isError = true;
    } else if (id_kategori === undefined || id_kategori === "") {
      isError = true;
    } else if (id_showroom1 === undefined || id_showroom1 === "") {
      isError = true;
    } else if (id_showroom2 === undefined || id_showroom2 === "") {
      isError = true;
    } else if (id_satuan === undefined || id_satuan === "") {
      isError = true;
    }

    if (isError) {
      return res.json({
        status: 401,
        message: "Request not allowed",
        error: true,
      });
    }

    const newBarang = new barangModel({
      nama_barang: nama_barang,
      stok: stok,
      harga_jual: harga_jual,
      harga_beli: harga_beli,
      id_kategori: id_kategori,
      id_showroom1: id_showroom1,
      stok1: stok1,
      id_showroom2: id_showroom2,
      stok2: stok2,
      id_satuan: id_satuan,
    });

    newBarang.save(function (error, data) {
      if (error) {
        return next(error);
      } else {
        res.json({
          status: 200,
          message: "Ajouté avec succès",
          data: data,
          error: false,
        });
      }
    });
  },
  update: (req, res, next) => {
    const { id } = req.params;
    const { nama_barang, harga_jual, harga_beli, id_kategori, id_showroom1, stok1, id_showroom2, stok2, id_satuan } =
      req.body;
    var isError = false;

    if (nama_barang === undefined || nama_barang === "") {
      isError = true;
    } else if (
      harga_jual === undefined ||
      harga_jual === "" ||
      typeof harga_jual !== 'number'
    ) {
      isError = true;
    } else if (
      harga_beli === undefined ||
      harga_beli === "" ||
      typeof harga_beli !== 'number'
    ) {
      isError = true;
    }  else if (
      stok1 === undefined ||
      stok1 === "" ||
      typeof stok1 !== 'number'
    ) {
      isError = true;
    }   else if (
      stok2 === undefined ||
      stok2 === "" ||
      typeof stok2 !== 'number'
    ) {
      isError = true;
    } else if (id_kategori === undefined || id_kategori === "") {
      isError = true;
    } else if (id_showroom1 === undefined || id_showroom1 === "") {
      isError = true;
    } else if (id_showroom2 === undefined || id_showroom2 === "") {
      isError = true;
    } else if (id_satuan === undefined || id_satuan === "") {
      isError = true;
    }

    if (isError) {
      return res.json({
        status: 401,
        message: "Request not allowed",
        error: true,
      });
    }

    barangModel.findByIdAndUpdate(
      id,
      {
        nama_barang: nama_barang,
        harga_jual: harga_jual,
        harga_beli: harga_beli,
        id_kategori: id_kategori,
        id_showroom1: id_showroom1,
        stok1: stok1,
        id_showroom2: id_showroom2,
        stok2: stok2,
        id_satuan: id_satuan,
      },
      function (error) {
        if (error) {
          return next(error);
        } else {
          res.json({
            status: 200,
            message: "Mis à jour avec succés",
            error: false,
          });
        }
      }
    );
  },
  delete: (req, res, next) => {
    const { id } = req.params;
    barangModel.findByIdAndDelete(id, function (error) {
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
