import db from '../dist/db/models/index.js';

const createOrder = async (OrderData) => {
    const {
        direccion,
        nombre,
        celular,
        estado_del_pedido,
        cantidad,
        producto,
    } = OrderData;

    try {
        const newOrder = await db.Pedido.create({
            direccion,
            nombre,
            celular,
            estado_del_pedido,
            cantidad,
            producto
        });

        return {
            code: 200,
            message: 'Order created successfully with ID: ' + newOrder.id,
        };
    } catch (error) {
        return {
            code: 500,
            message: 'Error al crear el pedido: ' + error.message,
        };
    }
};

const getAllOrders = async () => {
    const Pedidos = await db.Pedido.findAll();
    return {
        code: 200,
        message: Pedidos,
    };
};

const getOrderById = async (id) => {
    const Pedidos = await db.Pedido.findOne({
        where: { id }
    });

    if (!Pedidos) {
        return {
            code: 404,
            message: 'Order not found'
        };
    }

    return {
        code: 200,
        message: Pedidos,
    };
};

const updateOrder = async (id, PedidosData) => {
    const Pedidos = await db.Pedido.findOne({ where: { id } });

    if (!Pedidos) {
        return {
            code: 404,
            message: 'Order not found'
        };
    }

    await db.Pedido.update(PedidosData, { where: { id } });

    return {
        code: 200,
        message: 'Order updated successfully',
    };
};

const deleteOrder = async (id) => {
    const deleted = await db.Pedido.destroy({ where: { id } });

    if (!deleted) {
        return { code: 404, message: 'Order not found' };
    }

    return { code: 200, message: 'Order deleted successfully' };
};

export default {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
};
