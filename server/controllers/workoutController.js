import {supabase} from "../supabase.js"
const tableName = "workouts"

export const createWorkout = async (req, res, next) => {
        try {
            const {data, error} = await supabase
            .from(tableName).insert(req.body)
            .select();

            if(error){
                return res.status(400).json({
                    message: "Failed to create workout",
                    details: error.message || error
                })
            }

            res.status(201).json(data[0])
        } catch (err) {
            next(err)
        }
    }

  export const getAllWorkouts = async(req, res, next) => {
        try {
            const {data,error} = await supabase.from(tableName)
            .select()
            
            if(error){
                return res.status(400).json({
                    message : "Could not retrieve all workouts",
                    details: error.message || error
                })
            }


            res.status(200).json(data)
        } catch (err) {
            next(err)
        }
    }

export const getWorkoutDetail = async(req, res, next) => {
        const { id } = req.params;
        try {
            const {data, error} = await supabase.from(tableName)
            .select("*, exercise_logs(*)")
            .eq('id', id)
            .single();
            
            if(error){
                return res.status(400).json({ 
                    message: "Workout not found",
                    details: error.message || error
                })
            }

            res.status(200).json(data)
        } catch (err) {
            next(err)
        }
    } 

export const updateWorkout = async(req, res, next) => {
        const {id} = req.params;
        try {
            const {data, error} = await supabase
            .from(tableName)
            .update(req.body)
            .eq("id", id)
            .select()
        
            if(error){
                return res.status(400).json({
                    message: "Workout update failed",
                    details: error.message || error
                })
            }

            if(!data || data.length === 0){
                return res.status(404).json({ message: "No workout found"});
            }

            res.status(200).json(data[0]);
        } catch (err) {
            next(err)
        }
    };

export const deleteWorkout = async (req, res, next) => {
        const { id } = req.params;

        try {
            const {data, error} = await supabase
            .from(tableName)
            .delete()
            .eq("id", id)

            if(error){
                return res.status(400).json({
                    message: "Failed to delete workout",
                    details: error.message || error
                });
            }

            if(!data || data.length === 0){
                return res.status(404).json({ message: "No workout found"});
            }

            res.status(200).json({message: "workout deleted", deleted: data[0]})
        }catch(err){
            next(err)
        }
};
