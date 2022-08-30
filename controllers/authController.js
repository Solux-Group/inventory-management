const usersModel = require("../models/usersModel");
const jwt = require("jsonwebtoken");
//const bcrypt = require("bcrypt");
const { SECRET } = process.env;

module.exports = {
  authLogin: (req, res, next) => {
    const { username, password } = req.body;

    usersModel.findOne(
      { username: username },
      function (error, data) {
        if (error) {
          return next(error);
        }

        if (data) {

          // if (!bcrypt.compareSync(password, data.password)) {
          //   return res.json({
          //     status: 403,
          //     message: "Le nom d'utilisateur ou le mot de passe utilisé est erroné",
          //     error: true
          //   })
          // }

          if (password !== data.password) {
            return res.json({
              status: 403,
              message: "Le nom d'utilisateur ou le mot de passe utilisé est erroné",
              error: true
            })
          }
          

          if (data.status == 0) {
            return res.json({
              status: 403,
              message: "Compte inactif",
              error: true,
            });
          }

          const token = jwt.sign(
            {
              username: data.username,
              nama: data.nama,
              email: data.email,
              no_telp: data.no_telp,
              role: data.role,
            },
            SECRET,
            { expiresIn: "3h" }
          );

          return res.json({
            status: 200,
            message: "Connexion réussie",
            data: {
              username: data.username,
              nama: data.nama,
              foto: data.foto,
              role: data.role,
            },
            token: token,
            error: false,
          });
        } else {
          return res.json({
            status: 403,
            message: "Le nom d'utilisateur ou le mot de passe utilisé est erroné",
            error: true
          })
        }
      }
    );
  },
};
