"use client";

import React, { useEffect, useState } from 'react';
import { Container, TextField, Button, Typography, Alert, AlertTitle, Table, TableBody, TableCell, TableHead, TableRow, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Navbar from '../../../components/Navbar';
import OrderService from '../../../services/OrderService';
import ProductService from '../../../services/ProductService';
import { useRouter } from 'next/navigation';

export default function ManageOrders() {
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [newOrderData, setNewOrderData] = useState({
        direccion: '',
        nombre: '',
        celular: '',
        estado_del_pedido: '',
        Kilos: '',
        producto: ''
    });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [availableProducts, setAvailableProducts] = useState([]);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [token, setToken] = useState('');

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("token");
            const data = await OrderService.getAllOrders(token);
            setOrders(data || []);
        } catch (error) {
            console.error("Error fetching orders:", error);
            setErrorMessage("Error al obtener pedidos");
        }
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
        fetchOrders();
        fetchProductsForProduction(storedToken);
    }, []);

    const handleInputChange = (field, value) => {
        setNewOrderData(prevState => ({ ...prevState, [field]: value }));
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES");
    };
    

    const addOrder = async () => {
        const { direccion, nombre, celular, estado_del_pedido, Kilos, producto } = newOrderData;



        if (!direccion || !nombre || !celular || !estado_del_pedido || !Kilos || !producto) {
            setErrorMessage("Todos los campos son obligatorios.");
            return;
        }

        const orderData = {
            direccion,
            nombre,
            celular,
            estado_del_pedido,
            cantidad: Kilos,
            producto
        };

        try {
            const token = localStorage.getItem("token");
            const response = await OrderService.createOrder(orderData, token);
            setSuccessMessage(response.message);
            setErrorMessage(null);
            setNewOrderData({
                direccion: '',
                nombre: '',
                celular: '',
                estado_del_pedido: '',
                Kilos: '',
                producto: ''
            });
            fetchOrders();
            setShowCreateForm(false);
        } catch (error) {
            setErrorMessage("Error al crear el pedido");
            setSuccessMessage(null);
        }
    };

    
    const updateOrder = async () => {
        if (!selectedOrder) return;

        const { direccion, nombre, celular, estado_del_pedido, Kilos, producto } = newOrderData;

        if (!direccion || !nombre || !celular || !estado_del_pedido || !Kilos || !producto) {
            setErrorMessage("Todos los campos son obligatorios.");
            return;
        }

        const confirmUpdate = window.confirm("¿Estás seguro de que deseas actualizar este pedido?");
        if (!confirmUpdate) return;

        const orderData = {
            direccion,
            nombre,
            celular,
            estado_del_pedido,
            cantidad: Kilos,
            producto
        };

        try {
            const token = localStorage.getItem("token");
            const response = await OrderService.updateOrder(selectedOrder.id, orderData, token);
            setSuccessMessage(response.message);
            setErrorMessage(null);
            fetchOrders();
            setShowCreateForm(false);
            setIsEditMode(false);
            setSelectedOrder(null);
        } catch (error) {
            setErrorMessage("Error al actualizar el pedido");
            setSuccessMessage(null);
        }
    };

    const deleteOrder = async (id) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este pedido?");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");
            const response = await OrderService.deleteOrder(id, token);
            setSuccessMessage(response.message);
            setErrorMessage(null);
            fetchOrders();
        } catch (error) {
            console.error("Error details:", error);
            setErrorMessage("Error al eliminar el pedido");
            setSuccessMessage(null);
        }
    };

    const orderStatusMapping = {
        pendiente: "Pendiente",
        en_proceso: "En proceso",
        completado: "Completado",
        cancelado: "Cancelado"
    };

    const handleEditClick = (order) => {
        setSelectedOrder(order);
        setNewOrderData({
            direccion: order.direccion,
            nombre: order.nombre,
            celular: order.celular,
            estado_del_pedido: order.estado_del_pedido,
            Kilos: order.cantidad,
            producto: order.producto
        });
        setIsEditMode(true);
        setShowCreateForm(true);
    };

    const handleCreateNewClick = () => {
        setSelectedOrder(null);
        setNewOrderData({
            direccion: '',
            nombre: '',
            celular: '',
            estado_del_pedido: '',
            Kilos: '',
            producto: ''
        });
        setIsEditMode(false);
        setShowCreateForm(true);
    };

    const fetchProductsForProduction = async (token) => {
        try {
            const data = await ProductService.getProductsForProduction(token);
            setAvailableProducts(data);
        } catch (error) {
            console.error('Error al obtener productos:', error.response?.data || error.message);
        }
    };

    return (
        <Container>
            <Navbar />
            <Typography variant="h4" gutterBottom>
                Pedidos de pan
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

            <Button
                variant="contained"
                color="primary"
                onClick={handleCreateNewClick}
                style={{ marginBottom: '20px' }}
                sx={{textTransform: 'none'}}
            >
                Crear pedido
            </Button>

            {showCreateForm && (
                <div style={{ marginBottom: '20px' }}>
                    <TextField
                        label="Dirección"
                        value={newOrderData.direccion}
                        onChange={(e) => handleInputChange('direccion', e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Nombre"
                        value={newOrderData.nombre}
                        onChange={(e) => handleInputChange('nombre', e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Celular"
                        value={newOrderData.celular}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\+?\d*$/.test(value) && value.length <= 12) {
                                handleInputChange('celular', value);
                            }
                        }}
                        inputProps={{
                            maxLength: 12,
                        }}
                        fullWidth
                    />
                    
                    <FormControl fullWidth>
                        <InputLabel>Estado del pedido </InputLabel>
                        <Select
                            value={newOrderData.estado_del_pedido}
                            onChange={(e) => handleInputChange('estado_del_pedido', e.target.value)}
                        >
                            <MenuItem value="pendiente">Pendiente</MenuItem>
                            <MenuItem value="en_proceso">En proceso</MenuItem>
                            <MenuItem value="completado">Completado</MenuItem>
                            <MenuItem value="cancelado">Cancelado</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        label="Kilos"
                        type="number"
                        value={newOrderData.Kilos}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value >= 0) {
                                handleInputChange('Kilos', value);
                            }
                        }}
                        inputProps={{
                            min: 0,
                        }}
                        fullWidth
                    />
                    <TextField
                        select
                        label="Producto"
                        variant="outlined"
                        value={newOrderData.producto}
                        onChange={(e) => handleInputChange('producto', e.target.value )}
                        fullWidth
                    >
                        {availableProducts.map((product) => (
                        <MenuItem key={product.id} value={product.name}>
                            {product.name}
                        </MenuItem>
                        ))}
                    </TextField>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={isEditMode ? updateOrder : addOrder} 
                        style={{ marginTop: '10px', textTransform: 'none' }}
                    >
                        {isEditMode ? 'Actualizar Pedido' : 'Añadir Pedido'}
                    </Button>
                </div>
            )}

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Dirección</TableCell>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Celular</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Kilos</TableCell>
                        <TableCell>Producto</TableCell>
                        <TableCell>Fecha creado</TableCell>
                        <TableCell>Fecha actualizado</TableCell>
                        <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell>{order.direccion}</TableCell>
                            <TableCell>{order.nombre}</TableCell>
                            <TableCell>{order.celular}</TableCell>
                            <TableCell>{orderStatusMapping[order.estado_del_pedido]}</TableCell>
                            <TableCell>{order.cantidad}</TableCell>
                            <TableCell>{order.producto}</TableCell>
                            <TableCell>{formatDate(order.createdAt)}</TableCell>
                            <TableCell>{formatDate(order.updatedAt)}</TableCell>
                            <TableCell>
                                <Button variant="contained" color="primary" onClick={() => handleEditClick(order)} sx={{ textTransform: 'none', marginRight: '10px', }}>Editar</Button>
                                <Button variant="contained" onClick={() => deleteOrder(order.id)} sx={{ textTransform: 'none', backgroundColor:'#f79d65' }}>Eliminar</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Container>
    );
}
