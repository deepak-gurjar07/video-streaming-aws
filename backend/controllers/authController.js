const { DynamoDBClient, GetItemCommand, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const dynamoDBClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const USERS_TABLE_NAME = process.env.DYNAMODB_USERS_TABLE_NAME;

exports.signup = async (req, res) => {
  const { email, username, password } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ error: 'Please provide username, password, and email' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const params = {
      TableName: USERS_TABLE_NAME,
      Item: {
        email: { S: email },
        username: { S: username },
        password: { S: hashedPassword }
      }
    };

    await dynamoDBClient.send(new PutItemCommand(params));

    const token = jwt.sign({ email, username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, email, username });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password' });
  }

  try {
    const params = {
      TableName: USERS_TABLE_NAME,
      Key: {
        email: { S: email }
      }
    };

    const data = await dynamoDBClient.send(new GetItemCommand(params));

    if (!data.Item) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const storedPassword = data.Item.password.S;

    const isMatch = await bcrypt.compare(password, storedPassword);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ email , username : data.Item.username.S }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token , email, username: data.Item.username.S });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Server error' });
  }
};