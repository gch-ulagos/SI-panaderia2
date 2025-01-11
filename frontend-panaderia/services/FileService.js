import axios from 'axios';

const getAllFiles = async (token) => {
    try {
        const response = await axios.get('http://localhost:3001/api/v1/file/getAllFiles', {
            headers: { token },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching files:", error.response ? error.response.data : error.message);
        throw error;
    }
};
const uploadFile = async (file, token) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('http://localhost:3001/api/v1/file/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            token,
        },
    });

    return response.data;
};

const deleteFile = async (fileId, token) => {
    const response = await axios.delete(`http://localhost:3001/api/v1/file/delete/${fileId}`, {
        headers: {
            token,
        },
    });

    return response.data;
};


const updateFile = async (fileId, newFile, token) => {
    const formData = new FormData();
    formData.append('file', newFile);

    const response = await axios.put(`http://localhost:3001/api/v1/file/update/${fileId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            token,
        },
    });

    return response.data;
};

export default {
    uploadFile,
    deleteFile,
    updateFile,
    getAllFiles
};
