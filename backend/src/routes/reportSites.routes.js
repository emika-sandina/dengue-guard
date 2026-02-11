const express = require('express');
const router = express.Router();
//Import the controller
const {submitSiteReports} = require('../controllers/reportSites.controller');

//Defining a post method to create a new report

router.post('/report-sites', submitSiteReports);

export default router;

