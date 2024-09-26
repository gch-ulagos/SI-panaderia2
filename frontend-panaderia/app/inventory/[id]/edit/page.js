"use client"
import React, {useEffect, useState} from 'react';
import {Container, Switch, TextField, Button} from "@mui/material";
import { useRouter } from 'next/navigation';
import ProductService from '@/services/ProductService';

const EditProduct = (props) => {
    const {id} = props.params;
    const router = useRouter();

    const [product, setProduct] = useState(null);

    const [editedProduct, setEditedProduct] = useState({
        name: '',
        stock: 0,
        measure_type: '',
        production: false
    });

    const handleChange = (value, field) => {
        setEditedProduct({
            ...editedProduct,
            [field]: value
        });
    }

    const handleUpdate = () => {
        const token = localStorage.getItem('token');
        (async () => {
            const data = await ProductService.updateProduct(id, editedProduct, token);
            console.log(data);
            router.push('/inventory'); // Redireccionar al inventario después de actualizar
        })();
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        (async () => {
            const data = await ProductService.getProductById(id, token);
            setProduct(data);
            setEditedProduct(data); // Rellena los campos con los datos existentes del producto
        })();
    }, [id]);

    return (
        <div>
            <h1>Editar Producto {id}</h1>
            {!product ? "Cargando datos del producto..." : (
                <Container>
                    <TextField
                        label="Nombre del Producto"
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
                    <label>Producción Local</label>
                    <Button
                        type="button"
                        variant="contained"
                        color="primary"
                        onClick={handleUpdate}
                        style={{ marginTop: '16px' }}
                    >
                        Actualizar Producto
                    </Button>
                </Container>
            )}
        </div>
    )
}

export default EditProduct;