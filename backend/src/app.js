//Importing the necessary libraries
const express = require("express");
const cors = require("cors");

//import chatbot route
const chatbotRoutes = require('./routes/chatbot.routes');

//Importing the necessary routes
const chatbotRoutes = require("./routes/chatbot.routes");
const reportCasesRoutes = require("./routes/reportCases.routes");
const reportSitesRoutes = require("./routes/reportSites.routes");
const app = express();

//Allows the frontend to talk to the backend
app.use(cors());
app.use(express.json());

//register chatbot route
app.use('/chatbot', chatbotRoutes);

app.use("/chatbot", chatbotRoutes);
//register report cases route (frontend expects /api/report-case)
app.use("/api", reportCasesRoutes);
//register report breeding sites route
app.use("/api", reportSitesRoutes);
//export app to server.js
module.exports = app;
