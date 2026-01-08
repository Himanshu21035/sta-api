import { Express } from "express";
import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import { Request, Response, NextFunction } from "express";
import { addStudent, getCertifiedStudents, getStudentByRegNum, getStudents, softdeleteStudent, updateStudent } from "../controllers/studentController";

const router=Router();

router.post('/add_student', authenticate, addStudent);
router.get('/get_students', authenticate, getStudents);
router.get('/get_student/:regNum', authenticate, getStudentByRegNum);
router.get('/delete_student', authenticate, softdeleteStudent);
router.put('/update_student', authenticate, updateStudent);
router.get('/get_certified', authenticate, getCertifiedStudents);
router.get('/completed_students', authenticate, getCertifiedStudents);

export default router;