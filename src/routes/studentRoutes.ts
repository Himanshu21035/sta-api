import { Express } from "express";
import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import { Request, Response, NextFunction } from "express";
import { addStudent, certifyStudent, generateRegNum, getCertifiedStudents, getDashboardStats, getDeletedStudents, getStudentByRegNum, getStudents, markAsActive, markAsCompleted, MarkAsFeesSubmit, markAsinactive, MarkAsUnDeleted, softdeleteStudent, updateStudent } from "../controllers/studentController";

const router=Router();
router.use(authenticate)
router.post('/add_student', authenticate, addStudent);
router.get('/get_students', authenticate, getStudents);
router.get('/get_student/:regNum', authenticate, getStudentByRegNum);
router.put('/delete_student', authenticate, softdeleteStudent);
router.put('/update_student', authenticate, updateStudent);
router.get('/get_certified', authenticate, getCertifiedStudents);
router.get('/completed_students', authenticate, getCertifiedStudents);
router.get('/dashboard', authenticate, getDashboardStats);
router.get('/regNum', authenticate, generateRegNum);
router.put('/certify/:regNum',authenticate,certifyStudent);
router.put('/completed/:regNum', authenticate,markAsCompleted);
router.put('/inactive/:regNum', authenticate, markAsinactive);
router.put('/active/:regNum', authenticate, markAsActive);
router.put('/feeSubmit/:regNum',authenticate, MarkAsFeesSubmit);
router.get('/get_deleted',authenticate,getDeletedStudents);
router.put('/markUndeleted/:regNum', authenticate,MarkAsUnDeleted);

export default router;
