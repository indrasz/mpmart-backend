import jwt from 'jsonwebtoken';
import { sendUnauthorized } from '../utils/helper.js';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        console.log('No token provided');
        return sendUnauthorized(res, 'Access denied, no token provided');
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
        if (err) {
            console.log('Invalid token:', err.message);
            return sendUnauthorized(res, 'Invalid token');
        }
        req.user = decode;
        console.log('Token verified successfully');
        next();
    });
};
