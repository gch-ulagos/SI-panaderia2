import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api/v1/providers';

const getAllProveedores = async (token) => {
    const response = await axios.get(`${API_BASE_URL}/getAllProveedores`, {
        headers: {
            token,
        },
    });
    return response.data;
};

const createProveedor = async (proveedorData, token) => {
    const response = await axios.post(`${API_BASE_URL}/createProveedor`, proveedorData, {
        headers: {
            token,
        },
    });
    return response.data;
};

const getProveedorById = async (id, token) => {
    const response = await axios.get(`${API_BASE_URL}/${id}`, {
        headers: {
            token,
        },
    });
    return response.data;
};

const updateProveedor = async (id, proveedorData, token) => {
    const response = await axios.put(`${API_BASE_URL}/${id}`, proveedorData, {
        headers: {
            token,
        },
    });
    return response.data;
};

const toggleProveedorEstado = async (id, token) => {
    const response = await axios.patch(`${API_BASE_URL}/${id}/toggleEstado`, {}, {
        headers: {
            token,
        },
    });
    return response.data;
};

const deleteProveedor = async (id, token) => {
    const response = await axios.delete(`${API_BASE_URL}/${id}`, {
        headers: {
            token,
        },
    });
    return response.data;
};

export default {
    getAllProveedores,
    createProveedor,
    getProveedorById,
    updateProveedor,
    toggleProveedorEstado,
    deleteProveedor,
};
