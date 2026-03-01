import express from 'express'
const router = express.Router();

//Import the controller 
import { displaySites } from '../controllers/manageSites.controller.js';

//Defining a post method to create a new report

router.get('/site-reports', displaySites);

export default router;