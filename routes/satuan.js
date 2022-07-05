var express = require("express");
var router = express.Router();
const satuanController = require('../controllers/satuanController');

// Get All Satuan
router.get("/", satuanController.getAll);
// Create Satuan
router.post("/", satuanController.create);
// Update Satuan
router.put("/:id", satuanController.update);
// Delete Satuan
router.delete("/:id", satuanController.delete);

module.exports = router;
