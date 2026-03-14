// Created a safety net for in case there are no breeding sites reported, successfully displayed and error
import {fetchReportSites, fetchMohLocation, deleteSites, verifySites, assignPhi} from "../services/manageSites.service.js";

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
        // NOTE better performance, we should filter directly in the SQL query later
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

// Function to update breeding site (veridy, resolved, assign PHI)
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

        return res.status(400).json({error: "No vaild fields to update"});
    }
    catch (error){
        res.status(500).json({
            error: "Update failed",
            operation: JSON.stringify(req.body),
            details: error.message
        });
    }
};

// export const verifySite = async (req, res) => {
//     try{
//         const { id } = req.params;
//         const {status: newStatus} = req.body;
//         const result = await verifySites(id,newStatus);
//         res.status(200).json(result);
//     } catch (error) {
//         res.status(500).json({ error: "Couldn't verify the site, " + error.message });
//     }
// };

// export const resolveSite = async (req, res) => {
//     try{
//         const { id } = req.params;
//         const {status: newStatus} = req.body;
//         const result = await resolveSites(id,newStatus);
//         res.status(200).json(result);
//     } catch (error) {
//         res.status(500).json({ error: "Couldn't resolve the site, " + error.message });
//     }
// };

// export const sitePhiAssign = async (req,res) => {
//     try{
//         const {id} = req.params;
//         const {phi_assign: assigned} = req.body;
//         const result = await assignPhi(id, assigned);
//         res.status(200).json(result);
//     }catch (error){
//         res.status(500).json({error: "Couldn't assign a PHI to site, " + error.message});
//     }
// };