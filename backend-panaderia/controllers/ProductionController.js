import { Router } from 'express';
import ProductionService from '../services/ProductionService.js';
import NumberMiddleware from '../middlewares/number.middleware.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/createProduction',
    [
        AuthMiddleware.validateToken,
    ],
    async (req, res) => {
    try {
        const response = await ProductionService.addProduction(req.body);
        res.status(response.code).json({ message: response.message });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la producción', error: error.message });
    }
});

router.get('/getProduction/:id',
    [
        AuthMiddleware.validateToken,
    ],
    async (req, res) => {
    try {
        const response = await ProductionService.getProductionById(req.params.id);
        res.status(response.code).json({ message: response.message });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la producción', error: error.message });
    }
});

router.get('/getAllProductions',
    [
        AuthMiddleware.validateToken,
    ],
    async (req, res) => {
    try {
        const response = await ProductionService.getAllProductions();
        res.status(response.code).json({ message: response.message });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las producciones', error: error.message });
    }
});

router.put('/updateProduction/:id',
    [
        AuthMiddleware.validateToken,
    ],
    async (req, res) => {
    try {
        const response = await ProductionService.updateProduction(req);
        res.status(response.code).json({ message: response.message });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la producción', error: error.message });
    }
});

router.delete('/deleteProduction/:id',
    [
        AuthMiddleware.validateToken,
    ],
    async (req, res) => {
    try {
        const response = await ProductionService.deleteProduction(req.params.id);
        res.status(response.code).json({ message: response.message });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la producción', error: error.message });
    }
});

router.post('/bulkCreateProduction',
    [
        AuthMiddleware.validateToken,
    ],
    async (req, res) => {
    try {
        const response = await ProductionService.bulkCreateProduction(req.body);
        res.status(response.code).json({ message: response.message });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear las producciones', error: error.message });
    }
});

export default router;
