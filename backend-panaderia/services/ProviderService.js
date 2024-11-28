import db from '../dist/db/models/index.js';

const createProveedor = async (proveedorData) => {
    const { empresa, contacto } = proveedorData;

    const existingProveedor = await db.Proveedores.findOne({
        where: { empresa },
    });

    if (existingProveedor) {
        return {
            code: 400,
            message: 'El proveedor ya existe',
        };
    }

    const newProveedor = await db.Proveedores.create({
        empresa,
        contacto,
        estado: true,
    });

    return {
        code: 200,
        message: 'Proveedor creado exitosamente con ID: ' + newProveedor.id,
    };
};

const getAllProveedores = async () => {
    const proveedores = await db.Proveedores.findAll();
    return {
        code: 200,
        message: proveedores,
    };
};

const getProveedorById = async (id) => {
    const proveedor = await db.Proveedores.findOne({ where: { id } });

    if (!proveedor) {
        return {
            code: 404,
            message: 'Proveedor no encontrado',
        };
    }

    return {
        code: 200,
        message: proveedor,
    };
};

const updateProveedor = async (id, proveedorData) => {
    const proveedor = await db.Proveedores.findOne({ where: { id } });

    if (!proveedor) {
        return {
            code: 404,
            message: 'Proveedor no encontrado',
        };
    }

    await db.Proveedores.update(proveedorData, { where: { id } });

    return {
        code: 200,
        message: 'Proveedor actualizado exitosamente',
    };
};

const toggleProveedorEstado = async (id) => {
    const proveedor = await db.Proveedores.findOne({ where: { id } });

    if (!proveedor) {
        return {
            code: 404,
            message: 'Proveedor no encontrado',
        };
    }

    const nuevoEstado = !proveedor.estado;
    await db.Proveedores.update({ estado: nuevoEstado }, { where: { id } });

    return {
        code: 200,
        message: `Estado del proveedor actualizado a ${nuevoEstado ? 'Activo' : 'Inactivo'}`,
    };
};

const deleteProveedor = async (id) => {
    const deleted = await db.Proveedores.destroy({ where: { id } });

    if (!deleted) {
        return {
            code: 404,
            message: 'Proveedor no encontrado',
        };
    }

    return {
        code: 200,
        message: 'Proveedor eliminado exitosamente',
    };
};

export default {
    createProveedor,
    getAllProveedores,
    getProveedorById,
    updateProveedor,
    toggleProveedorEstado,
    deleteProveedor,
};
