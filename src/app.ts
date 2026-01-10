    require('dotenv').config();
    import { Request, Response } from "express";
    // import { connectDb } from "./config/db";
    import { connectDb } from "./config/db";
    import authRoutes from "./routes/authRoutes";
    import express from "express";
 
    import { authenticate } from "./middleware/authMiddleware";
    import { initScheduler } from "./utils/scheduler";
    import studentRoutes from "./routes/studentRoutes";
    import cors from 'cors';
    import cookieParser = require("cookie-parser");
    import rateLimit from 'express-rate-limit';

    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per windowMs
        message: 'Too many requests from this IP'
    });
    // dotenv.config();


    const app=express();
    app.use(express.json());
    app.use(cookieParser());
    const PORT=process.env.PORT||3000;

    // const app = express();

    // ✅ Production-ready CORS config
    app.use(cors({
    origin: [
        'http://localhost:4200',      // Angular dev
        'http://localhost:3000',      // Vite dev
        'https://saraswatitallyacademy.in'      // Production
    ],
    credentials: true,                // Cookies/auth
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
    }));
    app.use('/api/', limiter);
    app.get('/health',authenticate,(req:Request,res:Response)=>{
        res.send("OK status timestamp: "+ Date.now().toString());
    });
    app.use('/api/auth', authRoutes);
    app.use('/api/students', studentRoutes);
    connectDb().then(()=>{
        initScheduler();
        app.listen(PORT,()=>{
            console.log(`Server is running on port ${PORT}`);
        })
    })


    