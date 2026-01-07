import express from "express"
import * as workoutController from "../controllers/workoutController";
import asyncHandler from "express-async-handler"
import {param, body} from 'express-validatior'
import { validateRequest } from "../middlewares/validateRequest";

const router = express.Router();

router.get('/', asyncHandler(getAllWorkouts))

router.get("/:id",
    param('id').isUUID().withMessage("Invalid workout ID"),
    validateRequest,
    asyncHandler(workoutController.getWorkoutDetail))

router.post("/", 
    body("title").notEmpty().withMessage("Title is a required field!"),
    body("date").isISO8601().withMessage("Date must be valid"),
    validateRequest,
    asyncHandler(workoutController.createWorkout))

router.put("/:id", 
    param("id").isUUID().withMessage("Invalid workout ID"),
    body("title").notEmpty().withMessage("Title is a required field!"),
    body("date").isISO8601().withMessage("Date must be valid"),
    validateRequest,
    asyncHandler(workoutController.updateWorkout))


router.delete(":id", 
    param("id").isUUID().withMessage("Invalid workout ID"),
    validateRequest,
    asyncHandler(workoutController.deleteWorkout))



export default router;