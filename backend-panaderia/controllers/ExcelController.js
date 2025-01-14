import { Router } from 'express';
import ExcelService from '../services/ExcelService.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/getAllProducts',
    [
        AuthMiddleware.validateToken,
    ],
    async (req, res) => {
        const response = await ExcelService.getAllProducts(req);

        if (response.code === 200) {

            res.setHeader('Content-Disposition', 'attachment; filename=Productos.xlsx');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.send(response.buffer);
        } else {

            res.status(response.code).json({ message: response.message });
        }
    }
);

router.get('/getFilteredProducts',
    [
        AuthMiddleware.validateToken,
    ],
    async (req, res) => {
        try {
            const response = await ExcelService.getFilteredProducts(req.query);

            if (response.code === 200) {
                res.setHeader('Content-Disposition', 'attachment; filename=ProductosFiltrados.xlsx');
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.send(response.buffer);
            } else {
                res.status(response.code).json({ message: response.message });
            }
        } catch (err) {
            console.error('Error en el controlador:', err.message);
            res.status(500).json({ message: 'Error interno en el servidor.' });
        }
    }
);
















router.get('/getAllProduccions',
    [
        AuthMiddleware.validateToken,
    ],
    async (req, res) => {
        const response = await ExcelService.getAllProduccions(req);

        if (response.code === 200) {

            res.setHeader('Content-Disposition', 'attachment; filename=Producion.xlsx');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.send(response.buffer);
        } else {

            res.status(response.code).json({ message: response.message });
        }
    }
);





router.get('/getFilteredProduccions',
    [
        AuthMiddleware.validateToken,  // Middleware para validar el token
    ],
    async (req, res) => {
        try {
            // Pasar los parámetros de la solicitud al servicio
            const response = await ExcelService.getFilteredProduccions(req.query);  // Pasar req.query aquí

            // Si la respuesta es exitosa, configurar los encabezados para la descarga del archivo Excel
            if (response.code === 200) {
                res.setHeader('Content-Disposition', 'attachment; filename=ProducionFiltrada.xlsx');
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.send(response.buffer);
            } else {
                // Si ocurre un error o no hay datos, devolver un mensaje de error
                res.status(response.code).json({ message: response.message });
            }
        } catch (err) {
            // Manejo de errores
            console.error('Error en el controlador:', err.message);
            res.status(500).json({ message: 'Error interno en el servidor.' });
        }
    }
);




router.get('/transacciones', async (req, res) => {
    try {
        const transacciones = await ExcelService.getTransacciones();

        if (!transacciones || transacciones.length === 0) {
            return res.status(404).json({ message: "No se encontraron transacciones." });
        }

        res.status(200).json(transacciones);
    } catch (err) {
        console.error('Error al obtener transacciones:', err.message);
        res.status(500).json({ message: "Error al obtener transacciones.", error: err.message });
    }
});



router.get('/getAllTransacciones',
    [
        AuthMiddleware.validateToken,
    ],
    async (req, res) => {
        const response = await ExcelService.getAllTransacciones(req);

        if (response.code === 200) {

            res.setHeader('Content-Disposition', 'attachment; filename=TodaslasTransacciones.xlsx');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.send(response.buffer);
        } else {

            res.status(response.code).json({ message: response.message });
        }
    }
);














export default router;