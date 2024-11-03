import { Router } from 'express';
import FileService from '../services/FileService.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';

const router = Router();


router.get('/getAllFiles', 
    [
        AuthMiddleware.validateToken,
    ],
    async (req, res) => {
        try {
            const response = await FileService.getAllFiles();
            res.status(response.code).json({ message: response.message, files: response.files });
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener archivos' });
        }
    }
);

router.post('/upload',
    [
        AuthMiddleware.validateToken,
    ],
    async (req, res) => {
        try {
            const response = await FileService.uploadFile(req, res);
            res.status(response.code).json({ message: response.message, fileId: response.fileId, filePath: response.filePath });
        } catch (error) {
            res.status(error.code || 500).json({ message: error.message });
        }
    }
);

router.delete('/delete/:id',
    [
        AuthMiddleware.validateToken,
    ],
    async (req, res) => {
        try {
            const response = await FileService.deleteFile(req.params.id);
            res.status(response.code).json({ message: response.message });
        } catch (error) {
            res.status(error.code || 500).json({ message: error.message });
        }
    }
);

router.put('/update/:id',
    [
        AuthMiddleware.validateToken,
    ],
    async (req, res) => {
        try {
            const response = await FileService.updateFile(req, res, req.params.id);
            res.status(response.code).json({ message: response.message, fileId: response.fileId, filePath: response.filePath });
        } catch (error) {
            res.status(error.code || 500).json({ message: error.message });
        }
    }
);

export default router;