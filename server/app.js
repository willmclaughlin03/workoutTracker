import { errorHandler } from "./middlewares/errorHandler.js";
import express from "express"
import cors from "cors"
import rateLimit from 'express-rate-limiter'
import workoutRoutes from "./routes/workoutRoutes.js"
import exerciseLogRoutes from "./routes/exercise_logsRoutes.js"
import progressLogRoutes from "./routes/progressRoutes.js"
import { requireAuth } from "./middlewares/validateAuth.js";


const PORT = process.env.PORT;

const app = express();


app.use(cors(({
    origin: process.env.NOD
})))


// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
})

// Stricter limiter for auth operations (if you add login endpoints)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts per 15 minutes
  skipSuccessfulRequests: true,
})

app.use(express.json())
app.use(errorHandler)
app.use("/api", requireAuth, apiLimiter)


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
