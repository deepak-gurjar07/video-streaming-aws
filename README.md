---

# Cloud-Based Video Streaming Service

A cloud-based video streaming service that allows users to upload, view, and stream videos with metadata stored in AWS DynamoDB and video files stored in AWS S3. The project leverages the power of AWS services, including S3 for video storage, DynamoDB for metadata storage, and the AWS SDK for JavaScript (v3).

## Features
- **User Authentication**: Implemented sign-up and login functionality using JWT for secure authentication.
- **Video Upload**: Users can upload videos with metadata (title, description, quality) to AWS S3 and store the metadata in DynamoDB.
- **Video Streaming**: Users can view videos via pre-signed URLs generated from AWS S3.

## Technologies Used
- **Backend**: Node.js, Express
- **Database**: AWS DynamoDB
- **Video Storage**: AWS S3
- **Authentication**: JWT
- **AWS SDK for JavaScript (v3)**
- **File Upload**: Multer (for handling video uploads)
- **Deployment**: AWS Services (S3, DynamoDB, CloudFront)

## Prerequisites
1. **AWS Account**: Set up AWS services like S3 and DynamoDB.
2. **Node.js**: Install Node.js and npm.
3. **Postman**: For testing the API endpoints.

## Environment Variables
Ensure you have the following environment variables set up in your `.env` file:
```
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET_NAME=your_s3_bucket_name
DYNAMODB_TABLE_NAME=your_dynamodb_table_name
JWT_SECRET=your_jwt_secret_key
PORT=your_preferred_port
```

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cloud-video-streaming.git
   cd cloud-video-streaming
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create the required `.env` file with your AWS credentials and DynamoDB table name.

4. Run the server:
   ```bash
   npm start
   ```

5. Test API Endpoints with Postman:
   - **Sign Up**: `POST /api/auth/signup`
   - **Login**: `POST /api/auth/login`
   - **Upload Video**: `POST /api/video/upload` (with video file and metadata in the body)
   - **View Video**: `GET /api/video/view/{videoId}`

## API Endpoints

### Authentication
- **POST** `/api/auth/signup`: Registers a new user.
- **POST** `/api/auth/login`: Logs in a user and returns a JWT.

### Video
- **POST** `/api/video/upload`: Uploads a video with metadata and stores it in AWS S3 and DynamoDB.
- **GET** `/api/video/view/{videoId}`: Fetches video metadata from DynamoDB and generates a pre-signed URL to stream the video from AWS S3.

## Notes
- The video upload feature handles video file uploads using Multer.
- Videos are stored in AWS S3, and metadata is stored in DynamoDB for tracking.

---
