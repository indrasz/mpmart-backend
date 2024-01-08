import bcrypt from 'bcrypt';
import { createUser, findUserByUsername } from '../models/User.js';
import jwt from 'jsonwebtoken';

async function register(req, res) {
    try {
        const { username, password } = req.body;

        const existingUser = await findUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await createUser({ username, password: hashedPassword });

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function login(req, res) {
    try {
        const { username, password } = req.body;

        const user = await findUserByUsername(username);

        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const accessToken = jwt.sign({ id: user.id, username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ id: user.id, username: user.username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        res.json({ accessToken, refreshToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export { register, login };