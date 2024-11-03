import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import UserController from './controllers/UserController.js';
import AuthController from './controllers/AuthController.js';
import ProductController from './controllers/ProductController.js';
import ProductionController from './controllers/ProductionController.js';
import CategoryController from './controllers/CategoryController.js';
import InventoryController from './controllers/InventoryController.js';
import FileController from './controllers/FileController.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
    cors({
        origin: 'http://localhost:3000',
        // Allow follow-up middleware to override this CORS for options
        preflightContinue: true,
    }),
);

app.use(bodyParser.json());
app.use(express.json());
app.use('/api/v1/users', UserController);
app.use('/api/v1/category', CategoryController);
app.use('/api/v1/products', ProductController);
app.use('/api/v1/production', ProductionController);
app.use('/api/v1/file', FileController);
app.use('/api/v1/inventory', InventoryController);
app.use('/api/v1/auth', AuthController);

app.use('/files', express.static(path.join(__dirname, 'public')));

app.get('/api/v1/file/:id', (req, res) => {
    const filePath = path.join(__dirname, 'public', req.params.id);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error("Error al enviar el archivo:", err);
            res.status(err.status).end();
        }
    });
});

app.listen(3001, ()  => {
    console.log('Server is running on port 3001');
});
