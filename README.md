<<<<<<< HEAD
=======
---
>>>>>>> 088f32371ce112579c5c75b709ef7967b7d5f390
# Cloud-Based Video Streaming Service

A cloud-based video streaming service that allows users to upload, view, and stream videos with metadata stored in AWS DynamoDB and video files stored in AWS S3. The project leverages the power of AWS services, including S3 for video storage, DynamoDB for metadata storage, and the AWS SDK for JavaScript (v3).

## Features
- **User Authentication**: Implemented sign-up and login functionality using JWT for secure authentication.
- **Video Upload**: Users can upload videos with metadata (title, description, quality) to AWS S3 and store the metadata in DynamoDB.
- **Video Streaming**: Users can view videos via pre-signed URLs generated from AWS S3.
- **User Profile**: Users can view their profile with their uploaded videos and user details.
- **Video Deletion**: Users can delete their uploaded videos with a confirmation prompt to prevent accidental deletions.
- **Search Videos**: Users can search for videos by title, description, or author.

## Technologies Used
- **Backend**: Node.js, Express
- **Frontend**: React
- **Database**: AWS DynamoDB
- **Video Storage**: AWS S3
- **Authentication**: JWT
- **AWS SDK for JavaScript (v3)**
- **File Upload**: Multer (for handling video uploads)
- **Content Delivery**: AWS CloudFront

## Prerequisites
1. **AWS Account**: Set up AWS services like S3 and DynamoDB.
2. **Node.js**: Install Node.js and npm.

## Environment Variables
Ensure you have the following environment variables set up in your `.env` file:
```bash
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET_NAME=your_s3_bucket_name
DYNAMODB_USERS_TABLE_NAME=your_users_table_name
DYNAMODB_VIDEO_TABLE_NAME=your_videos_table_name
CLOUDFRONT_DOMAIN=your_cloudfront_domain
JWT_SECRET=your_jwt_secret_key
PORT=your_preferred_port
```

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cloud-video-streaming.git
   cd cloud-video-streaming
   ```
2. Navigate to the backend directory and install dependencies:

   ```bash
   cd backend
   npm install
   ```
3. Navigate to the frontend directory and install dependencies:
   ```bash
   cd frontend
   npm install
   ```

4. Create the required .env file in the backend directory with your AWS credentials and DynamoDB table names.

5. Run the backend server:
   ```bash
   cd backend
   npm start
   ```

6. Run the frontend server:
   ```bash
   cd frontend
   npm start
   ```

7. Access the application:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000
     
   `Or any other port of your preference` 

## API Endpoints

### Authentication
- **POST** `/api/auth/signup`: Registers a new user.
- **POST** `/api/auth/login`: Logs in a user and returns a JWT.

### Video
- **POST** `/api/video/upload`: Uploads a video with metadata and stores it in AWS S3 and DynamoDB.
<<<<<<< HEAD
- **GET** `/api/video`: Fetches all videos.
=======
- **GET** `/api/video/videos`: Fetches all videos.
>>>>>>> 088f32371ce112579c5c75b709ef7967b7d5f390
- **GET** `/api/video/view/{videoId}`: Fetches video metadata from DynamoDB and generates a pre-signed URL to stream the video from AWS S3.
- **GET** `/api/video/search`:Searches for videos by title, description, or author.
- **GET** `/api/video/author/{email}`:Fetches all videos uploaded by a specific user.
- **DELETE** `/api/video/{videoId}`:Deletes a video and its metadata.

## Notes
- The video upload feature handles video file uploads using Multer.
- Videos are stored in AWS S3, and metadata is stored in DynamoDB for tracking.
- The frontend is built with React and communicates with the backend via API endpoints.

---
