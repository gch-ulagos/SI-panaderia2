"use client";

import React, { useEffect, useState } from 'react';
import { Container, TextField, Button, Typography, Alert, AlertTitle, Table, TableBody, TableCell, TableHead, TableRow, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Navbar from '../../../components/Navbar';
import OrderService from '../../../services/OrderService';
import { useRouter } from 'next/navigation';

export default function ManageOrders() {
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [newOrderData, setNewOrderData] = useState({
        direccion: '',
        nombre: '',
        celular: '',
        estado_del_pedido: '',
        Kilos: '',  // En el frontend, usamos "Kilos"
        producto: ''
    });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

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
        fetchOrders();
    }, []);

    const handleInputChange = (field, value) => {
        setNewOrderData(prevState => ({ ...prevState, [field]: value }));
    };

    const formatDate = (dateString) => {
        if (!dateString) return ""; // Maneja valores nulos o indefinidos
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES"); // Muestra solo la fecha en formato dd/mm/yyyy
    };
    

    const addOrder = async () => {
        const { direccion, nombre, celular, estado_del_pedido, Kilos, producto } = newOrderData;



        if (!direccion || !nombre || !celular || !estado_del_pedido || !Kilos || !producto) {
            setErrorMessage("Todos los campos son obligatorios.");
            return;
        }

                // Validación básica del celular
                const celularRegex = /^[0-9]+$/;
                if (!celularRegex.test(celular)) {
                    setErrorMessage("El celular debe contener solo números.");
                    return;
                }

        // Preparar los datos para enviar al backend
        const orderData = {
            direccion,
            nombre,
            celular,
            estado_del_pedido,
            cantidad: Kilos,  // Mapeo de 'Kilos' a 'cantidad' para el backend
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
                Kilos: '',  // Reseteamos 'Kilos' en el frontend
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

        // Validación
        const celularRegex = /^[0-9]+$/;
        if (!celularRegex.test(celular)) {
            setErrorMessage("El celular debe contener solo números.");
            return;
        }

        if (!direccion || !nombre || !celular || !estado_del_pedido || !Kilos || !producto) {
            setErrorMessage("Todos los campos son obligatorios.");
            return;
        }

        // Confirmación de actualización
        const confirmUpdate = window.confirm("¿Estás seguro de que deseas actualizar este pedido?");
        if (!confirmUpdate) return;

        // Preparar los datos para enviar al backend
        const orderData = {
            direccion,
            nombre,
            celular,
            estado_del_pedido,
            cantidad: Kilos,  // Mapeo de 'Kilos' a 'cantidad' para el backend
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
        en_proceso: "En Proceso",
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
            Kilos: order.cantidad, // Usamos 'cantidad' de la base de datos, pero mostramos como 'Kilos'
            producto: order.producto
        });
        setIsEditMode(true);
        setShowCreateForm(true);  // Mostrar el formulario para editar
    };

    const handleCreateNewClick = () => {
        // Limpiar el formulario para crear un nuevo pedido
        setSelectedOrder(null);
        setNewOrderData({
            direccion: '',
            nombre: '',
            celular: '',
            estado_del_pedido: '',
            Kilos: '',  // Reseteamos 'Kilos' en el frontend
            producto: ''
        });
        setIsEditMode(false);
        setShowCreateForm(true);
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
                        onChange={(e) => handleInputChange('celular', e.target.value)}
                        fullWidth
                    />
                    
                    <FormControl fullWidth>
                        <InputLabel>Estado del Pedido</InputLabel>
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
                        value={newOrderData.Kilos}  // Usamos 'Kilos' en el formulario
                        onChange={(e) => handleInputChange('Kilos', e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Producto"
                        value={newOrderData.producto}
                        onChange={(e) => handleInputChange('producto', e.target.value)}
                        fullWidth
                    />
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
                                <Button onClick={() => handleEditClick(order)} color="primary">Editar</Button>
                                <Button onClick={() => deleteOrder(order.id)} color="secondary">Eliminar</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Container>
    );
}
