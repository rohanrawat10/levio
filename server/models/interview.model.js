import mongoose from "mongoose";
const resumeSchema = new mongoose.Schema({

},{timestamps:true})

const Resume = mongoose.model("Resume",userSchema);
export default Resume