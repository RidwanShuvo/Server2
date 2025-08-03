const ResearchPaper = require('../models/ResearchPaper');

const updatePaperStatusController = async (req, res) => {
  try {
    const { paperId } = req.params;
    const { status, publicationType } = req.body;

    console.log('📝 Updating paper status:', { paperId, status, publicationType });

    // Validate status
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid status. Must be approved, rejected, or pending.' 
      });
    }

    // Prepare update data
    const updateData = { submissionStatus: status };

    // If approving, also set the status field for published/unpublished categorization
    if (status === 'approved') {
      if (publicationType === 'published') {
        updateData.status = 'published';
      } else {
        updateData.status = 'unpublished';
      }
    } else {
      // For rejected/pending, set status to unpublished
      updateData.status = 'unpublished';
    }

    console.log('📝 Update data:', updateData);

    const updatedPaper = await ResearchPaper.findByIdAndUpdate(
      paperId,
      updateData,
      { new: true }
    );

    if (!updatedPaper) {
      return res.status(404).json({ 
        success: false,
        message: 'Paper not found.' 
      });
    }

    console.log('✅ Paper updated successfully:', {
      id: updatedPaper._id,
      submissionStatus: updatedPaper.submissionStatus,
      status: updatedPaper.status
    });

    res.status(200).json({
      success: true,
      message: 'Paper status updated successfully.',
      paper: updatedPaper
    });
  } catch (error) {
    console.error('❌ Failed to update paper status:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error updating paper status.',
      error: error.message 
    });
  }
};

module.exports = updatePaperStatusController; 