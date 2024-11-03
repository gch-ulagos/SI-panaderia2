"use client";
import React, { useState, useEffect } from 'react';
import { Container, Button, Typography, Alert, AlertTitle, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import Navbar from '../../../components/Navbar';
import FileService from '../../../services/FileService';

export default function ManageFiles() {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const fetchFiles = async () => {
        try {
            const token = localStorage.getItem("token");
            const data = await FileService.getAllFiles(token);
            setFiles(data.files || []);
        } catch (error) {
            console.error("Error fetching files:", error);
            setErrorMessage("Error al obtener archivos");
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

    const uploadFile = async () => {
        if (!selectedFile) return;
        try {
            const token = localStorage.getItem("token");
            const response = await FileService.uploadFile(selectedFile, token);
            setSuccessMessage(response.message);
            setErrorMessage(null);
            setSelectedFile(null);
            fetchFiles();
        } catch (error) {
            setErrorMessage("Error al subir archivo");
            setSuccessMessage(null);
        }
    };

    const deleteFile = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const response = await FileService.deleteFile(id, token);
            setSuccessMessage(response.message);
            setErrorMessage(null);
            fetchFiles();
        } catch (error) {
            setErrorMessage("Error al eliminar archivo");
            setSuccessMessage(null);
        }
    };

    return (
        <Container>
            <Navbar />
            <Typography variant="h4" gutterBottom>
                Gestión de archivos
            </Typography>
            {successMessage && (
                <Alert severity="success">
                    <AlertTitle>Exitoso</AlertTitle>
                    {successMessage}
                </Alert>
            )}
            {errorMessage && (
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {errorMessage}
                </Alert>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <input type="file" onChange={handleFileChange} />
                <Button variant="contained" color="primary" onClick={uploadFile} style={{ marginLeft: '10px', textTransform: 'none' }}>
                    Subir archivo
                </Button>
            </div>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID del archivo</TableCell>
                        <TableCell>Nombre del archivo</TableCell>
                        <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {files.map((file) => (
                        <TableRow key={file.id}>
                            <TableCell>{file.id}</TableCell>
                            <TableCell>{file.name}</TableCell>
                            <TableCell>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => deleteFile(file.id)}
                                    sx={{ textTransform: 'none' }}
                                >
                                    Eliminar
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Container>
    );
}