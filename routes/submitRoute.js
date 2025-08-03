const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const submitController = require('../controllers/submitController');
const getPapersController = require('../controllers/getPapersController');
const updatePaperStatusController = require('../controllers/updatePaperStatusController');

// POST /api/submit
router.post('/submit', upload.single('file'), submitController);

// GET /api/papers - Get all papers organized by status
router.get('/papers', getPapersController);

// GET /api/papers/published - Get only published papers
router.get('/papers/published', async (req, res) => {
  try {
    const ResearchPaper = require('../models/ResearchPaper');
    
    const publishedPapers = await ResearchPaper.find({
      status: 'published'
    }).sort({ submittedAt: -1 });
    
    res.status(200).json({
      success: true,
      count: publishedPapers.length,
      papers: publishedPapers
    });
  } catch (error) {
    console.error('❌ Failed to get published papers:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching published papers.',
      error: error.message 
    });
  }
});

// GET /api/papers/unpublished - Get only unpublished papers
router.get('/papers/unpublished', async (req, res) => {
  try {
    const ResearchPaper = require('../models/ResearchPaper');
    
    const unpublishedPapers = await ResearchPaper.find({
      status: 'unpublished'
    }).sort({ submittedAt: -1 });
    
    res.status(200).json({
      success: true,
      count: unpublishedPapers.length,
      papers: unpublishedPapers
    });
  } catch (error) {
    console.error('❌ Failed to get unpublished papers:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching unpublished papers.',
      error: error.message 
    });
  }
});

// GET /api/papers/pending - Get only pending papers
router.get('/papers/pending', async (req, res) => {
  try {
    const ResearchPaper = require('../models/ResearchPaper');
    
    const pendingPapers = await ResearchPaper.find({
      submissionStatus: 'pending'
    }).sort({ submittedAt: -1 });
    
    res.status(200).json({
      success: true,
      count: pendingPapers.length,
      papers: pendingPapers
    });
  } catch (error) {
    console.error('❌ Failed to get pending papers:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching pending papers.',
      error: error.message 
    });
  }
});

// PUT /api/papers/:paperId/status
router.put('/papers/:paperId/status', updatePaperStatusController);

module.exports = router;
