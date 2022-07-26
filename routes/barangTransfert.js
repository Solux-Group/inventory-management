var express = require("express");
var router = express.Router();
const barangTransfertController = require("../controllers/barangTransfertController");

// Get Income this month
router.get("/pemasukan/bulan", barangTransfertController.getIncomeThisMonth);
// Get Income this year
router.get("/pemasukan/tahun", barangTransfertController.getIncomeThisYear);
// Get Income
router.get("/pemasukan", barangTransfertController.getIncome);
// Get Laporan
router.get("/laporan", barangTransfertController.getLaporan);
// Get Barang Transfert
router.get("/", barangTransfertController.getAll);
// Add Barang Transfert
router.post("/", barangTransfertController.create);
// Delete Barang Transfert
router.delete("/:id", barangTransfertController.delete);

module.exports = router;
