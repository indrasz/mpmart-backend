import { PrismaClient } from '@prisma/client';
import { sendSuccess, sendError } from '../utils/helper.js';

const prisma = new PrismaClient();
const baseUrl = process.env.BASE_URL;

export const getAllPromos = async (req, res) => {
    try {
        const promos = await prisma.promo.findMany();
        const baseImageUrl = `${baseUrl}/storage/`;

        const promosWithImageUrl = promos.map(promo => ({
            ...promo,
            imageUrl: `${baseImageUrl}${promo.thumbnail}`,
        }));

        return sendSuccess(res, 'Promos retrieved successfully', promosWithImageUrl);
    } catch (error) {
        console.error(error);
        return sendError(res, 'Internal Server Error');
    }
};

export const getPromoById = async (req, res) => {
    try {
        const { promoId } = req.params;
        const promo = await prisma.promo.findUnique({ where: { id: promoId } });

        if (!promo) {
            return sendError(res, 'Promo not found', 404);
        }

        return sendSuccess(res, 'Promo retrieved successfully', promo);
    } catch (error) {
        console.error(error);
        return sendError(res, 'Internal Server Error');
    }
};

export const createPromo = async (req, res) => {
    try {
        let { name, description, start_date, end_date } = req.body;
        const thumbnail = req.file.filename;

        start_date = new Date(start_date);
        end_date = new Date(end_date);

        const promo = await prisma.promo.create({
            data: {
                name,
                description,
                thumbnail: thumbnail,
                start_date,
                end_date
            },
        });

        return sendSuccess(res, 'Promo created successfully', promo);
    } catch (error) {
        console.error(error);
        return sendError(res, 'Internal Server Error');
    }
};

export const updatePromo = async (req, res) => {
    try {
        const { promoId } = req.params;
        const { name, description, start_date, end_date } = req.body;
        const existingPromo = await prisma.promo.findUnique({
            where: { id: promoId },
        });

        if (!existingPromo) {
            return sendError(res, 'Promo not found');
        }
        
        start_date = new Date(start_date);
        end_date = new Date(end_date);

        const updatedPromo = await prisma.promo.update({
            where: { id: promoId },
            data: {
                name: name || existingPromo.name,
                description: description || existingPromo.description,
                price: parseInt(price) || existingPromo.price,
                categories: { connect: { id: categoryId } }
            },
        });

        return sendSuccess(res, 'Promo updated successfully', updatedPromo);
    } catch (error) {
        console.error(error);
        return sendError(res, 'Internal Server Error');
    }
};

export const deletePromo = async (req, res) => {
    try {
        const { promoId } = req.params;

        await prisma.promo.delete({ where: { id: promoId } });

        return sendSuccess(res, 'Promo deleted successfully');
    } catch (error) {
        console.error(error);
        return sendError(res, 'Internal Server Error');
    }
};