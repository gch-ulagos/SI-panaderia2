import axios from 'axios';

const getAllOrders = async (token) => { // Obtener el token del Local Storage
    const response = await axios.get('http://localhost:3001/api/v1/Order/getAllOrders', {
        headers: {
            token // Incluir el token en los encabezados
        },
    });
    return response.data; // Retornar los datos recibidos
};

const createOrder = async (OrderData, token) => {
    const response = await axios.post('http://localhost:3001/api/v1/Order/createOrder', OrderData, {
        headers: {
            token, // Incluir el token en los encabezados
        },
    });
    return response.data; // Retornar los datos recibidos
};

const getOrderById = async (id, token) => {
    const response = await axios.get(`http://localhost:3001/api/v1/Order/${id}`, {
        headers: {
            token,
        },
    });
    return response.data;
};

// Actualizar una categoría
const updateOrder = async (id, OrderData, token) => {
    const response = await axios.put(`http://localhost:3001/api/v1/Order/${id}`, OrderData, {
        headers: {
            token,
        },
    });
    return response.data;
};

// Eliminar una categoría
const deleteOrder = async (id, token) => {
    const response = await axios.delete(`http://localhost:3001/api/v1/Order/${id}`, {
        headers: {
            token,
        },
    });
    return response.data;
};

export default {
    getAllOrders,
    createOrder,
    getOrderById,
    updateOrder,
    deleteOrder,
};