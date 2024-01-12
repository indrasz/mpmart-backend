import express from 'express';
import { register, login, logout } from '../controllers/authController.js'
import { getUserProfile } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/index.js';

const router = express.Router();
const url = process.env.API_URL;

// Route for auth
router.post(`${url}/auth/register`, register);
router.post(`${url}/auth/login`, login);
router.post(`${url}/auth/logout`, logout);

//Route for user
router.get(`${url}/profile`, authenticateToken, getUserProfile);

export default router;