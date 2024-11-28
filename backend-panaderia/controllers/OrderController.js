import { Router } from 'express';
import OrderService from '../services/OrderService.js';
import NumberMiddleware from '../middlewares/number.middleware.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/createOrder', async (req, res) => {
    const response = await OrderService.createOrder(req.body);
    res.status(response.code).json(response.message);
});

router.get('/getAllOrders', async (req, res) => {
    const response = await OrderService.getAllOrders();
    res.status(response.code).json(response.message);
});

router.get('/:id', [
    NumberMiddleware.isNumber,
    AuthMiddleware.validateToken
], async (req, res) => {
    const response = await OrderService.getOrderById(req.params.id);
    res.status(response.code).json(response.message);
});

router.put('/:id', [
    NumberMiddleware.isNumber,
    AuthMiddleware.validateToken
], async (req, res) => {
    const response = await OrderService.updateOrder(req.params.id, req.body);
    res.status(response.code).json(response.message);
});

router.delete('/:id', [
    NumberMiddleware.isNumber,
    AuthMiddleware.validateToken
], async (req, res) => {
    const response = await OrderService.deleteOrder(req.params.id);
    res.status(response.code).json(response.message);
});

export default router;