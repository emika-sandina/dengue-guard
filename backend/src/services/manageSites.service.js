// back-end for MOH side to see the reported breeding sites
import { supabase } from '../supabase.js';
import dotenv from 'dotenv';

//Load Variables
dotenv.config();

// Function to GET data from the table
export const fetchReportSites = async () => {
    // // using supabase.from() to select sites from the database for the specific user.
    const {error, data} = await supabase.from("breeding_sites").select("*").order("created_at",{ascending:true});

    if (error){
        console.error("Error reading report sites: ", error.message);
        throw new Error(error.message); 
    }
    return data;
}

// Function to delete breeding site from supabase
export const deleteSites = async (siteId)  =>{
    // if the id in supabase is equal to the siteId then delete
    const {error} = await supabase.from("breeding_sites").delete().eq("id",siteId)

    if (error){
        throw new Error(error.message); 
    }
    return {success :true}
}

// Function to verify breeding site from supabase
export const verifySites = async (siteId,newStatus) => {
    // if the id in supabase is equal to the siteId then delete
    const {error} = await supabase.from("breeding_sites").update({status: newStatus}).eq("id",siteId)

    if (error){
        throw new Error(error.message); 
    }
    return {success :true}
}

// Function to assign a PHI to a breeding site case
export const assignPhi = async (siteId,assigned) => {
    const {error} = await supabase.from("breeding_sites").update({phi_assign: assigned}).eq("id",siteId)

    if (error){
        throw new Error(error.message); 
    }
    return {success :true}
}