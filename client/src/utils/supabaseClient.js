import { createClient } from "@supabase/supabase-js"
import "dotenv/config";

const supabase_url = process.env.SUPABASE_URL;
const supabase_front_key = process.env.SUPABASE_ANON_KEY;

if (!supabase_front_key || !supabase_url){
    throw new Error("Improper Supabase Key or URL found");
}

export const supabase = createClient(supabase_url,supabase_front_key, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
})