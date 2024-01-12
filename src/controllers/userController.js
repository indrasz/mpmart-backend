import { findUserById } from '../models/User.js';
import {  sendSuccess, sendError } from '../utils/helper.js';

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await findUserById(userId);

        if (!user) {
            return sendError(res, 'User not found', 404);
        }

        return sendSuccess(res, 'User profile retrieved successfully', { user });
    } catch (error) {
        console.error(error);
        return sendError(res, 'Internal Server Error');
    }
};