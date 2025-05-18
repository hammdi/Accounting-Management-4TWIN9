// At the top with other requires
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const pdf = require('pdf-parse');

// After other middleware but before routes
app.post('/api/upload-pdf', upload.single('pdf'), async (req, res) => {
  try {
    console.log('PDF upload endpoint hit'); // Debug log
    
    if (!req.file) {
      console.log('No file received');
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    console.log(`Received PDF: ${req.file.originalname}, ${req.file.size} bytes`);
    
    const data = await pdf(req.file.buffer);
    console.log(`Extracted text from ${data.numpages} pages`);
    
    res.json({ 
      success: true,
      text: data.text,
      pages: data.numpages 
    });
    
  } catch (err) {
    console.error('PDF processing error:', err);
    res.status(500).json({ 
      error: 'Failed to process PDF',
      details: err.message 
    });
  }
});