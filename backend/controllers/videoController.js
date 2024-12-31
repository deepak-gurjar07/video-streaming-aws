const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { PutItemCommand, GetItemCommand, ScanCommand, DeleteItemCommand } = require('@aws-sdk/client-dynamodb');
const s3Client = require('../config/s3Client');
const dynamoDBClient = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
require('dotenv').config();

const { AWS_S3_BUCKET_NAME, DYNAMODB_VIDEO_TABLE_NAME, CLOUDFRONT_DOMAIN } = process.env;

exports.uploadVideo = async (req, res) => {
  try {
    const { title, description, author, quality, email } = req.body;
    const videoFile = req.files.video[0]; // using multer for file uploads
    const thumbnailFile = req.files.thumbnail[0]; // using multer for file uploads

    if (!videoFile || !thumbnailFile) {
      return res.status(400).json({ error: 'Video file and thumbnail file are required' });
    }

    // Generate unique filenames for the video and thumbnail in S3
    const videoId = uuidv4();
    const videoKey = `${videoId}${path.extname(videoFile.originalname)}`;
    const thumbnailKey = `${videoId}-thumbnail${path.extname(thumbnailFile.originalname)}`;

    // Upload the video to S3
    const uploadVideoParams = {
      Bucket: AWS_S3_BUCKET_NAME,
      Key: videoKey,
      Body: videoFile.buffer,
      ContentType: videoFile.mimetype,
    };

    await s3Client.send(new PutObjectCommand(uploadVideoParams));

    // Upload the thumbnail to S3
    const uploadThumbnailParams = {
      Bucket: AWS_S3_BUCKET_NAME,
      Key: thumbnailKey,
      Body: thumbnailFile.buffer,
      ContentType: thumbnailFile.mimetype,
    };

    await s3Client.send(new PutObjectCommand(uploadThumbnailParams));

    // Save video metadata to DynamoDB
    const videoUrl = `${CLOUDFRONT_DOMAIN}/${videoKey}`;
    const thumbnailUrl = `${CLOUDFRONT_DOMAIN}/${thumbnailKey}`;
    const dbParams = {
      TableName: DYNAMODB_VIDEO_TABLE_NAME,
      Item: {
        videoId: { S: videoId },
        title: { S: title },
        description: { S: description },
        author: { S: author },
        email: { S: email },
        videokey: { S: videoKey },
        thumbnailUrl: { S: thumbnailUrl },
        quality: { S: quality || 'Unknown' }, 
        videoUrl: { S: videoUrl },
        uploadDate: { S: new Date().toISOString() },
      },
    };

    await dynamoDBClient.send(new PutItemCommand(dbParams));

    res.status(200).json({ message: 'Video and thumbnail uploaded successfully', videoUrl, thumbnailUrl });
  } catch (error) {
    console.error('Error uploading video and thumbnail:', error);
    res.status(500).json({ error: 'Failed to upload video and thumbnail' });
  }
};

exports.getVideoById = async (req, res) => {
  try {
    const { videoId } = req.params;

    const dbParams = {
      TableName: DYNAMODB_VIDEO_TABLE_NAME,
      Key: {
        videoId: { S: videoId },
      },
    };

    const videoData = await dynamoDBClient.send(new GetItemCommand(dbParams));

    if (!videoData.Item) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Return video metadata and CloudFront URL
    res.status(200).json({
      videoId: videoData.Item.videoId?.S,
      title: videoData.Item.title?.S,
      description: videoData.Item.description?.S,
      author: videoData.Item.author?.S,
      quality: videoData.Item.quality?.S,
      uploadDate: videoData.Item.uploadDate?.S,
      videoUrl: videoData.Item.videoUrl?.S,
      thumbnailUrl: videoData.Item.thumbnailUrl?.S,
    });
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({ error: 'Failed to fetch video' });
  }
};

exports.getAllVideos = async (req, res) => {
  try {
    // Scan the DynamoDB table to get all video records
    const scanParams = {
      TableName: DYNAMODB_VIDEO_TABLE_NAME,
    };

    const result = await dynamoDBClient.send(new ScanCommand(scanParams));

    const videos = result.Items.map(item => ({
      videoId: item.videoId?.S || '',
      title: item.title?.S || '',
      description: item.description?.S || '',
      author: item.author?.S || '',
      quality: item.quality?.S || 'Unknown',
      uploadDate: item.uploadDate?.S || '',
      videoUrl: item.videoUrl?.S || '',
      thumbnailUrl: item.thumbnailUrl?.S || '',
    }));

    res.status(200).json(videos);
  } catch (error) {
    console.error('Error listing videos:', error);
    res.status(500).json({ error: 'Failed to list videos' });
  }
};

exports.searchVideos = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    // Scan the DynamoDB table to get all video records
    const scanParams = {
      TableName: DYNAMODB_VIDEO_TABLE_NAME,
    };

    const result = await dynamoDBClient.send(new ScanCommand(scanParams));

    // Filter videos based on the query
    const videos = result.Items.filter(item => 
      (item.title?.S || '').toLowerCase().includes(query.toLowerCase()) ||
      (item.description?.S || '').toLowerCase().includes(query.toLowerCase()) ||
      (item.author?.S || '').toLowerCase().includes(query.toLowerCase())
    ).map(item => ({
      videoId: item.videoId?.S || '',
      title: item.title?.S || '',
      description: item.description?.S || '',
      author: item.author?.S || '',
      quality: item.quality?.S || 'Unknown',
      uploadDate: item.uploadDate?.S || '',
      videoUrl: item.videoUrl?.S || '',
      thumbnailUrl: item.thumbnailUrl?.S || '',
    }));

    res.status(200).json(videos);
  } catch (error) {
    console.error("Error searching videos:", error);
    res.status(500).json({ error: "Failed to search videos" });
  }
};

exports.getVideosByAuthor = async (req, res) => {
  try {
    const { email } = req.params;

    // Scan the DynamoDB table to get all video records
    const scanParams = {
      TableName: DYNAMODB_VIDEO_TABLE_NAME,
    };

    const result = await dynamoDBClient.send(new ScanCommand(scanParams));

    // Filter videos based on the author
    const videos = result.Items.filter(item => item.email?.S === email).map(item => ({
      videoId: item.videoId?.S || '',
      title: item.title?.S || '',
      description: item.description?.S || '',
      author: item.author?.S || '',
      quality: item.quality?.S || 'Unknown',
      uploadDate: item.uploadDate?.S || '',
      videoUrl: item.videoUrl?.S || '',
      thumbnailUrl: item.thumbnailUrl?.S || '',
    }));

    res.status(200).json(videos);
  } catch (error) {
    console.error("Error fetching videos by author:", error);
    res.status(500).json({ error: "Failed to fetch videos by author" });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { email } = req.body;

    // Fetch the video metadata from DynamoDB
    const dbParams = {
      TableName: DYNAMODB_VIDEO_TABLE_NAME,
      Key: {
        videoId: { S: videoId },
      },
    };

    const videoData = await dynamoDBClient.send(new GetItemCommand(dbParams));

    if (!videoData.Item) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Check if the requesting user is the author of the video
    if (videoData.Item.email.S !== email) {
      return res.status(403).json({ error: 'You are not authorized to delete this video' });
    }

    // Delete the video and thumbnail from S3
    const deleteVideoParams = {
      Bucket: AWS_S3_BUCKET_NAME,
      Key: videoData.Item.videokey.S,
    };

    const deleteThumbnailParams = {
      Bucket: AWS_S3_BUCKET_NAME,
      Key: videoData.Item.thumbnailUrl.S.split('/').pop(),
    };

    await s3Client.send(new DeleteObjectCommand(deleteVideoParams));
    await s3Client.send(new DeleteObjectCommand(deleteThumbnailParams));

    // Delete the video metadata from DynamoDB
    await dynamoDBClient.send(new DeleteItemCommand(dbParams));

    res.status(200).json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
};