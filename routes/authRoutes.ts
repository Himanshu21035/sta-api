import { Router } from "express";
import { register, login, logout } from "../controllers/authController";
import { authenticate } from "../middleware/authMiddleware";

const router=Router();
// router.use(authenticate);
router.post('/register', register);
router.post('/login',login);
router.get('/validate', authenticate, (req, res) => {
  res.json({ valid: true });
});
router.post('/logout',authenticate,logout)

export default router;