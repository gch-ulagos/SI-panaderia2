"use client"
import React, {useEffect, useState} from 'react';
import {Container, Table, TableBody, TableCell, TableHead, TableRow, TextField, Button, Select, MenuItem} from "@mui/material";
import IconButton from '@mui/material/IconButton';
import {Edit} from "@mui/icons-material";
import AuthService from "../../services/AuthService";
import ProductService from '@/services/ProductService';
import CategoryService from '@/services/CategoryService';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

export default function Inventory() {

    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]); // Nueva variable de estado para categorías
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(""); // Estado para la categoría seleccionada
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' }); // Configuración de ordenación

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');
        if (!user) {
            router.push('/login');
        }
        if (user?.roles?.includes('admin')) {
            getAllUsers();
            getAllProducts(token);
            getAllCategories(token);
        }
        if (user?.roles?.includes('user')) {
            getUser(user.id);
            getAllProducts(token);
            getAllCategories(token);
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

    const getAllCategories = async (token) => {
        try {
            const categoriesData = await CategoryService.getAllCategories(token);
            setCategories(categoriesData || []);
        } catch (e) {
            console.error("Error fetching categories", e);
        }
    }

    const handleEdit = (product) => {
        router.push('/inventory/' + product.id + '/edit');
    }

    const filteredProducts = products
        .filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedCategory === "" || product.category === selectedCategory)
        );

    // Función para obtener el nombre de la categoría por ID
    const getCategoryName = (categoryId) => {
        const category = categories.find((cat) => cat.id === categoryId);
        return category ? category.name : 'Sin categoría';
    }

    // Función para ordenar productos
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    return (
        <Container>
            <Navbar />
            <h1>Inventario</h1>
            <Button onClick={() => router.push('/inventory/bulkCreate')} sx={{ textTransform: 'none' }}>Insertar productos</Button>
            <Button onClick={() => router.push('/inventory/Category')} sx={{ textTransform: 'none' }}>Categorías</Button>
            
            <TextField
                label="Buscar producto"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                margin="normal"
            />

            {/* Filtro por Categorías */}
            <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                fullWidth
                displayEmpty
                margin="normal"
            >
                <MenuItem value="">
                    <em>Todas las categorías</em>
                </MenuItem>
                {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                        {category.name}
                    </MenuItem>
                ))}
            </Select>

            <Table>
                <TableHead>
                    <TableRow>
                        {/* Ordenar por ID */}
                        <TableCell onClick={() => handleSort('id')}>
                            <Button>
                                ID {sortConfig.key === 'id' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                            </Button>
                        </TableCell>
                        <TableCell>Nombre del producto</TableCell>
                        <TableCell>Categoría</TableCell>
                        {/* Ordenar por Stock */}
                        <TableCell onClick={() => handleSort('stock')}>
                            <Button sx={{ textTransform: 'none' }}>
                                Stock {sortConfig.key === 'stock' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                            </Button>
                        </TableCell>
                        <TableCell>Medida</TableCell>
                        <TableCell>Producción local</TableCell>
                        <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        sortedProducts.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.id}</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{getCategoryName(product.category)}</TableCell>
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
    );
}
