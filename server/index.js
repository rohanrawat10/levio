import express from "express";
import dotenv from "dotenv";
import http, { Server } from "http";
import cookieParser from "cookie-parser";
dotenv.config();
import connectDb from "./config/db.js";
const app = express();
const server = http.createServer(app)
const port = process.env.PORT || 4000;
app.use(express.json());
app.use(cookieParser())
app.get("/",(req,res)=>{
    res.send(`<p>Hey this is rohan</p>`)
})
// console.log("PORT from env:", process.env.PORT);
server.listen(port,()=>{
    connectDb()
    console.log(`Server running on port ${port}`)
})