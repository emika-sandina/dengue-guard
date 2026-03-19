// Created a safety net for in case there are no breeding sites reported, successfully displayed and error
import {fetchReportSites, deleteSites, verifySites, assignPhi} from "../services/manageSites.service.js";

export const displaySites = async (req, res) => {
    try{
        const {user} = req;  // user from the middleware

        // calls the fetchReportSites function in the service file, which return all the details of the sites
        const reportSite = await fetchReportSites();

        if (reportSite.length === 0){
            res.status(200).json({
                message: "No sites reported"
            });
            return
        }

        // filter to only diplay sites from the same moh area as the moh officer
        const filteredSites = reportSite.filter(
            (site) => {if (!site.moh_area || !user.mohArea) return false;
               return site.moh_area.replace("MOH-","").trim().toLowerCase() === user.mohArea.trim().toLowerCase() 
                
        });

        // Return the filtered list to the frontend
        res.status(200).json({
            message: "Breeding site is displayed",
            filteredSites
        });
    }
    catch(error){
        res.status(500).json({
            error: "Couldn't display the breeding site, " + error.message
        });
    }
}

export const removeSite = async (req, res) => {
    try{
        const { id } = req.params;
        const result = await deleteSites(id);
        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ error: "Couldn't delete the site, " + error.message });
    }
};

// Function to update breeding site (verify, resolved, assign PHI)
export const updateSite = async (req, res) => {
    try{
        const {id} = req.params;
        const body = req.body;

        if (body.status){
            const result = await verifySites(id,body.status);
            return res.status(200).json(result);
        }

        if (body.phi_assign){
            const result = await assignPhi(id, body.phi_assign);
            return res.status(200).json(result);
        }

        return res.status(400).json({error: "No valid fields to update"});
    }
    catch (error){
        res.status(500).json({
            error: "Update failed",
            operation: JSON.stringify(req.body),
            details: error.message
        });
    }
};