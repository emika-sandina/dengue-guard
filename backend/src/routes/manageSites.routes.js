import express from 'express'
const router = express.Router();

//Import the controller 
import { displaySites, removeSite, verifySite, resolveSite } from '../controllers/manageSites.controller.js';
import { authenticate } from '../middleware/authMS.middleware.js';

//Defining a get method to display the sites
router.get('/site-reports',authenticate, displaySites);
// Defining delete to delete the sites
router.delete('/site-reports/:id', authenticate, removeSite);
router.patch('/site-reports/:id', authenticate, verifySite);
router.patch('/site-reports/:id', authenticate, resolveSite);

export default router;