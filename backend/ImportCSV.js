const fs = require("fs");
const path = require("path");
const csvParser = require("csv-parser");
const mongoose = require("mongoose");
const Element = require("./models/CompteComptable");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => console.log("🟢 Connecté à MongoDB"))
    .catch(err => {
        console.error("🔴 Erreur de connexion MongoDB :", err);
        process.exit(1);
    });

const filePath = path.join(__dirname, "Plan_comptable.csv");

const importCSV = async () => {
    try {
        console.log("🔄 Suppression des anciens comptes...");
        await Element.deleteMany({});

        const results = [];

        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on("data", (data) => {
                results.push({
                    numero: data.Num.toString().trim(),
                    libelle: data.Libelle,
                    niveau: parseInt(data.Level),
                    solde: parseFloat(data.Solde) || 0
                });
            })
            .on("end", async () => {
                await Element.insertMany(results);
                console.log("✅ Comptes insérés avec succès !");
                process.exit(0);
            });
    } catch (err) {
        console.error("🔴 Erreur d'importation :", err);
        process.exit(1);
    }
};

importCSV();

