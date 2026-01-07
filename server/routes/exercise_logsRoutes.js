import express from "express"
import {
    createExerciseLogs,
    updateExerciseLogs,
    deleteExerciseLog
} from "../controllers/exercise_logsController"
import asyncHandler from "express-async-handler"
import {param, body} from "express-validator"
import { validateRequest } from "../middlewares/validateRequest"

const router = express.Router();

router.post(
    "/workouts/:workoutId/logs",
    param("workoutId").isUUID().withMessage("Invalid workout ID"),
    body("sets").isInt({ min: 1 }).withMessage("Set number must be positive"),
    body("reps").isInt( {min: 1}).withMessage("Set number must be positive"),
    body("weight").isNumeric().withMessage("Weight has to be a number"),
    asyncHandler(createExerciseLogs)
)

router.patch(
    "/logs/:id",
    param("id").isUUID().withMessage("Invalid Log ID"),
    body("sets").optional().isInt({min : 1}),
    body("reps").optional().isInt({min: 1}),
    body("weight").optional().inNumeric(),
    asyncHandler(updateExerciseLogs)
)

router.delete(
    "/logs/:id",
    param("id").isUUID().withMessage("Invalid Log ID"),
    asyncHandler(deleteExerciseLog)
)

export default router;