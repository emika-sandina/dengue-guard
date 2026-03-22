import express from "express";
import { exec } from "child_process";
import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';

// Import supabase from backend setup
import { supabase } from '../supabase.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const mlDir = resolve(__dirname, '../../../ML');

// Endpoint to run ML scripts and save to Supabase
router.get("/predict", (req, res) => {
  console.log("Starting weather fetch and ML prediction...");
  // Run weatherFetch.py first
  exec("python scripts/weatherFetch.py", { cwd: mlDir }, (err, stdout, stderr) => {
    if (err) {
      console.error("Error running weatherFetch.py:", stderr);
      return res.status(500).json({ error: "Failed to fetch weather data." });
    }
    console.log("Weather fetch output:", stdout);

    // Run predict.py after weather fetch
    exec("python scripts/predict.py", { cwd: mlDir }, async (err, stdout, stderr) => {
      if (err) {
        console.error("Error running predict.py:", stderr);
        return res.status(500).json({ error: "Failed to run prediction model." });
      }
      console.log("Prediction output:", stdout);

      // Read predictions.json from python output
      const sourceFile = join(mlDir, 'outputs', 'predictions.json');

      try {
        const fileData = fs.readFileSync(sourceFile, 'utf8');
        const predictions = JSON.parse(fileData);
        
        // Prepare array for Supabase upsert
        const upsertData = Object.entries(predictions).map(([moh_area, predicted_cases]) => ({
          moh_area,
          predicted_cases,
          updated_at: new Date().toISOString()
        }));

        // Upsert into Supabase ml_predictions table
        const { error: sbError } = await supabase
          .from('ml_predictions')
          .upsert(upsertData, { onConflict: 'moh_area' });

        if (sbError) {
           console.error("Supabase upsert error:", sbError);
           return res.status(500).json({ error: "Failed to save predictions to database." });
        }

        console.log("Successfully upserted predictions to Supabase ml_predictions table.");
        return res.status(200).json({ message: "Prediction and database update successful", result: stdout });
      } catch (err2) {
        console.error("Error saving predictions:", err2);
        return res.status(500).json({ error: "Failed to process predictions.json." });
      }
    });
  });
});

// Endpoint to fetch latest predictions from Supabase for the frontend Map
router.get("/predictions", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ml_predictions')
      .select('moh_area, predicted_cases');

    if (error) {
       console.error("Error fetching predictions from supabase:", error);
       return res.status(500).json({ error: "Database error" });
    }

    // Convert flat database rows back into the key-value dictionary { "Colombo": 10, ... }
    const formattedData = {};
    if (data) {
       data.forEach(row => {
          formattedData[row.moh_area] = row.predicted_cases;
       });
    }

    return res.status(200).json(formattedData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
