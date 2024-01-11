import express from 'express';
import { register, login } from '../controllers/authController.js'

const router = express.Router();

router.post('/mp-mart/api/v1/auth/register', register);
router.post('/mp-mart/api/v1/auth/login', login);

export default router;