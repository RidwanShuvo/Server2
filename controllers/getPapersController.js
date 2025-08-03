const ResearchPaper = require('../models/ResearchPaper');

const getPapersController = async (req, res) => {
  try {
    const allPapers = await ResearchPaper.find().sort({ submittedAt: -1 }); // most recent first
    
    console.log('📄 Fetched papers from database:', allPapers.length, 'papers found');

    // Separate papers by status
    const publishedPapers = allPapers.filter(paper => paper.status === 'published');
    const unpublishedPapers = allPapers.filter(paper => paper.status === 'unpublished');
    const pendingPapers = allPapers.filter(paper => paper.submissionStatus === 'pending');
    const rejectedPapers = allPapers.filter(paper => paper.submissionStatus === 'rejected');

    const response = {
      success: true,
      data: {
        published: {
          count: publishedPapers.length,
          papers: publishedPapers
        },
        unpublished: {
          count: unpublishedPapers.length,
          papers: unpublishedPapers
        },
        pending: {
          count: pendingPapers.length,
          papers: pendingPapers
        },
        rejected: {
          count: rejectedPapers.length,
          papers: rejectedPapers
        },
        total: allPapers.length
      },
      summary: {
        totalPapers: allPapers.length,
        publishedCount: publishedPapers.length,
        unpublishedCount: unpublishedPapers.length,
        pendingCount: pendingPapers.length,
        rejectedCount: rejectedPapers.length
      }
    };

    console.log('📊 Papers summary:', response.summary);
    res.status(200).json(response);
  } catch (error) {
    console.error('❌ Failed to get research papers:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching research papers.',
      error: error.message 
    });
  }
};

module.exports = getPapersController;
