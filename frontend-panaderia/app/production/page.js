"use client";
import React, { useEffect, useState } from 'react';
import { Container, Table, TableHead, TableRow, TableCell, TableBody, Button, IconButton, TextField, MenuItem } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import ProductionService from '@/services/ProductionService';
import ProductService from '@/services/ProductService';
import ExcelService from "@/services/ExcelService";
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

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

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
        fetchProductions(storedToken);
        fetchProductsForProduction(storedToken);
    }, []);

    useEffect(() => {
        const filtered = productions.filter((production) => {
            const productionDate = production.createdAt ? new Date(production.createdAt).toISOString().split('T')[0] : '';
            const matchesDate = !selectedDate || productionDate === selectedDate;
            const matchesName = !nameFilter || (production.productId && production.productId.toLowerCase().includes(nameFilter.toLowerCase()));
            return matchesDate && matchesName;
        });
        setFilteredProductions(filtered);
    }, [selectedDate, nameFilter, productions]);
    

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

    const DownloadFilteredProduccions = async () => {
        try {
            let url = `http://localhost:3001/api/v1/Excel/getFilteredProduccions`;
            const queryParams = {};
            if (nameFilter) {
                queryParams.name = nameFilter;
            }
            if (selectedDate) {
                const minDate = selectedDate;
                const maxDate = new Date(selectedDate);
                maxDate.setDate(maxDate.getDate());
                queryParams.minCreatedAt = minDate;
                queryParams.maxCreatedAt = maxDate.toISOString().split('T')[0];
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
                    label="Fecha"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    label="Nombre"
                    variant="outlined"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                />
                <Button onClick={handleClearFilter} variant="outlined" color="secondary">
                    Limpiar Filtro
                </Button>
            </div>
            <Button variant="contained" color="primary" onClick={DownloadAllProduccions} style={{ margin: "10px", textTransform: 'none' }}>
                Descargar Todas las Producciones
            </Button>
            <Button variant="contained" color="secondary" onClick={DownloadFilteredProduccions} style={{ margin: "10px", textTransform: 'none' }}>
                Descargar Producciones Filtradas
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
        </Container>
    );
}
