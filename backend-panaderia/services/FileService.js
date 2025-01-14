import fs from 'fs';
import path from 'path';
import multer from 'multer';
import db from '../dist/db/models/index.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadFolder = path.join(__dirname, '../public');

if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['application/pdf'];

    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Solo se permiten archivos PDF'), false);
    }
    cb(null, true);
};

const upload = multer({ 
    storage, 
    fileFilter,
}).single('file');

const uploadFile = (req, res) => {
    return new Promise((resolve, reject) => {
        upload(req, res, async (err) => {
            if (err) {
                return reject({ code: 500, message: err.message || 'Error al subir el archivo' });
            }

            const { transactionId } = req.body;

            if (!transactionId) {
                return reject({ code: 400, message: 'El ID de la transacción es obligatorio' });
            }

            try {
                const filePath = path.join(uploadFolder, req.file.filename);

                const newFileRecord = await db.Archivo.create({
                    route: filePath,
                    name: req.file.filename,
                    transactionId,
                });

                resolve({
                    code: 200,
                    message: 'Archivo subido correctamente',
                    fileId: newFileRecord.id,
                    filePath: filePath,
                    transactionId: transactionId,
                });
            } catch (error) {
                reject({ code: 500, message: 'Error al registrar el archivo en la base de datos' });
            }
        });
    });
};

const deleteFile = async (fileId) => {
    try {
        const fileRecord = await db.Archivo.findByPk(fileId);
        if (!fileRecord) {
            return { code: 404, message: 'Archivo no encontrado en la base de datos' };
        }

        const filePath = fileRecord.route;
        fs.unlinkSync(filePath);

        await db.Archivo.destroy({ where: { id: fileId } });

        return { code: 200, message: 'Archivo eliminado correctamente' };
    } catch (error) {
        return { code: 500, message: 'Error al eliminar el archivo', error: error.message };
    }
};

const updateFile = (req, res, fileId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const existingFileRecord = await db.Archivo.findByPk(fileId);
            if (!existingFileRecord) {
                return reject({ code: 404, message: 'Archivo no encontrado en la base de datos' });
            }

            fs.unlinkSync(existingFileRecord.route);

            upload(req, res, async (err) => {
                if (err) {
                    return reject({ code: 500, message: err.message || 'Error al subir el nuevo archivo' });
                }

                try {
                    const newFilePath = path.join(uploadFolder, req.file.filename);

                    await db.Archivos.update(
                        { route: newFilePath,
                            name: req.file.filename
                        },
                        { where: { id: fileId } }
                    );

                    resolve({
                        code: 200,
                        message: 'Archivo actualizado correctamente',
                        fileId: fileId,
                        filePath: newFilePath
                    });
                } catch (error) {
                    reject({ code: 500, message: 'Error al actualizar la ruta en la base de datos' });
                }
            });
        } catch (error) {
            reject({ code: 500, message: 'Error al actualizar el archivo', error: error.message });
        }
    });
};

const getAllFiles = async () => {
    try {
        const files = await db.Archivo.findAll({
            attributes: ['id', 'route', 'name', 'transactionId'],
        });
        return { code: 200, message: 'Archivos obtenidos correctamente', files };
    } catch (error) {
        return { code: 500, message: error.message };
    }
};

export default {
    uploadFile,
    deleteFile,
    updateFile,
    getAllFiles
};
