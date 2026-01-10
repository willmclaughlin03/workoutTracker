import { supabase } from "../supabase.js";
const tableName = "exercise_logs";

export const getExerciseLogs = async (req, res, next) => {
    const { workoutID } = req.params;

    try {
        const {data, error} = await supabase.from(tableName)
        .select("*")
        .eq("id", workoutID)
        .single()

        if(error){
            return res.status(400).json({
                message: "Exercise logs cannot be found",
                details: error.message || error
            })
        }

        res.status(200).json(data)
    } catch (err) {
        next(err)
    }
}


export const createExerciseLogs = async (req, res, next) => {
    const { workoutID } = req.params;
    try {
        const {data, error} = await supabase.from(tableName)
        .insert({
            workout_id: workoutID,
            exercise_name: req.body.exercise_name,
            sets: req.body.sets,
            reps: req.body.reps,
            weight: req.body.weight,
            muscle_group: req.body.muscle_group
        }).select();

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