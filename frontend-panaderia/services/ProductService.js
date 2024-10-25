import axios from "axios";

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

const getProductById = async (id, token) => {
    try {
        const response = await axios.get(`http://localhost:3001/api/v1/products/${id}`, {
            headers: {
                token
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching product with id ${id}`, error);
        throw error;
    }
};

const updateProduct = async (id, productData, token) => {
    try {
        const response = await axios.put(`http://localhost:3001/api/v1/products/${id}`, productData, {
            headers: {
                token
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating product with id ${id}`, error);
        throw error;
    }
};

const bulkCreate = async (products, token) => {
    try {
        console.log('sending to backend:', products);
        const response = await axios.post('http://localhost:3001/api/v1/products/bulkCreate', products, {
            headers: {
                token
            }
        });
        console.log('el backend recibe', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creando productos masivamente:', error);
        throw error;
    }
}
const getProductsForProduction = async (token) => {
    try {
        const response = await axios.get('http://localhost:3001/api/v1/products/getAllProductsForProduction', {
            headers: { token }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching products for production:', error);
        throw error;
    }
};

const getProducts = async (token) => {
    try {
        const response = await axios.get('http://localhost:3001/api/v1/products/getAllProducts', {
            headers: { token }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export default {
    getProductsForProduction,
    getProducts,
    getProductById,
    updateProduct,
    bulkCreate,
};