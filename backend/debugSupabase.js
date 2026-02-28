import { supabase } from './src/supabase.js';
import fs from 'fs';

async function run() {
    let output = "Log Start\n";
    try {
        const { data, error } = await supabase.from('dengue_cases').select('*').limit(5);
        if (error) {
            output += "Error: " + JSON.stringify(error) + "\n";
        } else {
            output += "Success! Row count: " + data.length + "\n";
            output += "Columns in first row: " + (data.length > 0 ? Object.keys(data[0]).join(', ') : 'N/A') + "\n";
            output += "Data: " + JSON.stringify(data, null, 2) + "\n";
        }
    } catch (e) {
        output += "Catch Error: " + e.message + "\n";
    }
    fs.writeFileSync('debug_supabase.txt', output);
    process.exit(0);
}

run();
