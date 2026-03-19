import jwt from "jsonwebtoken";
import { supabase } from "../supabase.js";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // 1. Sign in with Supabase
    const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      return res.status(401).json({ error: signInError.message });
    }

    // 2. Fetch profile for role and moh_area
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, moh_area")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
    }

    const role = profile?.role || "citizen";
    const mohArea = profile?.moh_area || user.user_metadata?.moh_area || null;

    // 3. Generate JWT
    if (!JWT_SECRET) {
      console.error("Server configuration error: JWT_SECRET environment variable is not set.");
      return res
        .status(500)
        .json({ error: "Server configuration error: JWT secret is not configured" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: role,
        mohArea: mohArea,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: role,
        mohArea: mohArea,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
