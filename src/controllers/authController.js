import bcrypt from 'bcrypt';
import { createUser, findUserByUsername, findUserByEmail, findUserByNim } from '../models/User.js';
import { sendUnauthorized, sendSuccess, sendError, sendBadRequest } from '../utils/helper.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { username, nim, email, password, place_of_birth, date_of_birth, phone_number, is_male } = req.body;

        const existingUser = await findUserByUsername(username);
        if (existingUser) {
            return sendBadRequest(res, 'Username is already taken');
        }

        const existingEmail = await findUserByEmail(email);
        if (existingEmail) {
            return sendBadRequest(res, 'Email is already taken');
        }

        const existingNim = await findUserByNim(nim);
        if (existingNim) {
            return sendBadRequest(res, 'NIM is already taken');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await createUser({
            username,
            email,
            phone_number,
            password: hashedPassword,
        });

        return sendSuccess(res, 'User registered successfully', { user });
    } catch (error) {
        console.error(error);
        return sendError(res, 'Internal Server Error');
    }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await findUserByUsername(username);

        if (!user) {
            return sendUnauthorized(res, 'Invalid username or password');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const accessToken = jwt.sign({ id: user.id, username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ id: user.id, username: user.username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        const userData = {
            id: user.id,
            username: user.username,
            email: user.email,  
        };

        return sendSuccess(res, 'Login successfully', { accessToken, refreshToken, user: userData });
    } catch (error) {
        console.error(error);
        return sendError(res, 'Internal Server Error');
    }
}

export const logout = (req, res) => {
    const token = req.header('Authorization') || req.cookies.accessToken;

    if (!token) {
        return sendUnauthorized(res, 'No token provided');
    }

    try {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        return sendSuccess(res, 'Logout successfully');
    } catch (error) {
        console.error(error);
        return sendError(res, 'Internal Server Error');
    }
};

// export { register, login };