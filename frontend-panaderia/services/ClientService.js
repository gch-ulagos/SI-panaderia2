import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api/v1/clients';

const getAllClientes = async (token) => {
    const response = await axios.get(`${API_BASE_URL}/getAllClientes`, {
        headers: {
            token,
        },
    });
    return response.data;
};

const createCliente = async (ClienteData, token) => {
    const response = await axios.post(`${API_BASE_URL}/createCliente`, ClienteData, {
        headers: {
            token,
        },
    });
    return response.data;
};

const getClienteById = async (id, token) => {
    const response = await axios.get(`${API_BASE_URL}/${id}`, {
        headers: {
            token,
        },
    });
    return response.data;
};

const updateCliente = async (id, ClienteData, token) => {
    const response = await axios.put(`${API_BASE_URL}/${id}`, ClienteData, {
        headers: {
            token,
        },
    });
    return response.data;
};

const toggleClientestado = async (id, token) => {
    const response = await axios.patch(`${API_BASE_URL}/${id}/toggleEstado`, {}, {
        headers: {
            token,
        },
    });
    return response.data;
};

const deleteCliente = async (id, token) => {
    const response = await axios.delete(`${API_BASE_URL}/${id}`, {
        headers: {
            token,
        },
    });
    return response.data;
};

export default {
    getAllClientes,
    createCliente,
    getClienteById,
    updateCliente,
    toggleClientestado,
    deleteCliente,
};
