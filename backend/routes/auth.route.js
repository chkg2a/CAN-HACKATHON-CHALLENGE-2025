import express from 'express';
import { login,register,logout,checkAuth } from '../controllers/auth.controller.js';


const authRouter=express.Router();

authRouter.post("/register",register);
authRouter.post("/login",login);
authRouter.post("/logout",logout);
authRouter.get("/checkAuth",checkAuth);

export default authRouter;