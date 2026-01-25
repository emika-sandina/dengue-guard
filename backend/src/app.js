const express = require('express');
const cors = require('cors');
const chatbotRoute = require('./chatbot'); 

const app = express();

app.use(cors({ origin: 'http://localhost:5174' }));
app.use(express.json());

// Register chatbot route
app.use('/chatbot', chatbotRoute);

module.exports = app;
