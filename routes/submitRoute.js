const express = require('express');
const router = express.Router();

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
