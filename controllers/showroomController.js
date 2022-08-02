const showroomModel = require("../models/showroomModel");

module.exports = {
  getCountAll: (req, res, next) => {
    showroomModel.countDocuments((error, count) => {
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
            { nama_showroom: new RegExp(query.q, "i") },
            { no_telp: new RegExp(query.q, "i") },
            { alamat: new RegExp(query.q, "i") },
          ],
        },
      ],
    };

    showroomModel
      .find(filter)
      .select("nama_showroom no_telp alamat")
      .skip((page - 1) * rows)
      .limit(rows)
      .sort([[field, direction]])
      .exec(function (error, data) {
        if (error) {
          return next(error);
        }

        // count all
        showroomModel.countDocuments().exec(function (error, count) {
          if (error) {
            return next(error);
          }

          // count all with filter
          showroomModel
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
    showroomModel
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
      .select("nama_showroom no_telp alamat");
  },
  create: (req, res, next) => {
    const { nama_showroom, no_telp, alamat, emplacement1, emplacement2, emplacement3, emplacement4, emplacement5 } = req.body;
    var isError = false;

    if (nama_showroom === undefined || nama_showroom === "") {
      isError = true;
    } /* else if (emplacement1 === undefined) {
      isError = true;
    } else if (emplacement2 === undefined) {
      isError = true;
    } else if (emplacement3 === undefined) {
      isError = true;
    } else if (emplacement4 === undefined) {
      isError = true;
    } else if (emplacement5 === undefined) {
      isError = true;
    } */ else if (
      no_telp === undefined ||
      no_telp === "" ||
      no_telp.match(/\D/g)
    ) {
      isError = true;
    } else if (alamat === undefined || alamat === "") {
      isError = true;
    }

    if (isError) {
      return res.json({
        status: 401,
        message: "Request not allowed",
        error: true,
      });
    }

    showroomModel.insertMany(
      [{ nama_showroom: nama_showroom, no_telp: no_telp, alamat: alamat,
         emplacement1: emplacement1, emplacement2: emplacement2, emplacement3: emplacement3,
         emplacement4: emplacement4,  emplacement5: emplacement5 }],
      function (error) {
        if (error) {
          return next(error);
        }
        res.json({
          status: 200,
          message: "Ajouté avec succès",
          error: false,
        });
      }
    );
  },
  update: (req, res, next) => {
    const { 
      nama_showroom, no_telp, alamat,
      emplacement1, emplacement2, emplacement3, emplacement4, emplacement5, 
    } = req.body;
    const { id } = req.params;
    var isError = false;

    if (nama_showroom === undefined || nama_showroom === "") {
      isError = true;
    } /*else if (emplacement1 === undefined) {
      isError = true;
    } else if (emplacement2 === undefined) {
      isError = true;
    } else if (emplacement3 === undefined) {
      isError = true;
    } else if (emplacement4 === undefined) {
      isError = true;
    } else if (emplacement5 === undefined) {
      isError = true;
    } */else if (
      no_telp === undefined ||
      no_telp === "" ||
      no_telp.match(/\D/g)
    ) {
      isError = true;
    } else if (alamat === undefined || alamat === "") {
      isError = true;
    }
  
    if (isError) {
      return res.json({
        status: 401,
        message: "Request not allowed",
        error: true,
      });
    }
    
    showroomModel.findByIdAndUpdate(
      id,
      { nama_showroom: nama_showroom, no_telp: no_telp, alamat: alamat,
        emplacement1: emplacement1, emplacement2: emplacement2, emplacement3: emplacement3,
        emplacement4: emplacement4, emplacement5: emplacement5 },
      function (error) {
        if (error) {
          return next(error);
        }
        res.json({
          status: 200,
          message: "Mis à jour avec succés",
          error: false,
        });
      }
    );
  },
  delete: (req, res, next) => {
    const { id } = req.params;
    showroomModel.findByIdAndDelete(id, function (error) {
      if (error) {
        return next(error);
      }
      res.json({
        status: 200,
        message: "Supprimé avec succès",
        error: false,
      });
    });
  },
};
