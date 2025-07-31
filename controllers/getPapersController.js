const ResearchPaper = require('../models/ResearchPaper');

const getPapersController = async (req, res) => {
  try {
    const papers = await ResearchPaper.find().sort({ submittedAt: -1 }); // most recent first
    console.log('📄 Fetched papers from database:', papers.length, 'papers found');
    console.log('📄 Sample paper data:', papers[0] || 'No papers found');
    res.status(200).json(papers);
  } catch (error) {
    console.error('❌ Failed to get research papers:', error);
    res.status(500).json({ message: 'Error fetching research papers.' });
  }
};

module.exports = getPapersController;
