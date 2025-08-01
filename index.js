const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { upload, handleUploadError } = require('./middleware/upload');
const { testConnection, uploadToCloudinary } = require('./config/cloudinary');
const databaseManager = require('./config/database');
const { ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// Database connection check middleware
const checkDatabaseConnection = async (req, res, next) => {
  if (!databaseManager.isDatabaseConnected()) {
    return res.status(503).json({
      success: false,
      message: "Database connection lost. Please try again.",
      error: "DATABASE_DISCONNECTED"
    });
  }
  next();
};

// Initialize server
async function initializeServer() {
  try {
    // Connect to MongoDB
    const dbConnected = await databaseManager.connect();
    if (!dbConnected) {
      console.error('❌ Failed to connect to MongoDB. Server may not function properly.');
    }

    // Test Cloudinary connection
    await testConnection();
    
    console.log('🚀 Server initialization completed!');
  } catch (error) {
    console.error('❌ Server initialization failed:', error.message);
  }
}

// Initialize server on startup
initializeServer();

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    const dbHealth = await databaseManager.healthCheck();
    const cloudinaryHealth = await testConnection();
    
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: dbHealth,
      cloudinary: cloudinaryHealth ? 'connected' : 'disconnected',
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Routes
const paperRoutes = require('./routes/paperRoutes');
app.use('/api', paperRoutes);

// Submit new paper with Cloudinary file upload
app.post("/api/submit", upload.single("file"), handleUploadError, checkDatabaseConnection, async (req, res) => {
  try {
    const paper = req.body;
    let fileData = null;

    // Handle file upload to Cloudinary if file exists
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file, 'research_papers');
      
      if (uploadResult.success) {
        fileData = {
          url: uploadResult.url,
          public_id: uploadResult.public_id,
          format: uploadResult.format,
          size: uploadResult.size,
          originalName: req.file.originalname
        };
        paper.fileData = fileData;
      } else {
        return res.status(500).json({
          success: false,
          message: "Failed to upload file to Cloudinary",
          error: uploadResult.error
        });
      }
    }

    // Add timestamp
    paper.submittedAt = new Date();
    paper.status = paper.status || 'pending';

    const collection = databaseManager.getCollection("researchpapers");
    const result = await collection.insertOne(paper);
    
    res.status(201).json({
      success: true,
      message: "Paper submitted successfully",
      id: result.insertedId,
      fileData: fileData
    });
  } catch (err) {
    console.error('Submit error:', err);
    res.status(500).json({
      success: false,
      message: "Failed to submit paper",
      error: err.message
    });
  }
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Research Portal is running",
    database: databaseManager.isDatabaseConnected() ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server gracefully...');
  await databaseManager.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down server gracefully...');
  await databaseManager.disconnect();
  process.exit(0);
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Research Portal server is running on port ${port}`);
  console.log(`📊 Health check available at: http://localhost:${port}/health`);
});
