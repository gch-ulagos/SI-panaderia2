import { Router } from 'express';
import TransactionService from '../services/TransactionService.js';
import NumberMiddleware from '../middlewares/number.middleware.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

router.post(
    '/createTransaction',
    [
        AuthMiddleware.validateToken,
    ],
    async (req, res) => {
        const response = await TransactionService.createTransaction(req.body);
        res.status(response.code).json(response.message);
    }
);

router.post(
    '/bulkCreateTransaction',
    [
        AuthMiddleware.validateToken,
    ],
    async (req, res) => {
        const response = await TransactionService.bulkCreateTransactions(req.body);
        res.status(response.code).json(response.message);
    }
);


router.get(
    '/getGhostTransactions',
    [
        AuthMiddleware.validateToken,
    ],
    async (req, res) => {
        const response = await TransactionService.getGhostTransactions();
        res.status(response.code).json(response.message);
    }
);


router.get(
    '/getAllTransactions',
    [
        AuthMiddleware.validateToken,
    ],
    async (req, res) => {
        const response = await TransactionService.getAllTransactions();
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
        const response = await TransactionService.getTransactionById(req.params.id);
        res.status(response.code).json(response.message);
    }
);

router.put(
    '/:id',
    [
        NumberMiddleware.isNumber,
        AuthMiddleware.validateToken,
    ],
    async (req, res) => {
        const response = await TransactionService.updateTransaction(req);
        res.status(response.code).json(response.message);
    }
);

router.delete(
    '/:id',
    [
        NumberMiddleware.isNumber,
        AuthMiddleware.validateToken,
    ],
    async (req, res) => {
        const response = await TransactionService.deleteTransaction(req.params.id);
        res.status(response.code).json(response.message);
    }
);

export default router;
