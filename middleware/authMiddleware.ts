import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt';

interface AuthRequest extends Request{
    user?: {
        userName: string,
    }
}
export const authenticate=(req:AuthRequest, res:Response, next:NextFunction)=>{
    try{
        const authHeader=req.headers.authorization;
        if(!authHeader||!authHeader.startsWith('Bearer')){
            return res.status(401).json({message:"Unauthroized Access"});
        }
        const token = authHeader.split(' ')[1];
        const decoded= jwt.verify(token,JWT_SECRET) as {userName: string};
        req.user=decoded;
        next();
    }
    catch(error){
        res.status(401).json({message:"Invalid Token", error:error});
    }
}