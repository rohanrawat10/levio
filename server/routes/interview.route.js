import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import { analyzeResume } from "../controllers/interview.controller.js";
const interviewRoute = express.Router();

interviewRoute.post("/resume",isAuth,upload.single("resume"),analyzeResume);;


export default interviewRoute;