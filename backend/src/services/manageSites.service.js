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
export const fetchMohLocation = async (token) =>{   
    // safety check to ensure that the token is vaild
    const {error: authError, data: {user}} = await supabase.auth.getUser(token);
    if (authError || !user){
        throw new Error(authError.message || "No user found");
    }

    // to create a user specific client using the token passed from the frontend
    const userSupabase = getUserSupabase(token);
    
    // using userSuperbase.from() filters the database for the specific user.
    const {error,data} = await userSupabase.from("profiles").select("role,moh_area").eq("id",user.id).maybeSingle();

    if (error){
        console.error("Error reading MOH location: ", error.message);
        throw new Error(error.message);
    }
    return data;
}