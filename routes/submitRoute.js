const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'research_papers',
    resource_type: 'auto', // allow images, videos, pdfs, etc.
    format: async (req, file) => 'pdf',
  },
});

const upload = multer({ storage });

router.post('/submit', upload.single('pdfFile'), async (req, res) => {
  try {
    const uploadedUrl = req.file.path;
    const cloudinaryPublicId = req.file.filename;

    // Save these to DB along with form data
    res.json({
      message: 'Upload successful',
      cloudinaryUrl: uploadedUrl,
      cloudinaryPublicId: cloudinaryId
    });
  } catch (err) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

const upload = require('../middleware/upload');
const submitController = require('../controllers/submitController');
const getPapersController = require('../controllers/getPapersController');
const updatePaperStatusController = require('../controllers/updatePaperStatusController');


// POST /api/submit
router.post('/submit', upload.single('file'), submitController);

// GET /api/papers
router.get('/papers', getPapersController);

// PUT /api/papers/:paperId/status
router.put('/papers/:paperId/status', updatePaperStatusController);



module.exports = router;
