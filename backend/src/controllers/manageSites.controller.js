// Created a safety net for in case there are no breeding sites reported, successfully displayed and error
import {fetchReportSites, fetchMohLocation, deleteSites} from "../services/manageSites.service.js";

export const displaySites = async (req, res) => {
    try{
        const {token, user} = req;  // token and user from the middleware

        // calls then fetchMohloaction function in the service file, which returns the moh officers id and moh area
        const mohProfile = await fetchMohLocation(token);

        if (!mohProfile){
            return res.status(404).json({
                message: "Officer profile not found"
            })
        }

        // calls the fetchReportSites function in the service file, which return all the details of the sites
        // TODO NOTE better performance, we should filter directly in the SQL query later
        const reportSite = await fetchReportSites(token);

        if (reportSite.length === 0){
            res.status(200).json({
                message: "No sites reported"
            });
            return
        }

        // filter to only diplay sites from the same moh area as the moh officer
        const filteredSites = reportSite.filter(
            (site) => site.moh_area?.replace("MOH-","").trim().toLowerCase() === mohProfile.moh_area.trim().toLowerCase()   // NOTE Short-term fix on the names of the moh area. best to change it on supabase
        );

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