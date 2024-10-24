"use client";
import React, { useEffect, useState } from 'react';
import { Container, TextField, Button, Typography, Alert, AlertTitle, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import Navbar from '../../../components/Navbar';
import CategoryService from '../../../services/CategoryService';
import { useRouter } from 'next/navigation';

export default function ManageCategories() {
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    // Fetch categories on component mount
    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem("token");
            const data = await CategoryService.getAllCategories(token);
            setCategories(data || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
            setErrorMessage("Error al obtener categorías");
        }
    };
    
    useEffect(() => {
        fetchCategories();
    }, []);

    // Handle changes in input fields
    const handleInputChange = (index, value) => {
        const updatedCategories = [...categories];
        updatedCategories[index].name = value;
        setCategories(updatedCategories);
    };

    // Add new category
    const addCategory = async () => {
        if (!newCategoryName) return;
        try {
            const token = localStorage.getItem("token");
            const response = await CategoryService.createCategory({ name: newCategoryName }, token);
            setSuccessMessage(response.message);
            setErrorMessage(null);
            setNewCategoryName(''); // Clear input field
            fetchCategories(); // Refetch categories after creation
        } catch (error) {
            setErrorMessage("Error al crear categoría");
            setSuccessMessage(null);
        }
    };

    // Update existing category
    const updateCategory = async (id) => {
        if (!selectedCategory) return;
        try {
            const token = localStorage.getItem("token");
            const response = await CategoryService.updateCategory(id, { name: selectedCategory.name }, token);
            setSuccessMessage(response.message);
            setErrorMessage(null);
            fetchCategories();
            setSelectedCategory(null); // Clear selected category
        } catch (error) {
            setErrorMessage("Error al actualizar categoría");
            setSuccessMessage(null);
        }
    };

    // Delete a category
    const deleteCategory = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const response = await CategoryService.deleteCategory(id, token);
            setSuccessMessage(response.message);
            setErrorMessage(null);
            fetchCategories(); // Refetch categories after deletion
        } catch (error) {
            setErrorMessage("Error al eliminar categoría");
            setSuccessMessage(null);
        }
    };

    return (
        <Container>
            <Navbar />
            <Typography variant="h4" gutterBottom>
                Categorías
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
            
            {/* Input to add new category */}
            <div style={{ marginBottom: '20px' }}>
                <TextField
                    label="Nombre de nueva categoría"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    fullWidth
                />
                <Button variant="contained" color="primary" onClick={addCategory} style={{ marginTop: '10px', textTransform: 'none' }}>
                    Añadir categoría
                </Button>
            </div>

            {/* Table to display and edit categories */}
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Nombre de la categoría</TableCell>
                        <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {categories.map((category, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                {selectedCategory && selectedCategory.id === category.id ? (
                                    <TextField
                                        fullWidth
                                        value={selectedCategory.name}
                                        onChange={(e) => setSelectedCategory({ ...selectedCategory, name: e.target.value })}
                                    />
                                ) : (
                                    category.name
                                )}
                            </TableCell>
                            <TableCell>
                                {selectedCategory && selectedCategory.id === category.id ? (
                                    <>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => updateCategory(category.id)}
                                            sx={{ textTransform: 'none', marginRight: '10px' }}
                                        >
                                            Guardar
                                        </Button>
                                        <Button
                                            variant="contained"
                                            onClick={() => setSelectedCategory(null)}
                                            sx={{ textTransform: 'none' }}
                                        >
                                            Cancelar
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => setSelectedCategory(category)}
                                            sx={{ textTransform: 'none', marginRight: '10px' }}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => deleteCategory(category.id)}
                                            sx={{ textTransform: 'none' }}
                                        >
                                            Eliminar
                                        </Button>
                                    </>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Container>
    );
}
