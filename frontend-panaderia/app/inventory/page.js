"use client"
import React, {useEffect, useState} from 'react';
import {Container, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import IconButton from '@mui/material/IconButton';
import {Edit} from "@mui/icons-material";
import AuthService from "../../services/AuthService";
import ProductService from '@/services/ProductService';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

export default function Users(){

    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');
        if(!user){
            router.push('/login');
        }
        if(user?.roles?.includes('admin')){
            getAllUsers();
            getAllProducts(token);
        }
        if(user?.roles?.includes('user')){
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
            console.error("error fetching products", e);
        }
    }

    const handleEdit = (user) => {
        router.push('/inventory/' + user.id + '/edit');
    }

    return (
        <Container>
            <Navbar />
            <button onClick={() => router.push('/users/findUsers')}>Find Users</button>
            <button onClick={() => router.push('/users/bulkCreate')}>Bulk Create</button>
            <h1>Inventario</h1>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Nombre del Producto</TableCell>
                        <TableCell>Stock</TableCell>
                        <TableCell>Medida</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.stock}</TableCell>
                                <TableCell>{product.measure_type}</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </Container>
    )
}
