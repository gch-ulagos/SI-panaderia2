import axios from 'axios';

const getAllProductions = async (token) => {
    try {
        const response = await axios.get(`http://localhost:3001/api/v1/production/getAllProductions`, {
            headers: { token }
        });
        return response.data.message;
    } catch (error) {
        console.error('Error obteniendo producciones:', error);
        throw error;
    }
};

const createProduction = async (productionData, token) => {
    try {
        const response = await axios.post(`http://localhost:3001/api/v1/production/createProduction`, productionData, {
            headers: { token }
        });
        return response.data;
    } catch (error) {
        console.error('Error creando producción:', error);
        throw error;
    }
};

const updateProduction = async (id, productionData, token) => {
    try {
        const response = await axios.put(`http://localhost:3001/api/v1/production/updateProduction/${id}`, productionData, {
            headers: { token }
        });
        return response.data;
    } catch (error) {
        console.error(`Error actualizando producción con id ${id}:`, error);
        throw error;
    }
};

const deleteProduction = async (id, token) => {
    try {
        const response = await axios.delete(`http://localhost:3001/api/v1/production/deleteProduction/${id}`, {
            headers: { token }
        });
        return response.data;
    } catch (error) {
        console.error(`Error eliminando producción con id ${id}:`, error);
        throw error;
    }
};

export default {
    getAllProductions,
    createProduction,
    updateProduction,
    deleteProduction,
};
