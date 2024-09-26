import { Router } from 'express';
import InventoryService from '../services/InventoryService.js';
import NumberMiddleware from '../middlewares/number.middleware.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/getInventory',
    [
        AuthMiddleware.validateToken,
    ],
    async (req, res) => {
        const response = await InventoryService.getInventory(req);
        res.status(response.code).json(response.message);
    }
);

export default router;