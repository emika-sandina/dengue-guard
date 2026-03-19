// back-end for MOH side to see the reported breeding sites
import { getUserSupabase, supabase } from '../supabase.js';
import dotenv from 'dotenv';

//Load Variables
dotenv.config();

// Function to GET data from the table
export const fetchReportSites = async (token) => {
    // to create a user specific client using the token passed from the frontend
    const userSupabase = getUserSupabase(token);

    // using superbase.from() would download every breeding site to the server's memory first.
    // using userSuperbase.from() filters the database for the specific user.
    const {error, data} = await userSupabase.from("breeding_sites").select("*").order("created_at",{ascending:true});

    if (error){
        console.error("Error reading report sites: ", error.message);
        throw new Error(error.message); 
    }
    return data;
}

// Function to GET the moh offciers location
export const fetchMohLocation = async (user) =>{  
    // using userSuperbase.from() filters the database for the specific user.
    const {error,data} = await supabase.from("profiles").select("role,moh_area").eq("id",user.id).maybeSingle();

    if (error){
        console.error("Error reading MOH location: ", error.message);
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