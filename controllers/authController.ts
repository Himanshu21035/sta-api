import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/jwt";
import { User } from "../models/user";

export const register=async(req:Request,res:Response)=>{
    try{
        const{userName, Password}=req.body;
        const existinguser=await User.findOne({userName});
        if(existinguser){
            return  res.status(400).json({message:"user already exists"});
        }

        const user= await User.create({userName, Password});

        const token= jwt.sign({id:user._id, userName:user.userName}, JWT_SECRET, {expiresIn:"48h"});

        res.status(201).json({message:"user registered successfully", token: token});
    }
    catch(error){
        res.status(500).json({message:"Internal Server Error", error: error});
    }
}
export const login=async(req:Request, res:Response)=>{
    try{
        const {userName,Password}=req.body;
        const user= await User.findOne({userName});
        if(!user){
            res.status(400).json({message:"UserNot Found"});
        }
        const isPassMatch= await user?.comparePass(Password);
        if(!isPassMatch){
            res.status(400).json({message:"Invalid Credentials"});
        }
        const token = jwt.sign({id:user?._id,userName:user?.userName},JWT_SECRET,{expiresIn:'48h'});
        res.status(200).json({message:"Login Sucessful", token: token})

    }catch(error){
        res.status(500).json({message:"Internal Server Error", error:error});
    }
};