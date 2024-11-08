const express = require('express');
const { uploadVideo, viewVideo } = require('../controllers/videoController');
const router = express.Router();
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Video upload route
router.post('/upload', upload.single('video'), uploadVideo);
router.get("/view/:videoId", viewVideo);

module.exports = router;
