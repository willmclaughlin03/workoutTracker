import express from "express"
import * as progressController from "../controllers/progressController.js"
import asyncHandler from "express-async-handler"
import { validateRequest } from "../middlewares/validateRequest.js"
import {param, body} from "express-validator"
import {apiLimiter} from "../middlewares/express-rate-limit.js"

const router = express.Router();

router.get("/progress/weight", 
    apiLimiter,
    validateRequest,
    asyncHandler(progressController.getWeightProgress)
)

router.get("/progress/muscle-groups", 
    validateRequest,
    asyncHandler(progressController.getMuscleGroupDist)
)




export default router;