import redis from "../config/redis.js";
import User from "../model/user.model.js";
export const protect=async(req,res,next)=>{
    if(!req.session.user){
        return res.status(401).json({message:"Unauthorized"});
    }
    const sessionData=await redis.get(`session:${req.session.user.id}`);
    if(!sessionData){
        return res.status(401).json({message:"session expired"});
    }

    req.user=JSON.parse(sessionData);
    next();

}


export const adminOnly=(req,res,next)=>{
    console.log(req.user.role);
    if(req.user.role!=="admin"){
        return res.status(403).json({message:"Admin access only"});
    }
    next();
}