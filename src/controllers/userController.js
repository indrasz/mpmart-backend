import { findUserById, updateUserById } from '../models/User.js';
import {  sendSuccess, sendError } from '../utils/helper.js';

export const getUserProfile = async (req, res) => {
    try {
        const id = req.user.id;
        const user = await findUserById(id);

        if (!user) {
            return sendError(res, 'User not found', 404);
        }

        return sendSuccess(res, 'User profile retrieved successfully', { user });
    } catch (error) {
        console.error(error);
        return sendError(res, 'Internal Server Error');
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const { id } = req.params; 
        const { username, email, place_of_birth, date_of_birth, phone_number, is_male, userId } = req.body;

        const existingUser = await findUserById(id);

        // console.log(existingUser);

        if (!existingUser) {
            return sendError(res, 'User not found');
        }

        const updatedUser = await updateUserById(id, {
            username: username || existingUser.username,
            userId: userId || existingUser.userId,
            email: email || existingUser.email,
            place_of_birth: place_of_birth || existingUser.place_of_birth,
            date_of_birth: date_of_birth || existingUser.date_of_birth,
            phone_number: phone_number || existingUser.phone_number,
            is_male: is_male || existingUser.is_male,
        });

        return sendSuccess(res, 'User profile updated successfully', { user: updatedUser });
    } catch (error) {
        console.error(error);
        return sendError(res, 'Internal Server Error');
    }
}