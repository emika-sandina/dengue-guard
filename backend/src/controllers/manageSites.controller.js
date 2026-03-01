// Created a safety net for in case there are no breeding sites reported, successfully displayed and error
import {fetchReportSites} from "../services/manageSites.service.js";

export const displaySites = async (req, res) => {
    try{
        // await till supabase gets the data
        const reportSite = await fetchReportSites();
        if (reportSite.length === 0)
            {
            res.status(200).json({
                message: "No sites reported"
            });
            return
        }
        res.status(200).json({
            message: "Breeding site is displayed",
            reportSite
        });
    }
    catch(error){
        res.status(500).json({
            error: "Couldn't display the breeding site, " + error.message
        });
    }
}