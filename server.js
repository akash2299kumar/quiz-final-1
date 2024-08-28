const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const quizRoutes = require('./routes/quizRoutes');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Enable CORS
app.use(cors());

// Middleware for logging requests
app.use((req, res, next) => {
    const log = `${req.method} - ${req.url} - ${req.ip} - ${new Date().toISOString()}\n`;
    fs.appendFile('log.txt', log, (err) => {
        if (err) {
            console.error('Error logging request:', err);
        }
    });
    next();
});

// Middleware for parsing JSON request bodies
app.use(bodyParser.json());

// Root route
app.get('/', (req, res) => {
    res.send('Hello User, Welcome to Quizzie');
});

// User and Quiz routes
app.use('/api/user', userRoutes);
app.use('/api/quiz', quizRoutes);

// Error-handling middleware
app.use((err, req, res, next) => {
    const errorLog = `${err.stack}\n${req.method} - ${req.url} - ${req.ip} - ${new Date().toISOString()}\n`;
    fs.appendFile('error.txt', errorLog, (err) => {
        if (err) {
            console.error('Error logging error:', err);
        }
    });
    res.status(500).send('Something went wrong');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
   
});

mongoose.connection.on('connected', () => {
    console.log('MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
