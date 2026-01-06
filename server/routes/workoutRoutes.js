import express from "express"
import { getAllWorkouts,
    getWorkoutDetail,
    updateWorkout,
    deleteWorkout,
    createWorkout } from "../controllers/workoutController";
import asyncHandler from "express-async-handler"
import {param, body} from 'express-validatior'
import { validateRequest } from "../middlewares/validateRequest";

const router = express.Router();

router.get('/', asyncHandler(getAllWorkouts))

router.get("/:id",
    param('id').isUUID().withMessage("Invalid workout ID"),
    validateRequest,
    asyncHandler(getWorkoutDetail))

router.post("/", 
    body("title").notEmpty().withMessage("Title is a required field!"),
    body("date").isISO8601().withMessage("Date must be valid"),
    validateRequest,
    asyncHandler(createWorkout))

router.put("/:id", 
    param("id").isUUID().withMessage("Invalid workout ID"),
    body("title").notEmpty().withMessage("Title is a required field!"),
    body("date").isISO8601().withMessage("Date must be valid"),
    validateRequest,
    asyncHandler(updateWorkout))


router.delete(":id", 
    param("id").isUUID().withMessage("Invalid workout ID"),
    validateRequest,
    asyncHandler(deleteWorkout))



export default router;