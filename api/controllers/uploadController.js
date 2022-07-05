module.exports = {
  do: (req, res, next) => {
    return res.json({
      status: 200,
      message: "Importé avec succès",
      data: { filename: req.file.filename },
      error: false,
    });
  },
};
