import mongoose from "mongoose";
import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import redis from "../config/redis.js";

export const register=async(req,res)=>{
    const {email,password,name}=req.body;
    if(!email||!password||!name){
        return res.status(400).json({message:"All fields are required"});
    }
    try {
        const user=await User.findOne({email});
        if(user){
            return res.status(400).json({message:"User already exists"});
        }
        const hashedPassword=await bcrypt.hash(password,12);
        const newUser=new User({email,password:hashedPassword,name});
        await newUser.save();
        return res.status(201).json({message:"User created successfully"});
    } catch (error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({message:"Internal server error"});
    }

}

export const login=async(req,res)=>{
    
    const {email,password}=req.body;
    
    if(!email||!password){
        
        return res.status(400).json({message:"All fields are required"});
    }
    try {
        const user=await User.findOne({email});
        if(!user){
            
            return res.status(400).json({message:"Invalid credentials"});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            
            return res.status(400).json({message:"Invalid credentials"});
        }
        req.session.user={id:user._id,role:user.role};
        await redis.setex(`session:${user._id}`,86400,JSON.stringify(req.session.user));
        return res.status(200).json({message:"Login successful"});
    } catch (error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({message:"Internal server error"});
    }
}
export const logout =async(req,res)=>{
    try {
        if(req.session.user){
            await redis.del(`session:${req.session.user.id}`);
            req.session.destroy();
            return res.status(200).json({message:"Logout successful"});
        }
        return res.status(400).json({message:"User not logged in"});
    } catch (error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({message:"Internal server error"});
    }
}

export const checkAuth=async(req,res)=>{
    
    try {
        if(!req.session.user){
            return res.status(401).json({message:"Not Logged in"});
        }
        const user=await User.findById(req.session.user.id);
        if(!user){
            return res.status(401).json({message:"User not found"});
        }

        res.json({user:req.session.user,role:user.role,name:user.name,email:user.email});
    } catch (error) {
        
    }
}
