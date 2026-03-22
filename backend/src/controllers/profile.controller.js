import { supabase } from "../supabase.js";

export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id; 
        const { data, error } = await supabase
            .from("profiles")
            .select("full_name, role, moh_area")
            .eq("id", userId)
            .single();

        if (error) throw error;
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { fullName, mohArea } = req.body;

        const { data, error } = await supabase
            .from("profiles")
            .update({
                full_name: fullName,
                moh_area: mohArea
            })
            .eq("id", userId)
            .select()
            .single();

        if (error) throw error;
        return res.status(200).json({ message: "Profile updated", data });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};