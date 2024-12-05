"use client";
import React, { useEffect, useState } from 'react';
import { Container, Table, TableHead, TableRow, TableCell, TableBody, Button, IconButton, TextField } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import ProductionService from '@/services/ProductionService';
import ProductService from '@/services/ProductService';
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

export default function Production() {
    const [productions, setProductions] = useState([]);
    const [newProduction, setNewProduction] = useState({ productId: '', measure_type: '', quantity: 0 });
    const [token, setToken] = useState('');
    const [availableProducts, setAvailableProducts] = useState([]);
    const [editingProductionId, setEditingProductionId] = useState(null); // Estado para manejar la edición
    const [updatedData, setUpdatedData] = useState({}); // Para almacenar los datos actualizados
    const router = useRouter();
    const [chartData, setChartData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(''); // Estado para el filtro de producto
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
        fetchProductions(storedToken);
        fetchProductsForProduction(storedToken);
        loadChartData(storedToken);
        
    }, []);

    const fetchProductions = async (token) => {
        const data = await ProductionService.getAllProductions(token);
        setProductions(data);
    };

    const fetchProductsForProduction = async (token) => {
        try {
            const data = await ProductService.getProductsForProduction(token);
            setAvailableProducts(data);
        } catch (error) {
            console.error('Error al obtener productos:', error.response?.data || error.message);
        }
    };

    const loadChartData = async (token) => {
        const data = await ProductionService.getAllProductions(token);
        const formatDate = (date) => new Date(date).toISOString().split('T')[0];
        const transformData = (data) => {
            return data.map(item => ({
                name: item.productId, 
                quantity: item.quantity, 
                createdAt: formatDate(item.createdAt), 
              }));
            };
        const transformedData = transformData(data);
        setChartData(transformedData);
        setFilteredData(transformedData);
        console.log("Data from API:", transformedData);
      };


      useEffect(() => {
        const filterData = () => {
          let data = chartData;
          console.log("Start Date:", startDate);
          console.log("End Date:", endDate);
          console.log("Data Before Filtering:", chartData);
          // Filtro por nombre del producto
          if (selectedProduct) {
            data = data.filter((item) => item.name === selectedProduct);
          }
    
          // Filtro por rango de fechas
          if (startDate) {
            data = data.filter((item) => item.createdAt >= startDate); 
            console.log("Filtered data (after startDate):", data);
          }
          if (endDate) {
            data = data.filter((item) => item.createdAt <= endDate);
            console.log("Filtered data (after endDate):", data);
          }
    
          setFilteredData(data);
          
        };
    
        filterData();
      }, [selectedProduct, startDate, endDate, chartData]);
      
      const getUniqueProducts = () => {
        const products = chartData.map((item) => item.name);
        return [...new Set(products)]; // Eliminar duplicados
      };
    const handleCreateProduction = async () => {
        await ProductionService.createProduction(newProduction, token);
        fetchProductions(token);
    };

    const handleDeleteProduction = async (id) => {
        await ProductionService.deleteProduction(id, token);
        fetchProductions(token);
    };

    const handleEdit = (production) => {
        setEditingProductionId(production.productionId);
        setUpdatedData({
            productId: production.productId,
            measure_type: production.measure_type,
            quantity: production.quantity,
        });
    };

    const handleUpdateProduction = async (id) => {
        await ProductionService.updateProduction(id, updatedData, token);
        setEditingProductionId(null); // Salir del modo de edición
        fetchProductions(token); // Actualizar la lista de producciones
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <Container>
            <Navbar />
            <h1>Producción</h1>

            {/* Formulario para añadir nueva producción */}
            <TextField
                select
                variant="outlined"
                value={newProduction.productId}
                onChange={(e) => setNewProduction({ ...newProduction, productId: e.target.value })}
                fullWidth
                margin="normal"
                SelectProps={{
                    native: true,
                }}
            >
                <option value="">Seleccione un producto</option>
                {availableProducts.map((product) => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                ))}
            </TextField>
            <TextField
                select
                variant="outlined"
                value={newProduction.measure_type}
                onChange={(e) => setNewProduction({ ...newProduction, measure_type: e.target.value })}
                fullWidth
                margin="normal"
                SelectProps={{
                    native: true,
                }}>
                <option value="">Seleccione tipo de medida</option>               
                <option value="Kilo">Kilo</option>
                <option value="Unidad">Unidad</option>
            </TextField>
            <TextField
                label="Cantidad"
                variant="outlined"
                type="number"
                value={newProduction.quantity}
                onChange={(e) => setNewProduction({ ...newProduction, quantity: parseInt(e.target.value) })}
                fullWidth
                margin="normal"
            />
            <Button onClick={handleCreateProduction} variant="contained" color="primary" sx={{textTransform:'none'}}>
                Añadir producción
            </Button>

            {/* Tabla de Producciones */}
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Producto</TableCell>
                        <TableCell>Tipo de medida</TableCell>
                        <TableCell>Cantidad</TableCell>
                        <TableCell>Fecha</TableCell>
                        <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {productions.map((production) => (
                        <TableRow key={production.productionId}>
                            <TableCell>{production.productionId}</TableCell>
                            <TableCell>
                                {editingProductionId === production.productionId ? (
                                    <TextField
                                        select
                                        variant="outlined"
                                        value={updatedData.productId}
                                        name="productId"
                                        onChange={handleChange}
                                        fullWidth
                                        SelectProps={{
                                            native: true,
                                        }}
                                    >
                                        <option value="">Seleccione un producto</option>
                                        {availableProducts.map((product) => (
                                            <option key={product.id} value={product.id}>{product.name}</option>
                                        ))}
                                    </TextField>
                                ) : (
                                    production.productId
                                )}
                            </TableCell>
                            <TableCell>
                                {editingProductionId === production.productionId ? (
                                    <TextField
                                        select
                                        variant="outlined"
                                        value={updatedData.measure_type}
                                        name="measure_type"
                                        onChange={handleChange}
                                        fullWidth
                                        SelectProps={{
                                            native: true,
                                        }}
                                    >
                                        <option value="">Seleccione tipo de medida</option>               
                                        <option value="Kilo">Kilo</option>
                                        <option value="Unidad">Unidad</option>
                                    </TextField>
                                ) : (
                                    production.measure_type
                                )}
                            </TableCell>
                            <TableCell>
                                {editingProductionId === production.productionId ? (
                                    <TextField
                                        variant="outlined"
                                        type="number"
                                        value={updatedData.quantity}
                                        name="quantity"
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                ) : (
                                    production.quantity
                                )}
                            </TableCell>
                            <TableCell>{new Date(production.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                                {editingProductionId === production.productionId ? (
                                    <Button onClick={() => handleUpdateProduction(production.productionId)} variant="contained" color="primary" sx={{textTransform:'none'}}>
                                        Aplicar
                                    </Button>
                                ) : (
                                    <IconButton color="primary" aria-label="edit" onClick={() => handleEdit(production)}>
                                        <Edit />
                                    </IconButton>
                                )}
                                <IconButton color="secondary" aria-label="delete" onClick={() => handleDeleteProduction(production.productionId)}>
                                    <Delete />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            
            <div>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <select onChange={(e) => setSelectedProduct(e.target.value)} value={selectedProduct}>
          <option value="">Todos los productos</option>
          {getUniqueProducts().map((product) => (
            <option key={product} value={product}>
              {product}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Fecha de inicio"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="Fecha de fin"
        />
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="quantity" fill="#8884d8" name={("Cantidad")} />
        </BarChart>
      </ResponsiveContainer>
    </div>
        </Container>
    );
}