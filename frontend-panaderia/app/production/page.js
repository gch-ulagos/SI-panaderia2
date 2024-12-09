"use client";
import React, { useEffect, useState } from 'react';
import { Container, Table, TableHead, TableRow, TableCell, TableBody, Button, IconButton, TextField, MenuItem } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import ProductionService from '@/services/ProductionService';
import ProductService from '@/services/ProductService';
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

export default function Production() {
    const [productions, setProductions] = useState([]);
    const [filteredProductions, setFilteredProductions] = useState([]);
    const [newProduction, setNewProduction] = useState({ productId: '', measure_type: '', quantity: 0 });
    const [token, setToken] = useState('');
    const [availableProducts, setAvailableProducts] = useState([]);
    const [editingProductionId, setEditingProductionId] = useState(null);
    const [updatedData, setUpdatedData] = useState({});
    const [selectedDate, setSelectedDate] = useState('');
    const [nameFilter, setNameFilter] = useState('');
    const router = useRouter();
    const [chartData, setChartData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startDateError, setStartDateError] = useState(false);
    const [endDateError, setEndDateError] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
        fetchProductions(storedToken);
        fetchProductsForProduction(storedToken);
        loadChartData(storedToken);
        
    }, []);

    useEffect(() => {
        const filtered = productions.filter((production) => {
            const productionDate = new Date(production.createdAt);
            const productionDateOnly = new Date(productionDate.setHours(0, 0, 0, 0));
    
            const startDateOnly = startDate ? new Date(startDate + 'T00:00:00') : null;
            const endDateOnly = endDate ? new Date(endDate + 'T23:59:59') : null;
    
            const matchesDate =
                (!startDate || productionDateOnly >= startDateOnly) && 
                (!endDate || productionDateOnly <= endDateOnly);
    
            const matchesName = !nameFilter || (production.productId && production.productId.toLowerCase().includes(nameFilter.toLowerCase()));
    
            return matchesDate && matchesName;
        });
    
        setFilteredProductions(filtered);
    }, [startDate, endDate, nameFilter, productions]);
    

    const fetchProductions = async (token) => {
        const data = await ProductionService.getAllProductions(token);
        setProductions(data);
        setFilteredProductions(data);
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
        const transformedData = filteredProductions.map(item => ({
            name: item.productId,
            quantity: item.quantity,
            createdAt: new Date(item.createdAt).toLocaleDateString(),
        }));
        setFilteredData(transformedData);
    }, [filteredProductions]);  
      
      const getUniqueProducts = () => {
        const products = chartData.map((item) => item.name);
        return [...new Set(products)]; 
      };

    const handleCreateProduction = async () => {
        try {
            await ProductionService.createProduction(newProduction, token);
            fetchProductions(token);
            setNewProduction({ productId: '', measure_type: '', quantity: 0 });
        } catch (error) {
            console.error('Error al crear producción:', error);
        }
    };

    const handleDeleteProduction = async (id) => {
        try {
            await ProductionService.deleteProduction(id, token);
            fetchProductions(token);
        } catch (error) {
            console.error('Error al eliminar producción:', error);
        }
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
        try {
            await ProductionService.updateProduction(id, updatedData, token);
            setEditingProductionId(null);
            fetchProductions(token);
        } catch (error) {
            console.error('Error al actualizar producción:', error);
        }
    };

    const DownloadAllProduccions = async () => {
        try {
            await ExcelService.getAllProduccions(token);
        } catch (error) {
            console.error("Error al descargar producciones:", error);
        }
    };

    const startDateOnly = startDate ? new Date(startDate + 'T00:00:00') : null;
    const endDateOnly = endDate ? new Date(endDate + 'T23:59:59') : null;

    const DownloadFilteredProduccions = async () => {
        try {
            let url = `http://localhost:3001/api/v1/Excel/getFilteredProduccions`;
            const queryParams = {};
            if (nameFilter) {
                queryParams.name = nameFilter;
            }
            if (startDate && endDate) {
                queryParams.minCreatedAt = startDateOnly.toISOString().split('T')[0];
                queryParams.maxCreatedAt = endDateOnly.toISOString().split('T')[0];

                console.log("fecha i: ", startDateOnly);
                console.log("fecha f: ", endDateOnly);
            }
            const queryString = new URLSearchParams(queryParams).toString();
            if (queryString) {
                url += `?${queryString}`;
            }

            console.log("URL generada para la descarga:", url);
            await ExcelService.getFilteredProduccions(url, token);
        } catch (error) {
            console.error("Error al descargar producciones filtradas:", error);
        }
    };

    const handleClearFilter = () => {
        setSelectedDate('');
        setNameFilter('');
        setFilteredProductions(productions);
    };

    return (
        <Container>
            <Navbar />
            <h1>Producción</h1>
            <TextField
                select
                label="Seleccione un producto"
                variant="outlined"
                value={newProduction.productId}
                onChange={(e) => setNewProduction({ ...newProduction, productId: e.target.value })}
                fullWidth
                margin="normal"
            >
                {availableProducts.map((product) => (
                    <MenuItem key={product.id} value={product.id}>{product.name}</MenuItem>
                ))}
            </TextField>
            <TextField
                select
                label="Seleccione tipo de medida"
                variant="outlined"
                value={newProduction.measure_type}
                onChange={(e) => setNewProduction({ ...newProduction, measure_type: e.target.value })}
                fullWidth
                margin="normal"
            >
                <MenuItem value="Kilo">Kilo</MenuItem>
                <MenuItem value="Unidad">Unidad</MenuItem>
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
            <Button onClick={handleCreateProduction} variant="contained" color="primary" sx={{ textTransform: 'none' }}>
                Añadir producción
            </Button>
            <div style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
            <TextField
                label="Fecha inicio"
                type="date"
                value={startDate}
                onChange={(e) => {
                    const today = new Date();
                    const selectedStartDate = new Date(e.target.value);

                    if (!e.target.value || isNaN(selectedStartDate.getTime()) || selectedStartDate > today) {
                        setStartDateError(true);
                    } else {
                        setStartDateError(false);
                    }
                    setStartDate(e.target.value);
                }}
                onKeyUp={() => {
                    const today = new Date();
                    const selectedStartDate = new Date(startDate);

                    if (!startDate || isNaN(selectedStartDate.getTime()) || selectedStartDate > today) {
                        setStartDateError(true);
                    } else {
                        setStartDateError(false);
                    }
                }}
                InputLabelProps={{
                    shrink: true,
                }}
                error={startDateError}
                helperText={
                    startDateError && startDate
                        ? isNaN(new Date(startDate).getTime())
                            ? 'Fecha no válida'
                            : 'La fecha no puede ser superior al día de hoy'
                        : ''
                }
            />
            <TextField
                label="Fecha fin"
                type="date"
                value={endDate}
                onChange={(e) => {
                    const selectedEndDate = new Date(e.target.value);

                    if (!e.target.value || isNaN(selectedEndDate.getTime()) || selectedEndDate < new Date(startDate)) {
                        setEndDateError(true);
                    } else {
                        setEndDateError(false);
                    }
                    setEndDate(e.target.value);
                }}
                onKeyUp={() => {
                    const selectedEndDate = new Date(endDate);

                    if (!endDate || isNaN(selectedEndDate.getTime()) || selectedEndDate < new Date(startDate)) {
                        setEndDateError(true);
                    } else {
                        setEndDateError(false);
                    }
                }}
                InputLabelProps={{
                    shrink: true,
                }}
                error={endDateError}
                helperText={
                    endDateError && endDate
                        ? isNaN(new Date(endDate).getTime())
                            ? 'Fecha no válida'
                            : 'La fecha de fin no puede ser antes de la fecha de inicio'
                        : ''
                }
            />
            <Button
                onClick={() => {
                    setStartDate('');
                    setEndDate('');
                    setStartDateError(false);
                    setEndDateError(false);
                }}
                variant="outlined"
                color="secondary"
                style={{ textTransform: 'none' }}
            >
                Limpiar filtro
            </Button>
        </div>
            <Button variant="contained" color="primary" onClick={DownloadAllProduccions} style={{ margin: "10px", textTransform: 'none' }}>
                Descargar todas las producciones
            </Button>
            <Button
                variant="contained"
                color="secondary"
                onClick={DownloadFilteredProduccions}
                style={{ margin: "10px", textTransform: 'none' }}
                disabled={startDateError || endDateError || !startDate || !endDate}
            >
            Descargar producciones filtradas
            </Button>
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
                    {filteredProductions.map((production) => (
                        <TableRow key={production.productionId}>
                            <TableCell>{production.productionId}</TableCell>
                            <TableCell>{production.productId}</TableCell>
                            <TableCell>{production.measure_type}</TableCell>
                            <TableCell>{production.quantity}</TableCell>
                            <TableCell>{new Date(production.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                                {editingProductionId === production.productionId ? (
                                    <Button
                                        onClick={() => handleUpdateProduction(production.productionId)}
                                        variant="contained"
                                        color="primary"
                                    >
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
