import { errorHandler } from "./middlewares/errorHandler.js";
import express from "express"
import cors from "cors"

import workoutRoutes from "./routes/workoutRoutes.js"
import exerciseLogRoutes from "./routes/exercise_logsRoutes.js"
import progressLogRoutes from "./routes/progressRoutes.js"
import { requireAuth } from "./middlewares/validateAuth.js";


const PORT = process.env.PORT;

const app = express();


app.use(cors())

app.use(express.json())
app.use(errorHandler)
app.use("/api", requireAuth)


app.use("/api/workouts", workoutRoutes)
app.use("/api/exercise_logs", exerciseLogRoutes)
app.use("/api/progress", progressLogRoutes)

app.use((req,res) => {
    res.status(404).json({
        message: `Route ${req.originalUrl} not found`
    })
})



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})


export default app;
