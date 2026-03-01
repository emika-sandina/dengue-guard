import express from 'express'
const router = express.Router();

//Import the controller 
import { displaySites } from '../controllers/manageSites.controller.js';

//Defining a post method to create a new report

router.post('/site-reports', displaySites);

export default router;