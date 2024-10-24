"use client"
import React, {useEffect, useState} from 'react';
import {Container, Switch, TextField, Button, Select, MenuItem} from "@mui/material";
import { useRouter } from 'next/navigation';
import ProductService from '@/services/ProductService';
import CategoryService from '@/services/CategoryService';

const EditProduct = (props) => {
    const {id} = props.params;
    const router = useRouter();

    const [product, setProduct] = useState(null);
    const [categories, setCategories] = useState([]);

    const [editedProduct, setEditedProduct] = useState({
        name: '',
        category: '',
        stock: 0,
        measure_type: '',
        production: false
    });

    // Maneja los cambios en los campos del producto
    const handleChange = (value, field) => {
        setEditedProduct({
            ...editedProduct,
            [field]: value
        });
    }

    // Actualiza el producto
    const handleUpdate = () => {
        const token = localStorage.getItem('token');
        (async () => {
            const data = await ProductService.updateProduct(id, editedProduct, token);
            console.log(data);
            router.push('/inventory'); // Redireccionar al inventario después de actualizar
        })();
    }

    // Carga los datos del producto y las categorías disponibles
    useEffect(() => {
        const token = localStorage.getItem('token');

        // Obtener producto por ID
        const fetchProduct = async () => {
            const data = await ProductService.getProductById(id, token);
            setProduct(data);
            setEditedProduct(data); // Rellena los campos con los datos existentes del producto
        };

        // Obtener categorías
        const fetchCategories = async () => {
            const categoriesData = await CategoryService.getAllCategories(token);
            setCategories(categoriesData);
        };

        fetchProduct();
        fetchCategories();
    }, [id]);

    return (
        <div>
            <h1>Editar producto {id}</h1>
            {!product ? "Cargando datos del producto..." : (
                <Container>
                    <TextField
                        label="Nombre del producto"
                        name="name"
                        variant="outlined"
                        value={editedProduct.name}
                        onChange={(e) => handleChange(e.target.value, 'name')}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Stock"
                        name="stock"
                        type="number"
                        variant="outlined"
                        value={editedProduct.stock}
                        onChange={(e) => handleChange(e.target.value, 'stock')}
                        fullWidth
                        margin="normal"
                    />
                    {/* Select para Categorías */}
                    <Select
                        label="Categoría"
                        fullWidth
                        value={editedProduct.category}
                        onChange={(e) => handleChange(e.target.value, 'category')}
                        margin="normal"
                    >
                        {categories.map((category) => (
                            <MenuItem key={category.id} value={category.id}>
                                {category.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <TextField
                        label="Medida"
                        name="measure_type"
                        variant="outlined"
                        value={editedProduct.measure_type}
                        onChange={(e) => handleChange(e.target.value, 'measure_type')}
                        fullWidth
                        margin="normal"
                    />
                    <Switch
                        name="production"
                        checked={editedProduct.production}
                        onChange={(e) => handleChange(e.target.checked, 'production')}
                        color="primary"
                    />
                    <label>Producción local</label>
                    <Button
                        type="button"
                        variant="contained"
                        color="primary"
                        onClick={handleUpdate}
                        style={{ marginLeft: '16px',marginTop: '16px'}}
                        sx={{textTransform:'none'}}
                    >
                        Actualizar producto
                    </Button>
                </Container>
            )}
        </div>
    )
}

export default EditProduct;
