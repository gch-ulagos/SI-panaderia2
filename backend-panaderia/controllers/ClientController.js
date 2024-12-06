import { Router } from 'express';
import ClientService from '../services/ClientService.js';
import NumberMiddleware from '../middlewares/number.middleware.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/createCliente', [
    AuthMiddleware.validateToken
], async (req, res) => {
    const response = await ClienteService.createCliente(req.body);
    res.status(response.code).json(response.message);
});

router.get('/getAllClientes', [
    AuthMiddleware.validateToken
], async (req, res) => {
    const response = await ClienteService.getAllClientes();
    res.status(response.code).json(response.message);
});

router.get('/:id', [
    NumberMiddleware.isNumber,
    AuthMiddleware.validateToken
], async (req, res) => {
    const response = await ClienteService.getClienteById(req.params.id);
    res.status(response.code).json(response.message);
});

router.put('/:id', [
    NumberMiddleware.isNumber,
    AuthMiddleware.validateToken
], async (req, res) => {
    const response = await ClienteService.updateCliente(req.params.id, req.body);
    res.status(response.code).json(response.message);
});

router.patch('/:id/toggleEstado', [
    NumberMiddleware.isNumber,
    AuthMiddleware.validateToken
], async (req, res) => {
    const response = await ClienteService.toggleClienteEstado(req.params.id);
    res.status(response.code).json(response.message);
});

router.delete('/:id', [
    NumberMiddleware.isNumber,
    AuthMiddleware.validateToken
], async (req, res) => {
    const response = await ClienteService.deleteCliente(req.params.id);
    res.status(response.code).json(response.message);
});

export default router;
