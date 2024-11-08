const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dynamoDB = require('../config/db'); // Import the client directly
const { GetItemCommand, PutItemCommand } = require('@aws-sdk/client-dynamodb');

// Signup
exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    const params = {
      TableName: 'Users',
      Key: {
        email: { S: email }
      }
    };

    const user = await dynamoDB.send(new GetItemCommand(params));
    if (user.Item) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserParams = {
      TableName: 'Users',
      Item: {
        email: { S: email },
        username: { S: username },
        password: { S: hashedPassword }
      }
    };

    await dynamoDB.send(new PutItemCommand(newUserParams));

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};


// login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const params = {
      TableName: 'Users',
      Key: {
        email: { S: email } // DynamoDB requires specifying the data type, `S` for string
      }
    };

    const user = await dynamoDB.send(new GetItemCommand(params));

    if (!user.Item) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.Item.password.S);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

  