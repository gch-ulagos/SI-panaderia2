import { Router } from 'express';
import ProveedorService from '../services/ProviderService.js';
import NumberMiddleware from '../middlewares/number.middleware.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/createProveedor', [
    AuthMiddleware.validateToken
], async (req, res) => {
    const response = await ProveedorService.createProveedor(req.body);
    res.status(response.code).json(response.message);
});

router.get('/getAllProveedores', [
    AuthMiddleware.validateToken
], async (req, res) => {
    const response = await ProveedorService.getAllProveedores();
    res.status(response.code).json(response.message);
});

router.get('/:id', [
    NumberMiddleware.isNumber,
    AuthMiddleware.validateToken
], async (req, res) => {
    const response = await ProveedorService.getProveedorById(req.params.id);
    res.status(response.code).json(response.message);
});

router.put('/:id', [
    NumberMiddleware.isNumber,
    AuthMiddleware.validateToken
], async (req, res) => {
    const response = await ProveedorService.updateProveedor(req.params.id, req.body);
    res.status(response.code).json(response.message);
});

router.patch('/:id/toggleEstado', [
    NumberMiddleware.isNumber,
    AuthMiddleware.validateToken
], async (req, res) => {
    const response = await ProveedorService.toggleProveedorEstado(req.params.id);
    res.status(response.code).json(response.message);
});

router.delete('/:id', [
    NumberMiddleware.isNumber,
    AuthMiddleware.validateToken
], async (req, res) => {
    const response = await ProveedorService.deleteProveedor(req.params.id);
    res.status(response.code).json(response.message);
});

export default router;
