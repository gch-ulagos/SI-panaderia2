"use client";
import React, { useEffect, useState } from 'react';
import { Container, Table, TableBody, TableCell, TableHead, TableRow, TextField, Button, Select, MenuItem } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import { Edit } from "@mui/icons-material";
import AuthService from "../../services/AuthService";
import ProductService from '@/services/ProductService';
import CategoryService from '@/services/CategoryService';
import ExcelService from "@/services/ExcelService";
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } from 'recharts';
export default function Inventory() {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);



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
    };

    const getUser = async (id) => {
        const token = localStorage.getItem('token');
        const data = await AuthService.getUserById(id, token);
        setUsers([data]);
    };

    const getAllProducts = async (token) => {
        try {
            const productsData = await ProductService.getProducts(token);
            setProducts(productsData || []);
        } catch (e) {
            console.error("Error fetching products", e);
        }
    };

    const getAllCategories = async (token) => {
        try {
            const categoriesData = await CategoryService.getAllCategories(token);
            setCategories(categoriesData || []);
        } catch (e) {
            console.error("Error fetching categories", e);
        }
    };

    const handleEdit = (product) => {
        router.push('/inventory/' + product.id + '/edit');
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(name.toLowerCase()) &&
        (selectedCategory === "" || product.category === selectedCategory)
    );

    const getCategoryName = (categoryId) => {
        const category = categories.find((cat) => cat.id === categoryId);
        return category ? category.name : 'Sin categoría';
    };

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

    const DownloadAllProducts = async () => {
        try {
            const token = localStorage.getItem("token");
            await ExcelService.getAllProducts(token);
            setSuccessMessage("Archivo de productos descargado exitosamente.");
            setErrorMessage(null);
        } catch (error) {
            console.error("Error al descargar productos:", error);
            setErrorMessage("No se pudo descargar el archivo de productos.");
            setSuccessMessage(null);
        }
    };

    const DownloadFilteredProducts = async () => {
        try {
            const token = localStorage.getItem("token");
            let url = `http://localhost:3001/api/v1/Excel/getFilteredProducts`;
            const queryParams = [];
            if (name) queryParams.push(`name=${encodeURIComponent(name)}`);
            if (selectedCategory) {
                const categoryName = getCategoryName(selectedCategory);
                if (categoryName !== 'Sin categoría') {
                    queryParams.push(`category=${encodeURIComponent(categoryName)}`);
                }
            }

            if (queryParams.length > 0) {
                url += `?${queryParams.join("&")}`;
            }

            console.log("Enviando solicitud GET a la URL:", url);

            await ExcelService.getFilteredProducts(url, token);
            setSuccessMessage("Archivo de productos filtrados descargado exitosamente.");
            setErrorMessage(null);
        } catch (error) {
            console.error("Error al descargar productos filtrados:", error);
            setErrorMessage("No se pudo descargar el archivo de productos filtrados. Inténtalo nuevamente.");
            setSuccessMessage(null);
        }
    };

    return (
        <Container>
            <Navbar />
            <h1>Inventario</h1>
            <Button onClick={() => router.push('/inventory/bulkCreate')} sx={{ textTransform: 'none' }}>Insertar productos</Button>
            <Button onClick={() => router.push('/inventory/Category')} sx={{ textTransform: 'none' }}>Categorías</Button>
            <Button onClick={() => router.push('/production')} sx={{ textTransform: 'none' }}>Producción</Button>
            <Button onClick={() => router.push('/inventory/file')} sx={{ textTransform: 'none' }}>Subir archivo</Button>
<<<<<<< Updated upstream
            <Button onClick={() => router.push('/inventory/Orders')} sx={{textTransform:'none'}}>Pedidos</Button>
            <Button onClick={() => router.push('/transaction')} sx={{textTransform:'none'}}>Transacciones</Button>
            <Button onClick={() => router.push('/providers')} sx={{textTransform:'none'}}>Proveedores</Button>
            <Button onClick={() => router.push('/clients')} sx={{textTransform:'none'}}>Clientes</Button>
=======
            <Button onClick={() => router.push('/providers')} sx={{ textTransform: 'none' }}>Proveedores</Button>
            <Button onClick={() => router.push('/transaction')} sx={{ textTransform: 'none' }}>Transacciones</Button>
>>>>>>> Stashed changes
            <Button variant="contained" color="primary" onClick={DownloadAllProducts} style={{ margin: "10px", textTransform: 'none' }}> Descargar Todos los Productos </Button>
            <Button variant="contained" color="secondary" onClick={DownloadFilteredProducts} style={{ margin: "10px", textTransform: 'none' }}> Descargar Productos Filtrados </Button>
            
            <TextField
                label="Buscar producto por nombre"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="normal"
            />

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
                        <TableCell onClick={() => handleSort('id')}>
                            <Button>ID {sortConfig.key === 'id' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</Button>
                        </TableCell>
                        <TableCell>Nombre del producto</TableCell>
                        <TableCell>Categoría</TableCell>
                        <TableCell onClick={() => handleSort('stock')}>
                            <Button>Stock {sortConfig.key === 'stock' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</Button>
                        </TableCell>
                        <TableCell>Medida</TableCell>
                        <TableCell>Producción local</TableCell>
                        <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedProducts.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell>{product.id}</TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{getCategoryName(product.category)}</TableCell>
                            <TableCell>{product.stock}</TableCell>
                            <TableCell>{product.measure_type}</TableCell>
                            <TableCell>{product.production ? "Sí" : "No"}</TableCell>
                            <TableCell>
                                <IconButton color="primary" onClick={() => handleEdit(product)}>
                                    <Edit />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div>


      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={sortedProducts}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="stock" fill="#8884d8" name= "Stock"/>
        </BarChart>
      </ResponsiveContainer>
    </div>
        </Container>
    );
}
