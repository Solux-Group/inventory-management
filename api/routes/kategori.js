var express = require("express");
var router = express.Router();
const kategoriController = require('../controllers/kategoriController');

// Get All Kategori
router.get("/", kategoriController.getAll);
// Create Kategori
router.post("/", kategoriController.create);
// Update Kategori
router.put("/:id", kategoriController.update);
// Delete Kategori
router.delete("/:id", kategoriController.delete);

module.exports = router;
