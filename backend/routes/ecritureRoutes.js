const express = require("express");
const router = express.Router();
const controller = require("../controller/EcritureController");
const { exportJournalExcel } = require("../controller/exportController");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { importEcrituresExcel } = require("../controller/importController");

router.post("/", controller.creerEcriture);
router.get("/", controller.listerEcritures);
router.get("/export/excel", exportJournalExcel);
router.post("/import/excel", upload.single("file"), importEcrituresExcel);

module.exports = router;
