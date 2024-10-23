"use client"
import React, {useEffect, useState} from 'react';
import {Container, Table, TableBody, TableCell, TableHead, TableRow, TextField, Button} from "@mui/material";
import IconButton from '@mui/material/IconButton';
import {Edit} from "@mui/icons-material";
import AuthService from "../../services/AuthService";
import ProductService from '@/services/ProductService';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

export default function Inventory() {

    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); 

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');
        if(!user){
            router.push('/login');
        }
        if(user?.roles?.includes('admin')) {
            getAllUsers();
            getAllProducts(token);
        }
        if(user?.roles?.includes('user')) {
            getUser(user.id);
            getAllProducts(token);
        }
    }, []);

    const getAllUsers = async () => {
        const token = localStorage.getItem("token");
        const data = await AuthService.getUsers(token);
        setUsers(data);
    }

    const getUser = async (id) => {
        const token = localStorage.getItem('token');
        const data = await AuthService.getUserById(id, token);
        setUsers([data]);
    }

    const getAllProducts = async (token) => {
        try {
            const productsData = await ProductService.getProducts(token);
            setProducts(productsData || []);
        } catch (e) {
            console.error("Error fetching products", e);
        }
    }

    const handleEdit = (product) => {
        router.push('/inventory/' + product.id + '/edit');
    }

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container>
            <Navbar />
            <h1>Inventario</h1>
            <Button onClick={() => router.push('/inventory/bulkCreate')} sx={{textTransform:'none'}}>Insertar productos</Button>
            <TextField
                label="Buscar producto"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                margin="normal"
            />
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Nombre del producto</TableCell>
                        <TableCell>Stock</TableCell>
                        <TableCell>Medida</TableCell>
                        <TableCell>Producción local</TableCell>
                        <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        filteredProducts.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.id}</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.stock}</TableCell>
                                <TableCell>{product.measure_type}</TableCell>
                                <TableCell>{product.production ? "Sí" : "No"}</TableCell>
                                <TableCell>
                                    <IconButton color="primary" aria-label={"Editar producto " + product.id} onClick={() => handleEdit(product)}>
                                        <Edit />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </Container>
    )
}