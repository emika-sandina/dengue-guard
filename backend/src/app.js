//import necessary libraries
const express = require('express');
const cors = require('cors');

//import chatbot route
const chatbotRoutes = require('./routes/chatbot.routes');
const reportCasesRoutes = require('./routes/reportCases.routes');
const app = express();

//enables fronntend to talk to backend
app.use(cors());
app.use(express.json());

//register chatbot route
app.use('/chatbot', chatbotRoutes);
//register report cases route (frontend expects /api/report-case)
app.use('/api', reportCasesRoutes);
//export app to server.js
module.exports = app;

