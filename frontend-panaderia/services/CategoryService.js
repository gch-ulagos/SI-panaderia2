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

export default {
    getAllCategories,
};
