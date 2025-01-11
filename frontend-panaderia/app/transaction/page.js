"use client";

import React, { useEffect, useState } from "react";
import {
    Container,Table,TableBody,TableCell,TableHead,TableRow,TextField,Button,IconButton,Dialog,DialogTitle,DialogContent,DialogActions,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import Navbar from "../../components/Navbar";
import TransactionService from "@/services/TransactionService";
import { useRouter } from "next/navigation";

export default function TransactionsPage() {
    const router = useRouter();
    const [ghostTransactions, setGhostTransactions] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
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
    }, []);

    const fetchGhostTransactions = async (token) => {
        try {
            const data = await TransactionService.getGhostTransactions(token);
            setGhostTransactions(data || []);
        } catch (e) {
            console.error("Error fetching ghost transactions", e);
        }
    };

    const fetchAllProducts = async (token) => {
        try {
            const data = await TransactionService.getAllTransactions(token);
            setAllProducts(data || []);
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
                transaction.id.toString().includes(searchTerm)
            )
            : [],
        transactionTotals: ghostTransactions.transactionTotals || [],
    };

    return (
        <Container>
            <Navbar />
            <h1>Gestión de transacciones</h1>
            <Button onClick={() => router.push("/inventory")} sx={{ textTransform: "none" }}>
                Inventario
            </Button>
            <Button onClick={() => router.push("/transaction/bulkCreate")} sx={{ textTransform: "none" }}>
                Insertar transacción
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
                        <TableCell>Tipo</TableCell>
                        <TableCell>Fecha</TableCell>
                        <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredData.transaction.map((ghostTransaction) => (
                        <React.Fragment key={ghostTransaction.id}>
                            <TableRow>
                                <TableCell>{ghostTransaction.id}</TableCell>
                                <TableCell>{ghostTransaction.transaction_type}</TableCell>
                                <TableCell>{formatDate(ghostTransaction.createdAt)}</TableCell>
                                <TableCell>
                                    <IconButton
                                        color="primary"
                                        aria-label={`Eliminar transacción ${ghostTransaction.id}`}
                                        onClick={() => openDeleteDialog(ghostTransaction.id)}
                                    >
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={5}>
                                    <strong>Productos asociados:</strong>
                                    <ul>
                                        {allProducts
                                            .filter((product) => product.id_transactions === ghostTransaction.id)
                                            .map((product, index) => (
                                                <li key={index}>
                                                    Producto ID: {product.id_product}, Precio: {product.price}, Cantidad: {product.quantity}
                                                </li>
                                            ))}
                                    </ul>
                                    <strong>
                                        Precio total: $
                                        {allProducts
                                            .filter((product) => product.id_transactions === ghostTransaction.id)
                                            .reduce((sum, product) => sum + product.price * product.quantity, 0)}
                                    </strong>
                                </TableCell>
                            </TableRow>
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>

            {/* Dialog de Confirmación */}
            <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
                <DialogTitle>Confirmar eliminación</DialogTitle>
                <DialogContent>
                    ¿Estás seguro de que deseas eliminar esta transacción?
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDeleteDialog} color="secondary" sx={{ textTransform: "none" }}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={() => handleDeleteTransaction(transactionToDelete)} color="primary" sx={{ textTransform: "none" }}>
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
