import express from 'express'
const router = express.Router();

//import controller
import { askChatbot } from '../controllers/chatbot.controller.js';


//Define route
router.post('/ask', askChatbot);

//export router to app.js
export default router;
