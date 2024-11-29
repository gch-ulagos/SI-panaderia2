import axios from "axios";

const downloadFile = (data, filename) => {
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
};

const getAllProducts = async (token) => {
    try {
        const response = await axios.get(`http://localhost:3001/api/v1/Excel/getAllProducts`, {
            headers: { token },
            responseType: 'blob' // Esto es esencial para manejar archivos
        });
        downloadFile(response.data, 'Productos.xlsx');
    } catch (error) {
        console.error('Error obteniendo productos:', error);
        throw error;
    }
};

const getAllProduccions = async (token) => {
    try {
        const response = await axios.get(`http://localhost:3001/api/v1/Excel/getAllProduccions`, {
            headers: { token },
            responseType: 'blob'
        });
        downloadFile(response.data, 'Producciones.xlsx');
    } catch (error) {
        console.error('Error obteniendo producciones:', error);
        throw error;
    }
};

const getFilteredProducts = async (url, token) => {
    try {
        const response = await axios.get(url, {
            headers: { token },
            responseType: 'blob'  // Especificar que se espera una respuesta de tipo blob (archivo binario)
        });
        downloadFile(response.data, 'ProductosFiltrados.xlsx');
    } catch (error) {
        console.error('Error al obtener productos filtrados:', error);
        throw error;
    }
};

const getFilteredProduccions = async (url, token) => {
    try {
        const response = await axios.get(url, {
            headers: { token },
            responseType: 'blob', // Manejar la respuesta como archivo
        });
        downloadFile(response.data, 'ProduccionesFiltradas.xlsx');
    } catch (error) {
        console.error("Error obteniendo producciones filtradas:", error);
        throw error;
    }
};





export default {
    getAllProducts,
    getAllProduccions,
    getFilteredProducts,
    getFilteredProduccions
};