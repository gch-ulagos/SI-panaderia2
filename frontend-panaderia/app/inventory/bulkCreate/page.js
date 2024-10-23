"use client"
import React, { useEffect, useState } from 'react';
import { Container, TextField, Button, Typography, Alert, AlertTitle, Table, TableBody, TableCell, TableHead, TableRow, Select, MenuItem } from '@mui/material';
import Navbar from '../../../components/Navbar';
import ProductService from '@/services/ProductService';
import CategoryService from '../../../services/CategoryService';
import { useRouter } from 'next/navigation';

export default function BulkCreateProducts() {
    const router = useRouter();
    const [products, setProductsData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem("token");
                const data = await CategoryService.getAllCategories(token);
                setCategories(data || []);
            } catch (error) {
                console.error("Error fetching categories:", error);
                setErrorMessage("Error al obtener categoría");
            }
        };

        fetchCategories();
    }, []);

    const handleInputChange = (index, field, value) => {
        const updatedProductsData = [...products];
        updatedProductsData[index][field] = value;
        setProductsData(updatedProductsData);
    };

    const addRow = () => {
        setProductsData([...products, { name: '', category: '', brand: '', price: '', measure_type: '', stock: '', production: false }]);
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token");

            // Convert price and stock to numbers
            const formattedProducts = products.map(product => ({
                ...product,
                price: Number(product.price),  // Convert to number
                stock: Number(product.stock)   // Convert to number
            }));

            console.log('enviando:', formattedProducts);
            const response = await ProductService.bulkCreate(formattedProducts, token);
            setSuccessMessage(response.message);
            setErrorMessage(null);
            setProductsData([]); // Reiniciar formulario

            // Redirigir a la página de inventario
            router.push('/inventory');
        } catch (error) {
            setErrorMessage(error.message || 'Error al crear producto');
            setSuccessMessage(null);
        }
    };

    return (
        <Container>
            <Navbar />
            <Typography variant="h4" gutterBottom>
                Creación de productos
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
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Categoría</TableCell>
                        <TableCell>Marca</TableCell>
                        <TableCell>Precio</TableCell>
                        <TableCell>Medida</TableCell>
                        <TableCell>Stock</TableCell>
                        <TableCell>Producción local</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {products.map((product, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <TextField
                                    fullWidth
                                    required
                                    value={product.name}
                                    onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                                />
                            </TableCell>
                            <TableCell>
                                <Select
                                    fullWidth
                                    required
                                    value={product.category}
                                    onChange={(e) => handleInputChange(index, 'category', e.target.value)}
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </TableCell>
                            <TableCell>
                                <TextField
                                    fullWidth
                                    required
                                    value={product.brand}
                                    onChange={(e) => handleInputChange(index, 'brand', e.target.value)}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    fullWidth
                                    required
                                    type="number"
                                    value={product.price}
                                    onChange={(e) => handleInputChange(index, 'price', e.target.value)}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    fullWidth
                                    required
                                    value={product.measure_type}
                                    onChange={(e) => handleInputChange(index, 'measure_type', e.target.value)}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    fullWidth
                                    required
                                    type="number"
                                    value={product.stock}
                                    onChange={(e) => handleInputChange(index, 'stock', e.target.value)}
                                />
                            </TableCell>
                            <TableCell>
                                <Select
                                    fullWidth
                                    required
                                    value={product.production}
                                    onChange={(e) => handleInputChange(index, 'production', e.target.value)}
                                >
                                    <MenuItem value={true}>Sí</MenuItem>
                                    <MenuItem value={false}>No</MenuItem>
                                </Select>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Button variant="contained" color="primary" onClick={addRow} sx={{textTransform:'none'}}>
                Añadir fila
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit} sx={{textTransform:'none'}} style={{ marginLeft: '16px'}}>
                Crear productos
            </Button>
        </Container>
    );
}
