const express = require('express');
const router = express.Router();

//import controller
const { askChatbot } = require('../controllers/chatbot.controller');

//Define route
router.post('/ask', askChatbot);

//export router to app.js
module.exports = router;
