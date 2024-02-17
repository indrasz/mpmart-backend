import { PrismaClient } from '@prisma/client';
import { sendSuccess, sendError } from '../utils/helper.js';

const prisma = new PrismaClient();
const baseUrl = process.env.BASE_URL;

export const getAllProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany();
        const baseImageUrl = `${baseUrl}/storage/`;

        const productsWithImageUrl = products.map(product => ({
            ...product,
            imageUrl: `${baseImageUrl}${product.thumbnail}`,
        }));

        return sendSuccess(res, 'Products retrieved successfully', productsWithImageUrl);
    } catch (error) {
        console.error(error);
        return sendError(res, 'Internal Server Error');
    }
};
export const getProductById = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await prisma.product.findUnique({ where: { id: productId } });

        if (!product) {
            return sendError(res, 'Product not found', 404);
        }

        return sendSuccess(res, 'Product retrieved successfully', product);
    } catch (error) {
        console.error(error);
        return sendError(res, 'Internal Server Error');
    }
};

export const getProductByCategoryId = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const products = await prisma.product.findMany({
            where: {
                categories: {
                    some: {
                        id: categoryId,
                    },
                },
            },
        });

        if (!products || products.length === 0) {
            return sendError(res, 'No products found for the given category ID');
        }

        return sendSuccess(res, 'Products retrieved successfully', products);
    } catch (error) {
        console.error(error);
        return sendError(res, 'Internal Server Error');
    }
};


export const createProduct = async (req, res) => {
    try {
        let { name, description, price, categoryId } = req.body;
        const thumbnail = req.file.filename; 
        price = parseInt(price);

        const existingCategory = await prisma.category.findUnique({
            where: { id: categoryId },
        });

        if (!existingCategory) {
            return sendError(res, 'Invalid category ID');
        }

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price,
                thumbnail: thumbnail,
                categories: { connect: { id: categoryId } }
            },
        });

        return sendSuccess(res, 'Product created successfully', product);
    } catch (error) {
        console.error(error);
        return sendError(res, 'Internal Server Error');
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { name, description, price, categoryId } = req.body;
        const existingProduct = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!existingProduct) {
            return sendError(res, 'Product not found');
        }

        const existingCategory = await prisma.category.findUnique({
            where: { id: categoryId },
        });

        if (!existingCategory) {
            return sendError(res, 'Invalid category ID');
        }

        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: {
                name: name || existingProduct.name,
                description: description || existingProduct.description,
                price: parseInt(price) || existingProduct.price,
                categories: { connect: { id: categoryId } }
            },
        });

        return sendSuccess(res, 'Product updated successfully', updatedProduct);
    } catch (error) {
        console.error(error);
        return sendError(res, 'Internal Server Error');
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        await prisma.product.delete({ where: { id: productId } });

        return sendSuccess(res, 'Product deleted successfully');
    } catch (error) {
        console.error(error);
        return sendError(res, 'Internal Server Error');
    }
};