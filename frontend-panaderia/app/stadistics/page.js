"use client";

import React, { useEffect, useState } from "react";
import {
    Container,Table,TableBody,TableCell,TableHead,TableRow,TextField,Button,IconButton,Dialog,DialogTitle,DialogContent,DialogActions,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import Navbar from "../../components/Navbar";
import TransactionService from "@/services/TransactionService";
import ProductService from "@/services/ProductService";

import { useRouter } from "next/navigation";

import {
    BarChart,
    AreaChart,
    Area,
    Bar,
    Line,
    LineChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } from 'recharts';

export default function TransactionsPage() {
    const router = useRouter();
    const [ghostTransactions, setGhostTransactions] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [allProductDetail, setAllProductDetail] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
        }
        fetchGhostTransactions(token);
        fetchAllProducts(token);
        fetchAllProductDetail(token);
    }, []);

    const fetchGhostTransactions = async (token) => {
        try {
            const data = await TransactionService.getGhostTransactions(token);
            setGhostTransactions(data || []);
        } catch (e) {
            console.error("Error fetching ghost transactions", e);
        }
    };

    const fetchAllProductDetail = async (token) => {
        try {
            const data = await ProductService.getProducts(token);
            setAllProductDetail(data || []);
            console.log(data);
        } catch (e) {
            console.error("Error fetching product details", e);
        }
    };

    const fetchAllProducts = async (token) => {
        try {
            const data = await TransactionService.getAllTransactions(token);
            setAllProducts(data || []);
            console.log(data);
        } catch (e) {
            console.error("Error fetching products", e);
        }
    };

    const handleDeleteTransaction = async (id) => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }
        try {
            await TransactionService.deleteTransaction(id, token);
            setGhostTransactions((prevState) => ({
                ...prevState,
                transaction: prevState.transaction.filter((transaction) => transaction.id !== id),
            }));
            setDeleteDialogOpen(false);
        } catch (e) {
            console.error(`Error deleting transaction with ID ${id}`, e);
        }
    };

    const openDeleteDialog = (id) => {
        setTransactionToDelete(id);
        setDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setTransactionToDelete(null);
        setDeleteDialogOpen(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    };

    const filteredData = {
        transaction: Array.isArray(ghostTransactions.transaction)
            ? ghostTransactions.transaction.filter((transaction) =>
                transaction.id.toString().includes(searchTerm),
                
            )
            : [],
        transactionTotals: ghostTransactions.transactionTotals || [],
    };

    return (
        <Container>
            <Navbar />
            <h1>Estadisticas de transacciones</h1>
            <Button onClick={() => router.push("/inventory")} sx={{ textTransform: "none" }}>
                Inventario
            </Button>


            <TextField
                label="Buscar por ID de transacción"
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
                                    <TableCell>Tipo de transacción</TableCell>
                                    <TableCell>Items</TableCell>
                                    <TableCell>Tipo de medida</TableCell>
                                    <TableCell>Cantidad</TableCell>
                                    
                                    <TableCell>Valor</TableCell>
                                    <TableCell>Fecha</TableCell>
                                    
                                </TableRow>
                            </TableHead>
                <TableBody>
                    {filteredData.transaction.map((ghostTransaction) => (
                        <React.Fragment key={ghostTransaction.id}>
                            <TableRow>
                                <TableCell>{ghostTransaction.id}</TableCell>
                                <TableCell>{ghostTransaction.transaction_type}</TableCell>
                                <TableCell>{allProducts
                                            .filter((product) => product.id_transactions === ghostTransaction.id)
                                            .map((product, index) => (
                                                <li key={index}>
                                                    {product.product.name}
                                                </li>
                                            ))}</TableCell>
                                <TableCell>{allProducts
                                            .filter((product) => product.id_transactions === ghostTransaction.id)
                                            .map((product, index) => (
                                                <li key={index}>
                                                    {product.product.measure_type}
                                                </li>
                                            ))}</TableCell>
                                <TableCell>{allProducts
                                            .filter((product) => product.id_transactions === ghostTransaction.id)
                                            .map((product, index) => (
                                                <li key={index}>
                                                    {product.quantity}
                                                </li>
                                            ))}</TableCell>
                                <TableCell>${allProducts
                                            .filter((product) => product.id_transactions === ghostTransaction.id)
                                            .reduce((sum, product) => sum + product.price * product.quantity, 0)}</TableCell>
                                <TableCell>{formatDate(ghostTransaction.createdAt)}</TableCell>
                                <TableCell>
                                </TableCell>
                            </TableRow>
                        </React.Fragment>
                        
                    ))}
                </TableBody>
                        </Table>

      <ResponsiveContainer width="100%" height={400}>

      <h1>Estadisticas de Venta</h1>
<BarChart data={allProducts
    .filter((product) => product.transaction_type === "Venta")}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="product.name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="price" fill="#8884d8" name={("Valor transaccion")} />
        </BarChart>

    <h1>Estadisticas de Compra</h1>

        <BarChart data={allProducts
    .filter((product) => product.transaction_type === "Compra")}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="product.name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="price" fill="#8884d8" name={("Valor transaccion")} />
        </BarChart>
      </ResponsiveContainer>
        </Container>
    );
}
