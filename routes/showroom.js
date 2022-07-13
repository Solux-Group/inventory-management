var express = require("express");
var router = express.Router();
const showroomController = require('../controllers/showroomController');

// Get Count Showroom
router.get("/count", showroomController.getCountAll);
// Get All Showroom
router.get("/", showroomController.getAll);
// Get Showroom by ID
router.get("/:id", showroomController.getById);
// Create Showroom
router.post("/", showroomController.create);
// Update Showroom
router.put("/:id", showroomController.update);
// Delete Showroom
router.delete("/:id", showroomController.delete);

module.exports = router;
