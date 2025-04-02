const express = require('express');
const { uploadVideo, getVideoById, getAllVideos, searchVideos, getVideosByAuthor, deleteVideo, updateVideo, updateThumbnail } = require('../controllers/videoController');
const router = express.Router();
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Video routes
router.post('/upload', upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), uploadVideo);
router.get('/videos', getAllVideos);
router.get('/search', searchVideos);
router.get('/author/:email', getVideosByAuthor); 
router.get('/view/:videoId', getVideoById);
router.get('/:videoId', getVideoById);
router.delete('/:videoId', deleteVideo);
router.post('/update', updateVideo);
router.post('/update-thumbnail', upload.single('thumbnail'), updateThumbnail);

module.exports = router;