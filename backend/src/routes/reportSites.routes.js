import express from 'express'
const router = express.Router();
//Import the controller
import { submitSiteReports } from '../controllers/reportSites.controller.js';

//Defining a post method to create a new report

router.post('/report-sites', submitSiteReports);

export default router;

