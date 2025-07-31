// middleware/upload.js
const multer = require('multer');
const storage = multer.memoryStorage(); // or configure as needed
const upload = multer({ storage });
module.exports = upload;
