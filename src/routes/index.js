import express from 'express';
import multer from 'multer';
import path from 'path';
import url from 'url';
import { sendBadRequest } from '../utils/helper.js';
import { register, login, logout } from '../controllers/authController.js'
import { getUserProfile } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/index.js';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
} from '../controllers/categoryController.js';

import { getAllPromos, getPromoById, createPromo, updatePromo, deletePromo } from '../controllers/promoController.js';

const router = express.Router();
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiUrl = process.env.API_URL;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../storage'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

//Get Image
router.get('/storage/:imageName', (req, res) => {
    const { imageName } = req.params;
    const imagePath = path.join(__dirname, `../storage/${imageName}`);
    res.sendFile(imagePath);
});

// Route for auth
router.post(`${apiUrl}/auth/register`, register);
router.post(`${apiUrl}/auth/login`, login);
router.post(`${apiUrl}/auth/logout`, logout);

//Route for user
router.get(`${apiUrl}/profile`, authenticateToken, getUserProfile);

//Route for category
router.post(`${apiUrl}/categories`, upload.single('icon_thumbnail'), createCategory);
router.get(`${apiUrl}/categories`, getAllCategories);
router.get(`${apiUrl}/categories/:id`, getCategoryById);
router.put(`${apiUrl}/categories/:id`, updateCategory);
router.delete(`${apiUrl}/categories/:id`, deleteCategory);

//Route for product
router.get(`${apiUrl}/products`, getAllProducts);
router.get(`${apiUrl}/products/:productId`, getProductById);
router.post(`${apiUrl}/products`, upload.single('thumbnail'), createProduct);
router.put(`${apiUrl}/products/:productId`, upload.single('thumbnail'), updateProduct);
router.delete(`${apiUrl}/products/:productId`, deleteProduct);


router.get(`${apiUrl}/promos`, getAllPromos);
router.get(`${apiUrl}/promos/:promoId`, getPromoById);
router.post(`${apiUrl}/promos`, upload.single('thumbnail'), createPromo);
router.put(`${apiUrl}/promos/:promoId`, upload.single('thumbnail'), updatePromo);
router.delete(`${apiUrl}/promos/:promoId`, deletePromo);


export default router;