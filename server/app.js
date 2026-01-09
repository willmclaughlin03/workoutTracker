import { errorHandler } from "./middlewares/errorHandler.js";
import express from "express"
import cors from "cors"

import workoutRoutes from "./routes/workoutRoutes.js"
import exerciseLogRoutes from "./routes/exercise_logsRoutes.js"

const PORT = process.env.PORT;

const app = express();


app.use(cors())

app.use(express.json())

app.use("/api/workouts", workoutRoutes)
app.use("/api", exerciseLogRoutes)

app.use((req,res) => {
    res.status(404).json({
        message: `Route ${req.originalUrl} not found`
    })
})
app.use(errorHandler)


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})


export default app;
