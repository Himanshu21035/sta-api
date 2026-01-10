import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/jwt";
import { student, Student } from "../models/studentModel";

export const addStudent=async (req:Request, res:Response)=>{
    try{
        const studentData=req.body;
        const isPresent=await Student.findOne({$or:[{regNum:studentData.regNum}, {email:studentData.Email}]});
        if(isPresent){
            return res.status(400).json({message:"Student already present"});
        }
        const student = await Student.create(studentData);
        res.status(201).json({message:"Student added successfully", student:{
        id: student._id,
        name: student.name,
        regNum: student.regNum
      }});

    }
    catch(error){
        res.status(500).json({message:"Internal Server error", error:error});
    }
}

export const getStudents=async (req:Request, res:Response)=>{
    try{
        const students=await Student.find({});
        if(!students){
            return res.status(404).json({message:"No students found"});

        }
        res.status(200).json({students});
    }
    catch(error){
        res.status(500).json({message:"Internal Server Error", error:error});
    }
}
export const getStudentByRegNum= async (req:Request, res:Response)=>{
    try{
        const student = await Student.findOne({regNum:req.params.regNum.toUpperCase(), isDeleted:false});
        if(!student){
            return res.status(404).json({message:"Student not found"});
        }
        return res.status(200).json({student});
    }
    catch(error){
        res.status(500).json({message:"Internal Server Error", error:error});
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
        Object.assign(student, req.body.student);
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
        res.status(200).json({ students});
    }
    catch(err){
        res.status(500).json({message:"internal server error", error:err});
    }
}
export const getDeletedStudents=async(req:Request,res:Response)=>{
    try{
        const students=await Student.find({isDeleted:true});
        res.status(200).json({students});
    }
    catch(err){
        res.status(500).json({message:"Internal Server Error", error:err});
    }
}
export const getCompletedStudents=async(req:Request, res:Response)=>{
    try{
        const students=await Student.find({isCompleted:true, isDeleted:false});
        if(students.length===0){
            return res.status(404).json({message:"No completed students found"});
        }
        res.status(200).json({students});
    }
    catch(err){
        res.status(500).json({message:"internal server error", error:err});
    }
}

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const totalStudents = await Student.countDocuments({isDeleted: false});
        const certifiedStudents = await Student.countDocuments({isDeleted: false, isCertified: true});
        const completedStudent = await Student.countDocuments({isDeleted: false, isCompleted: true});
        const activeStudents = await Student.countDocuments({isDeleted: false, isActive: true});
        
        // ✅ Calculate total fees collected (fees submitted)
        const feesCollectedResult = await Student.aggregate([
            {
                $match: {
                    isDeleted: false,
                    isFeesPending: false  // Only count submitted fees
                }
            },
            {
                $group: {
                    _id: null,
                    totalFees: { $sum: "$Fees" }
                }
            }
        ]);
        
        // ✅ Calculate total pending fees
        const feesPendingResult = await Student.aggregate([
            {
                $match: {
                    isDeleted: false,
                    isFeesPending: true  // Only count pending fees
                }
            },
            {
                $group: {
                    _id: null,
                    totalPending: { $sum: "$Fees" }
                }
            }
        ]);
        
        // ✅ Calculate total revenue (all fees regardless of payment status)
        const totalRevenueResult = await Student.aggregate([
            {
                $match: {
                    isDeleted: false
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$Fees" }
                }
            }
        ]);
        
        const feesCollected = feesCollectedResult.length > 0 ? feesCollectedResult[0].totalFees : 0;
        const feesPending = feesPendingResult.length > 0 ? feesPendingResult[0].totalPending : 0;
        const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].totalRevenue : 0;
        
        res.status(200).json({
            message: "Success",
            stats: {
                total: totalStudents,
                certified: certifiedStudents,
                completed: completedStudent,
                active: activeStudents,
                feesCollected: feesCollected,           // ✅ Fees received
                feesPending: feesPending,               // ✅ Fees pending
                totalRevenue: totalRevenue,             // ✅ Total expected revenue
                studentsWithFeesPending: await Student.countDocuments({isDeleted: false, isFeesPending: true}),
                studentsWithFeesSubmitted: await Student.countDocuments({isDeleted: false, isFeesPending: false})
            }
        });
    } catch(err) {
        res.status(500).json({message: "Internal Server Error", error: err});
    }
}

export const generateRegNum=async(req:Request, res:Response)=>{
    try{
        const numStudents=await Student.countDocuments();
        const regNum=`STA${(numStudents+1).toString().padStart(5,'0')}`;
        res.status(200).json({message:"Success", regNum:regNum});

    }
    catch(err){
        res.status(500).json({message:"Internal Server Error", error:err});
    }
}
export const certifyStudent=async (req:Request, res:Response)=>{
    try{
        const id=req.params.regNum;
        const student=await Student.findOne({regNum:id});
        if(!student){
            return res.status(404).json({message:"student not found"});
        }
        student.isCertified=true;
        await student.save();
        res.status(200).json({message:"successfully updated record"});
    }catch(err){
        res.status(500).json({message:"Internal Server Error", error:err});
    }
}
export const markAsCompleted=async (req:Request, res:Response)=>{
    try{
        const id=req.params.regNum;
        const student=await Student.findOne({regNum:id});
        if(!student){
            return res.status(404).json({message:"student not found"});
        }
        student.isCompleted=true;
        await student.save();
        res.status(200).json({message:"successfully updated record"});
    }catch(err){
        res.status(500).json({message:"Internal Server Error", error:err});
    }
}
export const markAsinactive =async(req:Request,res:Response)=>{
    try{
        const id=req.params.regNum;
        const student=await Student.findOne({regNum:id});
        if(!student){
            return res.status(404).json({message:"student not found"});
        }
        student.isActive=false;
        await student.save();
        res.status(200).json({message:"successfully updated record"});
    }catch(err){
        res.status(500).json({message:"Internal Server Error", error:err});
    }
}
export const markAsActive=async(req:Request,res:Response)=>{
    try{
        const id=req.params.regNum;
        const student=await Student.findOne({regNum:id});
        if(!student){
            return res.status(404).json({message:"student not found"});
        }
        student.isActive=true;
        await student.save();
        res.status(200).json({message:"successfully updated record"});
    }catch(err){
        res.status(500).json({message:"Internal Server Error", error:err});
    }
}
export const MarkAsFeesSubmit=async(req:Request,res:Response)=>{
    try{
        const id=req.params.regNum;
        const student=await Student.findOne({regNum:id});
        if(!student){
            return res.status(404).json({message:"student not found"});
        }
        student.isFeesPending=false;
        await student.save();
        res.status(200).json({message:"successfully updated record"});
    }catch(err){
        res.status(500).json({message:"Internal Server Error", error:err});
    }
}

export const MarkAsUnDeleted=async(req:Request,res:Response)=>{
    try{
        const id=req.params.regNum;
        const student=await Student.findOne({regNum:id});
        if(!student){
            return res.status(404).json({message:"student not found"});
        }
        student.isDeleted=false;
        await student.save();
        res.status(200).json({message:"successfully updated record"});
    }catch(err){
        res.status(500).json({message:"Internal Server Error", error:err});
    }
}
