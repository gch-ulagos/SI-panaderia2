"use client";
import React, { useState, useEffect } from 'react';
import { Container, Button, Typography, Alert, AlertTitle, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Popover, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon, Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import Navbar from '../../../components/Navbar';
import FileService from '../../../services/FileService';
import TransactionService from '../../../services/TransactionService';

export default function ManageFiles() {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileToEdit, setFileToEdit] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [infoMessage, setInfoMessage] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [selectedTransaction, setSelectedTransaction] = useState('');

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

    const fetchTransactions = async () => {
        try {
            const token = localStorage.getItem("token");
            const data = await TransactionService.getGhostTransactions(token);
            setTransactions(data.transaction || []);
            console.log(data.transaction);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    const fetchTransactions = async () => {
        try {
            const token = localStorage.getItem("token");
            const data = await TransactionService.getGhostTransactions(token);
            setTransactions(data.transaction || []);
            console.log(data.transaction);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    useEffect(() => {
        fetchFiles();
        fetchTransactions();
    }, []);

    const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

    const uploadFile = async () => {
        if (!selectedFile || !selectedTransaction) {
            setErrorMessage("Por favor, selecciona un archivo y una transacción.");
            return;
        }
    
        try {
            const token = localStorage.getItem("token");
            console.log(token);
            const formData = new FormData();
    
            formData.append("file", selectedFile);
            formData.append("transactionId", selectedTransaction);
    
            let response;
    
            if (fileToEdit) {
                response = await FileService.updateFile(fileToEdit.id, formData, token);
                setFileToEdit(null);
                setInfoMessage(null);
                setSuccessMessage("Archivo actualizado correctamente");
            } else {
                response = await FileService.uploadFile(selectedFile, selectedTransaction, token);
                setSuccessMessage("Archivo subido correctamente");
            }
    
            setErrorMessage(null);
            setSelectedFile(null);
            setSelectedTransaction('');
            fetchFiles();
        } catch (error) {
            console.error("Error uploading file:", error);
            setErrorMessage("Error al subir o actualizar archivo");
            setSuccessMessage(null);
        }
    };

    const [anchorEl, setAnchorEl] = useState(null);
    const [fileToDelete, setFileToDelete] = useState(null);

    const confirmDeleteFile = async () => {
        if (!fileToDelete) return;
        try {
            const token = localStorage.getItem("token");
            const response = await FileService.deleteFile(fileToDelete.id, token);
            setSuccessMessage(response.message);
            setErrorMessage(null);
            fetchFiles();
            handlePopoverClose();
        } catch (error) {
            setErrorMessage("Error al eliminar archivo");
            setSuccessMessage(null);
        }
    };

    const handlePopoverOpen = (event, file) => {
        setAnchorEl(event.currentTarget);
        setFileToDelete(file);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
        setFileToDelete(null);
    };

    const editFile = (file) => {
        setFileToEdit(file);
        setInfoMessage("Cargue un nuevo archivo para reemplazar el existente");
        setSuccessMessage(null);
        setErrorMessage(null);
    };

    const viewFile = (file) => {
        window.open(`http://localhost:3001/files/${file.name}`, '_blank');
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
            {infoMessage && (
                <Alert severity="info" icon={<VisibilityIcon />} style={{ color: '#007bff' }}>
                    <AlertTitle>Atención</AlertTitle>
                    {infoMessage}
                </Alert>
            )}

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                {!selectedFile ? (
                    <>
                        <input
                            type="file"
                            id="fileInput"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => document.getElementById('fileInput').click()}
                            sx={{ textTransform: "none" }}
                        >
                            Seleccionar archivo
                        </Button>
                    </>
                ) : (
                    <>
                        <Typography variant="body1" gutterBottom>
                            Archivo seleccionado: {selectedFile.name}
                        </Typography>
                        <FormControl fullWidth>
                            <InputLabel>Seleccione la transacción</InputLabel>
                            <Select
                                value={selectedTransaction}
                                onChange={(e) => {
                                    console.log("Seleccionado:", e.target.value);
                                    setSelectedTransaction(e.target.value);
                                }}
                                label="Seleccione la transacción"
                            >
                                {transactions.length > 0 ? (
                                    transactions.map((transaction) => (
                                        <MenuItem key={transaction.id} value={transaction.id}>
                                            {transaction.id}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem value="">Cargando transacciones...</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                        <div style={{ marginTop: '10px' }}>
                            <Button
                                variant="outlined"
                                color="secondary"
                                style={{ marginRight: '10px' }}
                                onClick={() => {
                                    setSelectedFile(null);
                                    setSelectedTransaction('');
                                }}
                            >
                                Cambiar archivo
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={uploadFile}
                            >
                                Subir archivo
                            </Button>
                        </div>
                    </>
                )}
            </div>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID del archivo</TableCell>
                        <TableCell>Nombre del archivo</TableCell>
                        <TableCell>Transacción Asociada</TableCell>
                        <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {files.map((file) => (
                        <TableRow key={file.id}>
                            <TableCell>{file.id}</TableCell>
                            <TableCell>{file.name}</TableCell>
                            <TableCell>{file.transactionId}</TableCell>
                            <TableCell>
                                <IconButton color="primary" onClick={() => editFile(file)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton color="error" onClick={(event) => handlePopoverOpen(event, file)}>
                                    <DeleteIcon />
                                </IconButton>
                                <IconButton color="default" onClick={() => viewFile(file)}>
                                    <VisibilityIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                <div style={{ padding: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography variant="body1" style={{ marginRight: '10px' }}>
                        ¿Desea eliminar el archivo?
                    </Typography>
                    <Button
                        variant="contained"
                        color="success"
                        style={{ marginRight: '10px' }}
                        onClick={confirmDeleteFile}
                    >
                        <CheckIcon style={{ marginRight: '5px' }} />
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handlePopoverClose}
                    >
                        <CloseIcon style={{ marginRight: '5px' }} />
                    </Button>
                </div>
            </Popover>
        </Container>
    );
}
