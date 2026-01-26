//import necessary libraries
const express = require('express');
const cors = require('cors');

//import chatbot route
const chatbotRoutes = require('./routes/chatbot.routes');

const app = express();

//enables fronntend to talk to backend
app.use(cors());
app.use(express.json());

//register chatbot route
app.use('/chatbot', chatbotRoutes);

//export app to server.js
module.exports = app;

