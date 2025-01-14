import { Router } from 'express';
import ClientService from '../services/ClientService.js';
import NumberMiddleware from '../middlewares/number.middleware.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/createCliente', [
    AuthMiddleware.validateToken
], async (req, res) => {
    const response = await ClientService.createCliente(req.body);
    res.status(response.code).json(response.message);
});

router.get('/getAllClientes', [
    AuthMiddleware.validateToken
], async (req, res) => {
    const response = await ClientService.getAllClientes();
    res.status(response.code).json(response.message);
});

router.get('/:id', [
    NumberMiddleware.isNumber,
    AuthMiddleware.validateToken
], async (req, res) => {
    const response = await ClientService.getClienteById(req.params.id);
    res.status(response.code).json(response.message);
});

router.put('/:id', [
    NumberMiddleware.isNumber,
    AuthMiddleware.validateToken
], async (req, res) => {
    const response = await ClientService.updateCliente(req.params.id, req.body);
    res.status(response.code).json(response.message);
});

router.patch('/:id/toggleEstado', [
    NumberMiddleware.isNumber,
    AuthMiddleware.validateToken
], async (req, res) => {
    const response = await ClientService.toggleClienteEstado(req.params.id);
    res.status(response.code).json(response.message);
});

router.delete('/:id', [
    NumberMiddleware.isNumber,
    AuthMiddleware.validateToken
], async (req, res) => {
    const response = await ClientService.deleteCliente(req.params.id);
    res.status(response.code).json(response.message);
});

export default router;
