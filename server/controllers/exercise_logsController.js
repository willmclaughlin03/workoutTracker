import { supabase } from "../supabase.js";
const tableName = "exercise_logs";

export const createExerciseLogs = async (req, res, next) => {
    try {
        const {data, error} = await supabase.from(tableName)
        .insert(req.body).select();

        if(error){
            return res.status(400).json({
                message : "Failed to create exercise log",
                details : error.message || error
            })
        }

        res.status(201).json(data[0])

    } catch (err) {
        next(err)
    }
}

export const updateExerciseLogs = async(req,res,next) => {
    const {id} = req.params;
    try{
        const {data,error} = await supabase
        .from(tableName)
        .update(req.body)
        .eq("id", id)
        .select()

        if(error){
            return res.status(400).json({
                message: "Exercise log update failed",
                details: error.mesage || error
            })
        }

        if(!data || data.length === 0){
            return res.status(400).json({ message : "No log found!"})
        }

        res.status(200).json(data[0])
    }catch(err){
        next(err)
    }
}

export const deleteExerciseLog = async (req,res,next) => {
    const {id} = req.params

    try {
        const { data, error } = await supabase.from(tableName)
        .delete()
        .eq("id", id)

        if(error){
            return res.status(400).json({
                message : "Failed to delete exercise log",
                details: error.message || error
            })
        }

        if(!data || data.length === 0){
            return res.status(400).json({ message : "No log found!"})
        }
        res.status(200).json({message: "Log deleted"})
    }catch(err){
        next(err)
    }
};