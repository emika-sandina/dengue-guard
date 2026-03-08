import express from 'express'
const router = express.Router();

//Import the controller 
import { displaySites } from '../controllers/manageSites.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

//Defining a get method to display the sites.
router.get('/site-reports',authenticate, displaySites);

export default router;