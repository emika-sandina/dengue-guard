import express from 'express'
const router = express.Router();

//Import the controller 
import { displaySites, removeSite, updateSite } from '../controllers/manageSites.controller.js';
import {authMiddleware} from '../middleware/auth.middleware.js';
import {authorizeMOH} from '../middleware/role.middleware.js';

// Use middlewares to protect the route, ensuring only after both security checks in middleware are passed before passing
//Defining a get method to display the sites
router.get('/site-reports',authMiddleware, authorizeMOH, displaySites);
// Defining delete to delete the sites
router.delete('/site-reports/:id', authMiddleware, authorizeMOH, removeSite);
// Defining delete to delete the sites
router.patch('/site-reports/:id', authMiddleware, authorizeMOH, updateSite);

export default router;