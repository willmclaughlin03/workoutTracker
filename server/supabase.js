import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabase_url = process.env.SUPABASE_URL;
const supabase_key = process.env.SUPABASE_KEY;
const PORT = process.env.PORT || 5000;


if (!supabase_key || !supabase_url){
    throw new Error("Improper Supabase Key or URL found");
}


export const supabase = createClient(supabase_url,supabase_key,)