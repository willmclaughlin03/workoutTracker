import express from "express"
import * as exercise_logsController from "../controllers/exercise_logsController"
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
    validateRequest,
    asyncHandler(exercise_logsController.createExerciseLogs)
)

router.patch(
    "/logs/:id",
    param("id").isUUID().withMessage("Invalid Log ID"),
    body("sets").optional().isInt({min : 1}),
    body("reps").optional().isInt({min: 1}),
    body("weight").optional().inNumeric(),
    validateRequest,
    asyncHandler(exercise_logsController.updateExerciseLogs)
)

router.delete(
    "/logs/:id",
    param("id").isUUID().withMessage("Invalid Log ID"),
    validateRequest,
    asyncHandler(exercise_logsController.deleteExerciseLog)
)

export default router;