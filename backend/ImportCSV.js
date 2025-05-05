const fs = require("fs");
const path = require("path");
const csvParser = require("csv-parser");
const mongoose = require("mongoose");
const Element = require('./models/CompteComptable');

//const MONGO_URI = "mongodb://mongo:27017/accounting-db";
const MONGO_URI = "mongodb://admin:password123@localhost:27017/accounting-db?authSource=admin";


mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("🟢 Connecté à MongoDB"))
    .catch(err => {
        console.error("🔴 Erreur de connexion MongoDB :", err);
        process.exit(1);
    });

const filePath = path.join(__dirname, "Plan_comptable.csv");

const importCSV = async () => {
    try {
        const existing = await Element.countDocuments();
        if (existing > 0) {
            console.log("⏭️ Plan Comptable déjà importé. Ignoré.");
            mongoose.connection.close();
            return;
        }

        const elements = [];

        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on("data", (row) => {
                elements.push({
                    Num: parseInt(row.Num),
                    Libelle: row.Libelle,
                    Level: parseInt(row.Level)
                });
            })
            .on("end", async () => {
                try {
                    await Element.insertMany(elements);
                    console.log("✅ Plan Comptable importé avec succès.");
                    mongoose.connection.close();
                } catch (error) {
                    console.error("🔴 Erreur d'insertion :", error);
                    mongoose.connection.close();
                }
            });

    } catch (error) {
        console.error("🔴 Erreur importCSV :", error);
        mongoose.connection.close();
    }
};

importCSV();
