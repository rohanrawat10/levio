import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http, { Server } from "http";
import cookieParser from "cookie-parser";
dotenv.config();
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
const app = express();
const server = http.createServer(app)
const port = process.env.PORT || 4000;

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
    methods:["GET","POST","PUT","PATCH","DELETE"]
}))
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);
// console.log("PORT from env:", process.env.PORT);
server.listen(port,()=>{
    connectDb()
    console.log(`Server running on port ${port}`)
})