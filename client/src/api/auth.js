import { supabase } from "../utils/supabaseClient";


export const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
        email, password
    });
    if (error) throw error;
    return data;
}

export const signIn = async (email, password) => {
    const { data, error} = await supabase.auth.signInWithPassword({
        email, password
    });
    if (error) throw error;
    return data.session;
}

export const signOut = async () =>{
    await supabase.auth.signOut();
}