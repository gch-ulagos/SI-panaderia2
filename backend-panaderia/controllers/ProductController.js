import { Router } from 'express';
import ProductService from '../services/ProductService.js';
import NumberMiddleware from '../middlewares/number.middleware.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import db from '../dist/db/models/index.js';

const Producto = db.Producto;

const router = Router();
try {
    await db.sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
} catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
}

router.post('/createProduct', async (req, res) => {
    const response = await ProductService.createProduct(req.body);
    res.status(response.code).json(response.message);
});

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
        console.log('Bulk create response:', response);
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

router.get('/getAllProductsForProduction', async (req, res) => {
    const token = req.headers.token;

    try {
        const products = await Producto.findAll({
            where: {
                production: true
            }
        });
        res.json(products);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: 'Error al obtener productos', error: error.message || error });
    }
});

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