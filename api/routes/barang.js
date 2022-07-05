var express = require("express");
var router = express.Router();
const barangController = require("../controllers/barangController");

// Get Count Barang
router.get("/count", barangController.getCountAll);
// Get Barang
router.get("/", barangController.getAll);
// Get Barang by ID
router.get("/:id", barangController.getById);
// Add Barang
router.post("/", barangController.create);
// Update Barang
router.put("/:id", barangController.update);
// Delete Barang
router.delete("/:id", barangController.delete);

module.exports = router;
