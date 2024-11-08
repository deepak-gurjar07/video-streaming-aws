const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
require('dotenv').config();

const dynamodbClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

const connectDB = () => {
  console.log('DynamoDB connected!');
};

connectDB(); 

module.exports = dynamodbClient; 