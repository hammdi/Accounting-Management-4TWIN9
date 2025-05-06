const xlsx = require("xlsx");
const Ecriture = require("../models/EcritureComptable");

exports.exportJournalExcel = async (req, res) => {
    try {
        const ecritures = await Ecriture.find()
            .populate("compteDebit")
            .populate("compteCredit")
            .sort({ createdAt: -1 });

        const data = ecritures.map(e => ({
            Date: new Date(e.createdAt).toLocaleDateString(),
            Description: e.description,
            Débit: `${e.compteDebit?.numero} - ${e.compteDebit?.libelle}`,
            Crédit: `${e.compteCredit?.numero} - ${e.compteCredit?.libelle}`,
            Montant: e.montant,
            Référence: e.reference,
            Journal: e.journalCode,
        }));

        const ws = xlsx.utils.json_to_sheet(data);
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, "Journal");

        const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

        res.setHeader("Content-Disposition", "attachment; filename=journal_comptable.xlsx");
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.send(buffer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
