import fs from 'fs';
import path from 'path';
import multer from 'multer';
import db from '../dist/db/models/index.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadFolder = path.join(__dirname, './public');

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

const upload = multer({ storage }).single('file');

const uploadFile = (req, res) => {
    return new Promise((resolve, reject) => {
        upload(req, res, async (err) => {
            if (err) {
                return reject({ code: 500, message: 'Error al subir el archivo' });
            }

            try {
                const filePath = path.join(uploadFolder, req.file.filename);

                const newFileRecord = await db.Archivo.create({
                    ruta: filePath
                });

                resolve({
                    code: 200,
                    message: 'Archivo subido correctamente',
                    fileId: newFileRecord.id,
                    filePath: filePath
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

        const filePath = fileRecord.ruta;
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

            fs.unlinkSync(existingFileRecord.ruta);

            upload(req, res, async (err) => {
                if (err) {
                    return reject({ code: 500, message: 'Error al subir el nuevo archivo' });
                }

                try {
                    const newFilePath = path.join(uploadFolder, req.file.filename);

                    await db.Archivo.update(
                        { ruta: newFilePath },
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

export default {
    uploadFile,
    deleteFile,
    updateFile
};
