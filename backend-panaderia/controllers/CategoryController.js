import { Router } from 'express';
import CategoryService from '../services/CategoryService.js';
import NumberMiddleware from '../middlewares/number.middleware.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/createCategory', async (req, res) => {
    const response = await CategoryService.createCategory(req.body);
    res.status(response.code).json(response.message);
});

router.get('/getAllCategories', async (req, res) => {
    const response = await CategoryService.getAllCategories();
    res.status(response.code).json(response.message);
});

router.get('/:id', [
    NumberMiddleware.isNumber,
    AuthMiddleware.validateToken
], async (req, res) => {
    const response = await CategoryService.getCategoryById(req.params.id);
    res.status(response.code).json(response.message);
});

router.put('/:id', [
    NumberMiddleware.isNumber,
    AuthMiddleware.validateToken
], async (req, res) => {
    const response = await CategoryService.updateCategory(req.params.id, req.body);
    res.status(response.code).json(response.message);
});

router.delete('/:id', [
    NumberMiddleware.isNumber,
    AuthMiddleware.validateToken
], async (req, res) => {
    const response = await CategoryService.deleteCategory(req.params.id);
    res.status(response.code).json(response.message);
});

export default router;