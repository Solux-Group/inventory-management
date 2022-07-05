var express = require("express");
var router = express.Router();
const supplierController = require('../controllers/supplierController');

// Get Count Supplier
router.get("/count", supplierController.getCountAll);
// Get All Supplier
router.get("/", supplierController.getAll);
// Get Supplier by ID
router.get("/:id", supplierController.getById);
// Create Supplier
router.post("/", supplierController.create);
// Update Supplier
router.put("/:id", supplierController.update);
// Delete Supplier
router.delete("/:id", supplierController.delete);

module.exports = router;
