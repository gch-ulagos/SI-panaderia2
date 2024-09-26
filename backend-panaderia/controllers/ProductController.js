import { Router } from 'express';
import ProductService from '../services/ProductService.js';
import NumberMiddleware from '../middlewares/number.middleware.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/createProduct', async (req, res) => {
    const response = await ProductService.createProduct(req.body);
    res.status(response.code).json(response.message);
});

router.post('/bulkCreate',
    [
        AuthMiddleware.validateToken,
    ],
    async (req, res) => {
        const response = await ProductService.bulkCreate(req.body);
        res.status(response.code).json(response.message);
    });

router.get('/getAllProducts',
    [
        AuthMiddleware.validateToken,
    ],
    async (req, res) => {
        const response = await ProductService.getAllProducts(req);
        res.status(response.code).json(response.message);
    }
);

router.get(
    '/:id',
    [
        NumberMiddleware.isNumber,
        AuthMiddleware.validateToken,
    ],
    async (req, res) => {
        const response = await ProductService.getProductById(req.params.id);
        res.status(response.code).json(response.message);
    }
);

router.put('/:id', [
        NumberMiddleware.isNumber,
        AuthMiddleware.validateToken,
    ],
    async(req, res) => {
        const response = await ProductService.updateProduct(req);
        res.status(response.code).json(response.message);
    }
);

router.delete('/:id',
    [
        NumberMiddleware.isNumber,
        AuthMiddleware.validateToken,
    ],
    async (req, res) => {
        const response = await ProductService.deleteProduct(req.params.id);
        res.status(response.code).json(response.message);
    }
);

export default router;