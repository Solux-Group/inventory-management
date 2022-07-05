var express = require("express");
var router = express.Router();
const barangMasukController = require("../controllers/barangMasukController");

// Get Expanse this month
router.get("/pengeluaran/bulan", barangMasukController.getExpenseThisMonth);
// Get Expanse this year
router.get("/pengeluaran/tahun", barangMasukController.getExpanseThisYear);
// Get Expanse
router.get("/pengeluaran", barangMasukController.getExpenses);
// Get Laporan
router.get("/laporan", barangMasukController.getLaporan);
// Get Barang Masuk
router.get("/", barangMasukController.getAll);
// Add Barang Masuk
router.post("/", barangMasukController.create);
// Delete Barang Masuk
router.delete("/:id", barangMasukController.delete);

module.exports = router;
