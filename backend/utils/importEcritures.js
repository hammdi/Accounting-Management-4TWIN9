const multer = require("multer");
const xlsx = require("xlsx");
const Ecriture = require("../models/EcritureComptable");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const importEcritures = [
    upload.single("file"),
    async (req, res) => {
        try {
            const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const data = xlsx.utils.sheet_to_json(sheet);

            const inserted = await Ecriture.insertMany(data);
            res.json({ success: true, inserted });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
];

module.exports = importEcritures;
