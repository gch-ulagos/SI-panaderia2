import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api/v1/transaction';

const createTransaction = async (transactionData, token) => {
    try {
        const response = await axios.post(`${BASE_URL}/createTransaction`, transactionData, {
            headers: { token },
        });
        return response.data;
    } catch (e) {
        console.error('Error creating transaction:', e);
        return false;
    }
};

const bulkCreateTransactions = async (transactions, token) => {
    try {
        const response = await axios.post(`${BASE_URL}/bulkCreateTransaction`, transactions, {
            headers: { token },
        });
        return response.data;
    } catch (e) {
        console.error('Error creating bulk transactions:', e);
        return false;
    }
};

const getGhostTransactions = async (token) => {
    try {
        const response = await axios.get(`${BASE_URL}/getGhostTransactions`, {
            headers: { token },
        });
        return response.data;
    } catch (e) {
        console.error('Error fetching transactions:', e);
        return false;
    }
};

const getAllTransactions = async (token) => {
    try {
        const response = await axios.get(`${BASE_URL}/getAllTransactions`, {
            headers: { token },
        });
        return response.data;
    } catch (e) {
        console.error('Error fetching transactions:', e);
        return false;
    }
};

const getTransactionById = async (id, token) => {
    try {
        const response = await axios.get(`${BASE_URL}/${id}`, {
            headers: { token },
        });
        return response.data;
    } catch (e) {
        console.error('Error fetching transaction by ID:', e);
        return false;
    }
};

const updateTransaction = async (id, transactionData, token) => {
    try {
        const response = await axios.put(`${BASE_URL}/${id}`, transactionData, {
            headers: { token },
        });
        return response.data;
    } catch (e) {
        console.error('Error updating transaction:', e);
        return false;
    }
};

const deleteTransaction = async (id, token) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${id}`, {
            headers: { token },
        });
        return response.data;
    } catch (e) {
        console.error('Error deleting transaction:', e);
        return false;
    }
};

export default {
    createTransaction,
    bulkCreateTransactions,
    getAllTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    getGhostTransactions,
};