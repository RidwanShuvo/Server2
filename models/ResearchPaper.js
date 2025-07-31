const mongoose = require('mongoose');

const ResearchPaperSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  studentId: { type: String, required: true },
  email: { type: String, required: true },
  department: String,
  universityName: String,
  paperTitle: { type: String, required: true },
  abstract: String,
  keywords: String,
  contactNumber: { type: String, required: true },
  batch: { type: String, required: true },
  level: { type: String, required: true },
  semester: { type: String, required: true },
  status: { type: String, enum: ['published', 'unpublished'], required: true },
  publishedLink: { type: String },
  cloudinaryUrl: { type: String, required: true },
  cloudinaryPublicId: { type: String, required: true },
  submissionStatus: { type: String, default: "pending" },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ResearchPaper', ResearchPaperSchema);
