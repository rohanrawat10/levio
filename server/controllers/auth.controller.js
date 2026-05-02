import User from "../models/user.models.js";
import genToken from "../utils/token.js";

export const googleAuth = async(req,res)=>{
    try{
       const {name,email} = req.body;
       let user = await User.findOne({email});
           
       if(!user){
    user = await User.create({
        name,
        email
    })
       }
       const token = genToken(user._id);
       res.cookie("token",token,{
        httpOnly:true,
        sameSite:"none",
        secure:true,
        maxAge:7*24*60*60*1000
       })
       res.status(200).json({
        _id:user._id,
        name:user.name,
        email:user.email
       })

    }
    catch(err){
        res.status(500).json({message:"google auth error:",error:err.message})
    }
}

export const signOut = async(req,res)=>{
    try{
        res.clearCookie("token");
        return res.status(200).json({message:"sign out successfully"})
    }
    catch(err){
        res.status(500).json({message:"sign out err",error:err.message})
    }
}