import db from '../dist/db/models/index.js';

const createCliente = async (ClienteData) => {
    const { nombre, direccion, contacto } = ClienteData;

    const existingCliente = await db.Clientes.findOne({
        where: { nombre },
    });

    if (existingCliente) {
        return {
            code: 400,
            message: 'El Cliente ya existe',
        };
    }

    const newCliente = await db.Clientes.create({
        nombre,
        direccion,
        contacto,
        estado: true,
    });

    return {
        code: 200,
        message: 'Cliente creado exitosamente con ID: ' + newCliente.id,
    };
};

const getAllClientes = async () => {
    const Clientes = await db.Clientes.findAll();
    return {
        code: 200,
        message: Clientes,
    };
};

const getClienteById = async (id) => {
    const Cliente = await db.Clientes.findOne({ where: { id } });

    if (!Cliente) {
        return {
            code: 404,
            message: 'Cliente no encontrado',
        };
    }

    return {
        code: 200,
        message: Cliente,
    };
};

const updateCliente = async (id, ClienteData) => {
    const Cliente = await db.Clientes.findOne({ where: { id } });

    if (!Cliente) {
        return {
            code: 404,
            message: 'Cliente no encontrado',
        };
    }

    await db.Clientes.update(ClienteData, { where: { id } });

    return {
        code: 200,
        message: 'Cliente actualizado exitosamente',
    };
};

const toggleClientestado = async (id) => {
    const Cliente = await db.Clientes.findOne({ where: { id } });

    if (!Cliente) {
        return {
            code: 404,
            message: 'Cliente no encontrado',
        };
    }

    const nuevoEstado = !Cliente.estado;
    await db.Clientes.update({ estado: nuevoEstado }, { where: { id } });

    return {
        code: 200,
        message: `Estado del Cliente actualizado a ${nuevoEstado ? 'Activo' : 'Inactivo'}`,
    };
};

const deleteCliente = async (id) => {
    const deleted = await db.Clientes.destroy({ where: { id } });

    if (!deleted) {
        return {
            code: 404,
            message: 'Cliente no encontrado',
        };
    }

    return {
        code: 200,
        message: 'Cliente eliminado exitosamente',
    };
};

export default {
    createCliente,
    getAllClientes,
    getClienteById,
    updateCliente,
    toggleClientestado,
    deleteCliente,
};
