const { PutObjectCommand,GetObjectCommand } = require("@aws-sdk/client-s3");
const { PutItemCommand,GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")
const s3Client = require("../config/s3Client");
const dynamoDBClient = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const { AWS_S3_BUCKET_NAME, DYNAMODB_TABLE_NAME } = process.env;

exports.uploadVideo = async (req, res) => {
  try {
    const { title, description, quality } = req.body;
    const videoFile = req.file; // using multer for file uploads

    if (!videoFile) {
      return res.status(400).json({ error: "No video file uploaded" });
    }

    // Generate a unique filename for the video in S3
    const videoKey = `${uuidv4()}${path.extname(videoFile.originalname)}`;

    // Upload video to S3
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: videoKey,
      Body: videoFile.buffer,
      ContentType: videoFile.mimetype,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    // Store metadata in DynamoDB
    const metadataParams = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: {
        videoId: { S: uuidv4() }, // unique ID for each video
        title: { S: title },
        description: { S: description },
        quality: { S: quality },
        videoKey: { S: videoKey },
        uploadDate: { S: new Date().toISOString() },
      },
    };

    await dynamoDBClient.send(new PutItemCommand(metadataParams));

    res.status(201).json({ message: "Video uploaded successfully", videoKey });
  } catch (error) {
    console.error("Error uploading video:", error);
    res.status(500).json({ error: "Video upload failed" });
  }
};


exports.viewVideo = async (req, res) => {
  try {
    const { videoId } = req.params; // Video ID from the request params

    // Fetch video metadata from DynamoDB
    const metadataParams = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: {
        videoId: { S: videoId },
      },
    };

    const videoData = await dynamoDBClient.send(new GetItemCommand(metadataParams));

    if (!videoData.Item) {
      return res.status(404).json({ error: "Video not found" });
    }

    const videoKey = videoData.Item.videoKey.S;

    // Generate pre-signed URL to view the video from S3
    const s3Params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: videoKey,
    };

    const signedUrl = await getSignedUrl(s3Client, new GetObjectCommand(s3Params), { expiresIn: 3600 }); // 1-hour validity

    // Return video metadata and pre-signed URL
    res.status(200).json({
      title: videoData.Item.title.S,
      description: videoData.Item.description.S,
      quality: videoData.Item.quality.S,
      uploadDate: videoData.Item.uploadDate.S,
      videoUrl: signedUrl,
    });
  } catch (error) {
    console.error("Error fetching video:", error);
    res.status(500).json({ error: "Failed to fetch video" });
  }
};