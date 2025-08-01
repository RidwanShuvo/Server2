// routes/paperRoutes.js
const express = require('express');
const router = express.Router();
const databaseManager = require('../config/database');
const { ObjectId } = require('mongodb');

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

// GET all papers
router.get("/papers", checkDatabaseConnection, async (req, res) => {
  try {
    const collection = databaseManager.getCollection("researchpapers");
    const papers = await collection.find({}).toArray();
    res.json({
      success: true,
      data: papers
    });
  } catch (err) {
    console.error('Error fetching papers:', err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch papers",
      error: err.message
    });
  }
});

// GET single paper by ID
router.get("/papers/:id", checkDatabaseConnection, async (req, res) => {
  try {
    const { id } = req.params;
    const collection = databaseManager.getCollection("researchpapers");
    const paper = await collection.findOne({ _id: new ObjectId(id) });
    
    if (!paper) {
      return res.status(404).json({
        success: false,
        message: "Paper not found"
      });
    }
    
    res.json({
      success: true,
      data: paper
    });
  } catch (err) {
    console.error('Error fetching paper:', err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch paper",
      error: err.message
    });
  }
});

// Update paper status
router.put("/papers/:id/status", checkDatabaseConnection, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const collection = databaseManager.getCollection("researchpapers");
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } }
    );

    if (result.modifiedCount > 0) {
      res.json({
        success: true,
        message: "Status updated successfully"
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Paper not found or status unchanged"
      });
    }
  } catch (err) {
    console.error('Error updating paper status:', err);
    res.status(500).json({
      success: false,
      message: "Failed to update status",
      error: err.message
    });
  }
});

// Delete paper
router.delete("/papers/:id", checkDatabaseConnection, async (req, res) => {
  try {
    const { id } = req.params;
    const collection = databaseManager.getCollection("researchpapers");
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount > 0) {
      res.json({
        success: true,
        message: "Paper deleted successfully"
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Paper not found"
      });
    }
  } catch (err) {
    console.error('Error deleting paper:', err);
    res.status(500).json({
      success: false,
      message: "Failed to delete paper",
      error: err.message
    });
  }
});

module.exports = router; 