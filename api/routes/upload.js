var express = require("express");
var router = express.Router();
const uploadController = require("../controllers/uploadController");

// Do Upload
router.post("/", uploadController.do);

module.exports = router;
