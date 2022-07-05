var express = require("express");
var router = express.Router();
const barangKeluarController = require("../controllers/barangKeluarController");

// Get Income this month
router.get("/pemasukan/bulan", barangKeluarController.getIncomeThisMonth);
// Get Income this year
router.get("/pemasukan/tahun", barangKeluarController.getIncomeThisYear);
// Get Income
router.get("/pemasukan", barangKeluarController.getIncome);
// Get Laporan
router.get("/laporan", barangKeluarController.getLaporan);
// Get Barang Keluar
router.get("/", barangKeluarController.getAll);
// Add Barang Keluar
router.post("/", barangKeluarController.create);
// Delete Barang Keluar
router.delete("/:id", barangKeluarController.delete);

module.exports = router;
