const express = require('express');
const router = express.Router();
const pdf = require('pdf-parse');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Créer le répertoire uploads s'il n'existe pas
const uploadDir = path.join(__dirname, '../temp/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ 
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB max
    }
});

router.post('/upload-financial-report', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Aucun fichier téléchargé' });
        }

        const dataBuffer = fs.readFileSync(req.file.path);
        const data = await pdf(dataBuffer);
        
        // Stocker temporairement le texte extrait
        const analysisId = Date.now();
        const tempDir = path.join(__dirname, '../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        
        const tempPath = path.join(tempDir, `analysis_${analysisId}.txt`);
        fs.writeFileSync(tempPath, data.text);

        // Supprimer le fichier PDF temporaire
        fs.unlinkSync(req.file.path);

        res.json({
            success: true,
            analysisId,
            textPreview: data.text.substring(0, 200) + '...'
        });
    } catch (err) {
        console.error(err);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: 'Échec de l\'analyse du PDF', details: err.message });
    }
});

module.exports = router;