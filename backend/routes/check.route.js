import express from 'express';
import { check } from '../controllers/check.contoller.js';
import { protect } from '../middlewares/authMiddleware.js';
import { adminOnly } from '../middlewares/authMiddleware.js';
import { userDetails } from '../middlewares/userDetails.js';

const checkRoute=express.Router();


checkRoute.get("/check",protect,adminOnly,userDetails,check);

export default checkRoute;