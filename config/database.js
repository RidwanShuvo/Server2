// config/database.js
const { MongoClient, ServerApiVersion } = require("mongodb");
require('dotenv').config();

class DatabaseManager {
  constructor() {
    this.client = null;
    this.db = null;
    this.collections = {};
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 5000; // 5 seconds
    
    // MongoDB connection options
    this.options = {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority'
    };
  }

  // Get MongoDB URI from environment or use default
  getMongoURI() {
    return process.env.MONGODB_URI || 
           `mongodb+srv://ridwanshuvo38:ridwanshuvo38@clusterresearch.nrhvslo.mongodb.net/research_portal?retryWrites=true&w=majority`;
  }

  // Initialize database connection
  async connect() {
    try {
      console.log('🔄 Connecting to MongoDB...');
      
      this.client = new MongoClient(this.getMongoURI(), this.options);
      
      // Connect to MongoDB
      await this.client.connect();
      
      // Test the connection
      await this.client.db("admin").command({ ping: 1 });
      
      // Initialize database and collections
      this.db = this.client.db("research_portal");
      this.collections.researchPapers = this.db.collection("researchpapers");
      
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      console.log('✅ Successfully connected to MongoDB!');
      
      // Set up connection event listeners
      this.setupConnectionListeners();
      
      return true;
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error.message);
      this.isConnected = false;
      
      // Attempt reconnection if under max attempts
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        await this.handleReconnection();
      } else {
        console.error('❌ Max reconnection attempts reached. Please check your MongoDB connection.');
      }
      
      return false;
    }
  }

  // Handle reconnection logic
  async handleReconnection() {
    this.reconnectAttempts++;
    console.log(`🔄 Attempting to reconnect to MongoDB (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
    
    setTimeout(async () => {
      try {
        await this.connect();
      } catch (error) {
        console.error('❌ Reconnection failed:', error.message);
      }
    }, this.reconnectDelay);
  }

  // Set up connection event listeners
  setupConnectionListeners() {
    if (!this.client) return;

    this.client.on('close', () => {
      console.log('⚠️ MongoDB connection closed');
      this.isConnected = false;
      this.handleReconnection();
    });

    this.client.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error.message);
      this.isConnected = false;
    });

    this.client.on('timeout', () => {
      console.log('⚠️ MongoDB connection timeout');
      this.isConnected = false;
    });

    this.client.on('reconnect', () => {
      console.log('✅ MongoDB reconnected');
      this.isConnected = true;
    });
  }

  // Get collection with connection check
  getCollection(collectionName) {
    if (!this.isConnected || !this.db) {
      throw new Error('Database not connected');
    }
    return this.db.collection(collectionName);
  }

  // Check if database is connected
  isDatabaseConnected() {
    return this.isConnected && this.client && this.db;
  }

  // Graceful shutdown
  async disconnect() {
    try {
      if (this.client) {
        await this.client.close();
        console.log('✅ MongoDB connection closed gracefully');
      }
    } catch (error) {
      console.error('❌ Error closing MongoDB connection:', error.message);
    }
  }

  // Health check
  async healthCheck() {
    try {
      if (!this.isConnected) {
        return { status: 'disconnected', message: 'Database not connected' };
      }
      
      await this.client.db("admin").command({ ping: 1 });
      return { status: 'healthy', message: 'Database connection is healthy' };
    } catch (error) {
      this.isConnected = false;
      return { status: 'unhealthy', message: error.message };
    }
  }
}

// Create singleton instance
const databaseManager = new DatabaseManager();

module.exports = databaseManager; 