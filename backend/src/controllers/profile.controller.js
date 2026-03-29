import { supabase } from "../supabase.js";

// handle GET request to fetch user profile
export const getProfile = async (req, res) => {
    try {
        // extract user ID from the verified request
        const userId = req.user.id; 
        
        // query Supabase for specific profile fields targeting the user
        const { data, error } = await supabase
            .from("profiles")
            .select("full_name, role, moh_area")
            .eq("id", userId)
            .single();

        // catch database errors immediately
        if (error) throw error;
        
        // return 200 OK with the retrieved data
        return res.status(200).json(data);
    } catch (error) {
        // return 500 error on failure
        return res.status(500).json({ error: error.message });
    }
};

// handle PUT request to modify user profile details
export const updateProfile = async (req, res) => {
    try {
        // extract user ID securely from middleware
        const userId = req.user.id;
        
        // structure incoming body parameters
        const { fullName, mohArea } = req.body;

        // update the matching profile record and return the new data
        const { data, error } = await supabase
            .from("profiles")
            .update({
                full_name: fullName,
                moh_area: mohArea
            })
            .eq("id", userId)
            .select()
            .single();

        // throw error if update fails
        if (error) throw error;
        
        // send updated data configuration back to client
        return res.status(200).json({ message: "Profile updated", data });
    } catch (error) {
        // return 500 error on failure
        return res.status(500).json({ error: error.message });
    }
};