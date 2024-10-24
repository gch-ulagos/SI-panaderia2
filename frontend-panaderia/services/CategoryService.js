// services/CategoryService.js
import axios from 'axios';

const getAllCategories = async (token) => { // Obtener el token del Local Storage
    const response = await axios.get('http://localhost:3001/api/v1/category/getAllCategories', {
        headers: {
            token // Incluir el token en los encabezados
        },
    });
    return response.data; // Retornar los datos recibidos
};

const createCategory = async (categoryData, token) => {
    const response = await axios.post('http://localhost:3001/api/v1/category/createCategory', categoryData, {
        headers: {
            token, // Incluir el token en los encabezados
        },
    });
    return response.data; // Retornar los datos recibidos
};

const getCategoryById = async (id, token) => {
    const response = await axios.get(`http://localhost:3001/api/v1/category/${id}`, {
        headers: {
            token,
        },
    });
    return response.data;
};

// Actualizar una categoría
const updateCategory = async (id, categoryData, token) => {
    const response = await axios.put(`http://localhost:3001/api/v1/category/${id}`, categoryData, {
        headers: {
            token,
        },
    });
    return response.data;
};

// Eliminar una categoría
const deleteCategory = async (id, token) => {
    const response = await axios.delete(`http://localhost:3001/api/v1/category/${id}`, {
        headers: {
            token,
        },
    });
    return response.data;
};

export default {
    getAllCategories,
    createCategory,
    getCategoryById,
    updateCategory,
    deleteCategory,
};