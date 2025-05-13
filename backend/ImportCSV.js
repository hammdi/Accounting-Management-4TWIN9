const fs = require("fs");
const path = require("path");
const csvParser = require("csv-parser");
const mongoose = require("mongoose");
const Element = require("./models/CompteComptable");
require("dotenv").config();

// Load MongoDB URI from environment variable
const MONGO_URI = process.env.MONGO_URI;

// Path to your CSV file
const filePath = path.join(__dirname, "Plan_comptable.csv");

// Function to import data from CSV
const importCSV = async () => {
    try {
        const results = [];

        // Read and parse the CSV file
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
                // Insert parsed data into MongoDB
                await Element.insertMany(results);
                console.log("✅ Comptes insérés avec succès !");
                process.exit(0);
            });
    } catch (err) {
        console.error("🔴 Erreur d'importation :", err);
        process.exit(1);
    }
};

// Connect to MongoDB and then run import
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("🟢 Connecté à MongoDB");
        importCSV();
    })
    .catch(err => {
        console.error("🔴 Erreur de connexion MongoDB :", err);
        process.exit(1);
    });



