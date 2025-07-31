const ResearchPaper = require('../models/ResearchPaper');

const updatePaperStatusController = async (req, res) => {
  try {
    const { paperId } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be approved, rejected, or pending.' });
    }

    const updatedPaper = await ResearchPaper.findByIdAndUpdate(
      paperId,
      { submissionStatus: status },
      { new: true }
    );

    if (!updatedPaper) {
      return res.status(404).json({ message: 'Paper not found.' });
    }

    res.status(200).json({
      message: 'Paper status updated successfully.',
      paper: updatedPaper
    });
  } catch (error) {
    console.error('❌ Failed to update paper status:', error);
    res.status(500).json({ message: 'Error updating paper status.' });
  }
};

module.exports = updatePaperStatusController; 