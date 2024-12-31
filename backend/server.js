const dotenv = require('dotenv');
const express = require('express');
const connectDB = require('./config/db');
const cors = require("cors");

dotenv.config();
connectDB

const app = express();

app.use(
    cors({
      origin: "http://localhost:3000", 
      methods: ["GET", "POST", "PUT", "DELETE"], 
      credentials: true, // Allow cookies and credentials if needed
    })
  );

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/video', require('./routes/videoRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));