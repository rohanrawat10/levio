import User from "../models/user.models.js";

export const getCurrentUser = async(req,res)=>{
    try{
        const userId = req.userId;
        const user = await User.findById(userId);
        
        if(!user){
            return res.status(404).json({message:"User not found!"});
        }
        res.status(200).json({user});
    }
    catch(err){
        res.status(500).json({message:"get current user error:",error:err.message})
    }
}