const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

router.get('/download-report', (req, res) => {
    const filename = req.query.file;
    console.log('[Download] Request for file:', filename);

    if (!filename) {
        console.error('[Download] No filename provided');
        return res.status(400).send('Filename is required');
    }

    // Sécurité : empêche les traversées de répertoire
    const safeFilename = path.basename(filename);
    const tempDir = path.join(__dirname, '../temp');
    const filePath = path.join(tempDir, safeFilename);

    console.log('[Download] Looking for file at:', filePath);

    if (!fs.existsSync(filePath)) {
        console.error('[Download] File not found:', filePath);
        return res.status(404).send('File not found');
    }

    console.log('[Download] Sending file:', filePath);
    res.download(filePath, `report_${Date.now()}.pdf`, (err) => {
        if (err) {
            console.error('[Download] Error sending file:', err);
            res.status(500).send('Download error');
        } else {
            console.log('[Download] File sent successfully');
            // Optionnel: supprimer après envoi
            fs.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) console.error('[Download] Cleanup error:', unlinkErr);
            });
        }
    });
});

module.exports = router;