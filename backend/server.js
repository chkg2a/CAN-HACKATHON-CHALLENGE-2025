import express from "express";
import dotenv from "dotenv";
import connectDb from "./db/connectDb.js";
import session from "express-session";
import { RedisStore } from "connect-redis";
import redis from "./config/redis.js";
import authRouter from "./routes/auth.route.js";
import cors from "cors";
import checkRoute from "./routes/check.route.js";
dotenv.config();



const app=express();
app.use(express.json());
app.use(cors({
    origin:["http://localhost:5173"],
    credentials:true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(session({
    store:new RedisStore({client:redis}),
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    rolling:true,
    cookie:{
        secure:false,
        httpOnly:true,
        maxAge:1000*60*60*24
    }
}));

const PORT=process.env.PORT||5000;
app.get("/",(req,res)=>{
    res.send("API is running...");
})
app.use("/api/v1/auth",authRouter);
app.use("/protection",checkRoute);

app.listen(PORT,async()=>{
    await connectDb();
    console.log(`server is listening at port ${PORT}`);
})



