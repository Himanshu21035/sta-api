import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/jwt";
import { Student } from "../models/studentModel";

export const addStudent=async (req:Request, res:Response)=>{
    try{
        const studentData=req.body;
        const isPresent=await Student.findOne({regNum:studentData.regNum});
        if(isPresent){
            return res.status(400).json({message:"Student already present"});
        }
        const student = await Student.create(studentData);
        res.status(201).json({message:"Student added successfully", student:student});

    }
    catch(error){
        res.status(500).json({message:"Internal Server error", error:error});
    }
}

export const getStudents=async (req:Request, res:Response)=>{
    try{
        const students=await Student.find({isDeleted:false});
        if(!students){
            return res.status(404).json({message:"No students found"});

        }
        res.status(200).json({message:"Success",students:students});
    }
    catch(error){
        res.status(500).json({message:"Internal Server Error", error:error});
    }
}
export const getStudentByRegNum= async (req:Request, res:Response)=>{
    try{
        const student = await Student.findOne({regNum:req.params.regNum, isDeleted:false});
        if(!student){
            return res.status(404).json({message:"Student not found"});
        }
        return res.status(200).json({message:"success", student:student});
    }
    catch(error){
        res.status(500).json({message:"Internal Server Error", err:error});
    }
}
export const softdeleteStudent=async (req:Request, res:Response)=>{
    try{
        const student=await Student.findOne({regNum:req.body.regNum});
        if(!student){
            return res.status(404).json({message:"student not found"});
        }
        student.isDeleted=true;
        await student.save();
        res.status(200).json({message:"successfully deleted"});

    }   
    catch(err){
        res.status(500).json({message:"Internal Server Error", error:err});
    }
}
export const updateStudent=async (req:Request, res:Response)=>{
    try{
        const student=await Student.findOne({regNum:req.body.regNum});
        if(!student){
            return res.status(404).json({message:"student not found"});
        }
        Object.assign(student, req.body);
        await student.save();
        res.status(200).json({message:"student updated successfully", student:student});
    }
    catch(err){
        res.status(500).json({message:"internal server error", error:err});
    }
}
export const getCertifiedStudents=async (req:Request, res:Response)=>{
    try{
        const students=await Student.find({isCertified:true, isDeleted:false, isCompleted:true});
        if(students.length===0){
            return res.status(404).json({message:"No certified students found"});
        }
        res.status(200).json({message:"Success", students:students});
    }
    catch(err){
        res.status(500).json({message:"internal server error", error:err});
    }
}
export const getCompletedStudents=async(req:Request, res:Response)=>{
    try{
        const students=await Student.find({isCompleted:true, isDeleted:false});
        if(students.length===0){
            return res.status(404).json({message:"No completed students found"});
        }
        res.status(200).json({message:"Success",students:students});
    }
    catch(err){
        res.status(500).json({message:"internal server error", error:err});
    }
}

