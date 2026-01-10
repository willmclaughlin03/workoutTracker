import { supabase } from "../supabase.js"
import { subDays, startOfDay, endOfDay } from "date-fns"


export const getWeightProgress = async (req, res, next) => {
    try {
        const user_id = req.user.sub;
        const exercise = req.query.exercise || req.body.exercise
        const to = endOfDay(new Date())
        const from = startOfDay(subDays(to, 30));

        
        if (!exercise){
            return res.status(400).json({message : "Exercise is required"})
        }

        const {data, error} = await supabase
        .from("exercise_logs")
        .select("created_at, weight, exercise_name")
        .eq("user_id", user_id)
        .eq("exercise_name", exercise)
        .gte("created_at", from.toISOString())
        .lte("created_at", to.toISOString())
        .order("created_at", {ascending : true}).limit(1000)

        if(error){
            return res.status(400).json({
                message : "Failed to fetch progress",
                details : error.message || error
            })
        }

        res.status(200).json(data)
    } catch (err) {
        next(err)
    }

}



export const getMuscleGroupDist = async (req, res, next) => {
    try {
        const user_id = req.user.sub;
        const to = endOfDay(new Date())
        const from = startOfDay(subDays(to, 30));

        const {data, error} = await supabase
        .from("exercise_logs")
        .select("muscle_group")
        .eq("user_id", user_id)
        .gte("created_at", from.toISOString())
        .lte("created_at", to.toISOString()).limit(1000)

        if(error){
            return res.status(400).json({
                message: "Failed to fetch progress",
                details: error.message || error
            })
        }

        res.status(200).json(data)
        
    } catch (err) {
        next(err)
    }
}