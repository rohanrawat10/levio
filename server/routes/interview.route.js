import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import { analyzeResume, finishInterview, genrateQuestions, submitAnswer } from "../controllers/interview.controller.js";
const interviewRoute = express.Router();

interviewRoute.post("/resume",isAuth,upload.single("resume"),analyzeResume);;
interviewRoute.post("/generate-questions",isAuth,genrateQuestions);
interviewRoute.post("/submit-answer",isAuth,submitAnswer);
interviewRoute.post("finish-interview",isAuth,finishInterview);

export default interviewRoute;