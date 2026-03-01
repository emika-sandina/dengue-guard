// back-end for MOH side to see the reported breeding sites
import { supabase } from '../supabase.js';
import dotenv from 'dotenv';

//Load Variables
dotenv.config();

// Function to GET data from the table
export const fetchReportSites = async () => {
    const {error, data} = await supabase.from("breeding_sites").select("*").order("created_at",{ascending:true});

    if (error){
        console.error("Error reading report sites: ", error.message);
        throw new Error(error.message);
    }
    return data;
}
