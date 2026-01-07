import { errorHandler } from "./middlewares/errorHandler.js";
import express from "express"
import cors from "cors"

import workoutRoutes from "./routes/workoutRoutes.js"
import exerciseLogRoutes from "./routes/exercise_logsRoutes.js"


const app = express();


app.use(cors())

app.use(express.json())

app.use("/api/workouts", workoutRoutes)
app.use("/api", exerciseLogRoutes)

app.use((req,res) => {
    res.statusCode(404).json({
        message: `Route ${req.originalUrl} not found`
    })
})
app.use(errorHandler)

export default app;
