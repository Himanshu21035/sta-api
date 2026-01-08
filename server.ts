import { Request, Response } from "express";
// import { connectDb } from "./config/db";
import { connectDb } from "./config/db";
import authRoutes from "./routes/authRoutes";
import express from "express";
import dotenv from "dotenv";
import { authenticate } from "./middleware/authMiddleware";
import { initScheduler } from "./utils/scheduler";
import studentRoutes from "./routes/studentRoutes";
dotenv.config();

const app=express();
app.use(express.json());
const PORT=process.env.PORT||3000;

app.get('/health',authenticate,(req:Request,res:Response)=>{
    res.send("OK status timestamp: "+ Date.now().toString());
});
app.use('/api/auth', authRoutes);
app.use('api/students', studentRoutes);
connectDb().then(()=>{
    initScheduler();
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);
    })
})
