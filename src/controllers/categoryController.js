import { PrismaClient } from '@prisma/client';
import { sendSuccess, sendError, sendNotFound, sendBadRequest } from '../utils/helper.js';

const prisma = new PrismaClient();
const baseUrl = process.env.BASE_URL;

export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const iconThumbnail = req.file.filename;

        const category = await prisma.category.create({
            data: {
                name,
                icon_thumbnail: iconThumbnail,
            }
        });

        return sendSuccess(res, 'Category created successfully', category);
    } catch (error) {
        console.error(error);
        return sendError(res, 'Internal Server Error');
    }
};

export const getAllCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany();

        const baseImageUrl = `${baseUrl}/storage/`;

        const categoriesWithImageUrl = categories.map(category => ({
            ...category,
            imageUrl: `${baseImageUrl}${category.icon_thumbnail}`,
        }));

        sendSuccess(res, 'Categories retrieved successfully', categoriesWithImageUrl);
    } catch (error) {
        console.error(error);
        sendError(res, 'Internal Server Error');
    }
};

export const getCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await prisma.category.findUnique({
            where: { id: categoryId },
        });

        if (!category) {
            sendNotFound(res, 'Category not found');
            return;
        }

        sendSuccess(res, 'Category retrieved successfully', category);
    } catch (error) {
        console.error(error);
        sendError(res, 'Internal Server Error');
    }
};

export const updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const { name } = req.body;
        const iconThumbnail = req.file.filename;

        const existingCategory = await prisma.category.findUnique({
            where: { id: categoryId },
        });

        if (!existingCategory) {
            return sendError(res, 'Category not found');
        }

        const updatedCategory = await prisma.category.update({
            where: { id: categoryId },
            data: { name, icon_thumbnail: iconThumbnail, },
        });

        sendSuccess(res, 'Category updated successfully', updatedCategory);
    } catch (error) {
        console.error(error);
        sendError(res, 'Internal Server Error');
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;

        const existingCategory = await prisma.category.findUnique({
            where: { id: categoryId },
        });

        if (!existingCategory) {
            return sendError(res, 'Category not found');
        }

        await prisma.category.delete({
            where: { id: categoryId },
        });

        sendSuccess(res, 'Category deleted successfully');
    } catch (error) {
        console.error(error);
        sendError(res, 'Internal Server Error');
    }
};