import User from "../model/user.model.js";


export const userDetails=async(req,res,next)=>{
    const id=req.session.user.id;
    const user=await User.findById(id);
    if(!user){
        return res.status(401).json({message:"User not found"});
    }
    req.user=user;
    next();
}