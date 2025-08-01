# Cloudinary Setup Guide

## Environment Variables Setup

Create a `.env` file in your Server2 directory with the following variables:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here

# MongoDB Configuration (optional - will use default if not set)
MONGODB_URI=mongodb+srv://ridwanshuvo38:ridwanshuvo38@clusterresearch.nrhvslo.mongodb.net/research_portal?retryWrites=true&w=majority

# Server Configuration
PORT=5000
```

## How to Get Cloudinary Credentials

1. Go to [Cloudinary Console](https://cloudinary.com/console)
2. Sign up or log in to your account
3. Go to Dashboard
4. Copy your:
   - Cloud Name
   - API Key
   - API Secret

## Features Added

### 1. Enhanced Cloudinary Configuration (`config/cloudinary.js`)
- ✅ Connection testing
- ✅ File upload with automatic format detection
- ✅ File deletion capability
- ✅ Error handling
- ✅ Support for PDF, DOC, DOCX, and TXT files

### 2. Improved Upload Middleware (`middleware/upload.js`)
- ✅ File type validation
- ✅ File size limits (10MB)
- ✅ Error handling for upload issues
- ✅ Memory storage for Cloudinary integration

### 3. Robust Database Management (`config/database.js`)
- ✅ Automatic reconnection on connection loss
- ✅ Connection health monitoring
- ✅ Graceful error handling
- ✅ Connection pooling optimization
- ✅ Event-driven reconnection logic

### 4. Updated Server Integration (`index.js`)
- ✅ Cloudinary connection testing on startup
- ✅ Automatic file upload to Cloudinary
- ✅ File metadata storage in MongoDB
- ✅ Enhanced error responses
- ✅ Database connection status checking
- ✅ Health check endpoint
- ✅ Graceful shutdown handling

## API Endpoints

### Health Check
```
GET /health
```
Returns server health status including database and Cloudinary connection status.

### Submit Paper with File Upload
```
POST /api/submit
Content-Type: multipart/form-data

Fields:
- file: PDF, DOC, DOCX, or TXT file (optional)
- title: Paper title
- author: Author name
- abstract: Paper abstract
- keywords: Keywords (comma-separated)
- status: Paper status (default: 'pending')
```

### Response Format
```json
{
  "success": true,
  "message": "Paper submitted successfully",
  "id": "mongodb_document_id",
  "fileData": {
    "url": "https://res.cloudinary.com/...",
    "public_id": "research_papers/...",
    "format": "pdf",
    "size": 1234567,
    "originalName": "paper.pdf"
  }
}
```

## Database Connection Features

### Automatic Reconnection
- ✅ Attempts reconnection up to 5 times
- ✅ 5-second delay between attempts
- ✅ Event-driven reconnection triggers
- ✅ Connection status monitoring

### Connection Health Monitoring
- ✅ Real-time connection status
- ✅ Health check endpoint
- ✅ Automatic ping testing
- ✅ Connection event logging

### Error Handling
- ✅ Graceful degradation on connection loss
- ✅ Detailed error logging
- ✅ User-friendly error messages
- ✅ Automatic recovery attempts

## File Storage Structure

Files are stored in Cloudinary with the following structure:
- **Folder**: `research_papers/`
- **Allowed Formats**: PDF, DOC, DOCX, TXT
- **Max Size**: 10MB per file
- **Transformations**: Auto-optimization enabled

## Testing the Setup

1. Start your server: `npm run dev`
2. Check console for connection status messages
3. Visit health check: `http://localhost:5000/health`
4. Test file upload via POST `/api/submit`
5. Verify file appears in your Cloudinary dashboard

## Error Handling

The system now handles:
- ✅ Invalid file types
- ✅ File size limits
- ✅ Cloudinary upload failures
- ✅ Network connectivity issues
- ✅ Database connection problems
- ✅ Automatic reconnection
- ✅ Graceful shutdown
- ✅ Connection timeouts

## Monitoring & Debugging

### Console Logs
- 🔄 Connection attempts
- ✅ Successful connections
- ❌ Connection failures
- ⚠️ Connection warnings
- 🛑 Shutdown messages

### Health Check Response
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": {
    "status": "healthy",
    "message": "Database connection is healthy"
  },
  "cloudinary": "connected",
  "uptime": 123.456
}
``` 