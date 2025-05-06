const xlsx = require("xlsx");
const Ecriture = require("../models/EcritureComptable");
const Compte = require("../models/CompteComptable");

exports.importEcrituresExcel = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "Fichier manquant" });

    const workbook = xlsx.read(file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    const ecritures = [];

    for (const row of data) {
      const numeroDebit = String(row["Débit"]).split(" - ")[0].trim();
      const numeroCredit = String(row["Crédit"]).split(" - ")[0].trim();

      const debit = await Compte.findOne({ numero: numeroDebit });
      const credit = await Compte.findOne({ numero: numeroCredit });

      if (!debit || !credit) {
        console.log("❌ Compte non trouvé :", numeroDebit, numeroCredit);
        continue;
      }

      const ecriture = {
        description: String(row["Description"]),
        compteDebit: debit._id,
        compteCredit: credit._id,
        montant: parseFloat(row["Montant"]) || 0,
        reference: String(row["Référence"] || ""),
        journalCode: String(row["Journal"] || "OD")
      };

      ecritures.push(ecriture);
    }

    if (ecritures.length === 0) {
      return res.status(200).json({ success: false, message: "Aucune écriture valide importée." });
    }

    await Ecriture.insertMany(ecritures);
    res.json({ success: true, count: ecritures.length });
  } catch (err) {
    console.error("❌ Erreur Import:", err);
    res.status(500).json({ error: err.message });
  }
};
