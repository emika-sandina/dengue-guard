import express from 'express'
const router = express.Router();

//Import the controller 
import { displaySites } from '../controllers/manageSites.controller.js';

//Defining a get method to display the sites.
router.get('/site-reports', displaySites);

export default router;