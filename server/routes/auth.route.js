import express from "express";
import { googleAuth, signOut } from "../controllers/auth.controller.js";
const authRouter = express.Router();

authRouter.post("/google-auth",googleAuth)
authRouter.get("/signOut",signOut)
export default authRouter;