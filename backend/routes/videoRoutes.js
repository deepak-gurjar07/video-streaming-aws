const express = require('express');
const { uploadVideo, getVideoById, getAllVideos, searchVideos, getVideosByAuthor, deleteVideo } = require('../controllers/videoController');
const router = express.Router();
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Video upload route
router.post('/upload', upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), uploadVideo);
router.get("/view/:videoId", getVideoById);
router.get("/videos", getAllVideos);
router.get('/search', searchVideos);
router.get('/author/:email', getVideosByAuthor); // New route for fetching videos by author
router.delete('/:videoId', deleteVideo); // New route for deleting videos

module.exports = router;