import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabase_key = process.env.SUPABASE_KEY;
const supabase_url = process.env.SUPABASE_URL;
const PORT = process.env.PORT || 5000;

if (!supabase_key || !supabase_url){
    throw new Error("Improper Supabase Key or URL found");
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

export const supabase = createClient(supabase_key,supabase_url)