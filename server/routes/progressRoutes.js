import express from "express"
import * as progressController from "../controllers/progressController.js"
import asyncHandler from "express-async-handler"
import { validateRequest } from "../middlewares/validateRequest.js"
import {param, body} from "express-validator"

const router = express.Router();

router.get("/progress/weight", 
    validateRequest,
    asyncHandler(progressController.getWeightProgress)
)

router.get("/progress/muscle-groups", 
    validateRequest,
    asyncHandler(progressController.getMuscleGroupDist)
)




export default router;