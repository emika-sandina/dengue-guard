import { supabase } from './src/supabase.js';

async function run() {
    console.log("Starting check...");
    const { data, error, count } = await supabase
        .from('dengue_cases')
        .select('*', { count: 'exact' });
    
    if (error) {
        console.error("SUPABASE ERROR:", error);
    } else {
        console.log("Count from Supabase:", count);
        console.log("Data:", JSON.stringify(data, null, 2));
    }
    process.exit(0);
}

run().catch(err => {
    console.error("RUN ERROR:", err);
    process.exit(1);
});
