import { Router } from 'express';
const router = Router();
import { login, registerUser, registerSchool } from '../controllers/auth.controller.js';

router.post('/login', login);
router.post('/register/user', registerUser);
router.post('/register/school', registerSchool);

export default router;