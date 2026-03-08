import express from 'express'
const router = express.Router();

//Import the controller 
import { displaySites, removeSite } from '../controllers/manageSites.controller.js';
import { authenticate } from '../middleware/authMS.middleware.js';

//Defining a get method to display the sites.
router.get('/site-reports',authenticate, displaySites);
router.delete('/site-reports/:id', authenticate, removeSite);

export default router;