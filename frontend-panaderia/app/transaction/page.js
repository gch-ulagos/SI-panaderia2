"use client";
import React, { useEffect, useState } from "react";
import { Container, Table, TableBody, TableCell, TableHead, TableRow, TextField, Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { Delete } from "@mui/icons-material";
import Navbar from "../../components/Navbar";
import TransactionService from "@/services/TransactionService";
import { useRouter } from "next/navigation";

export default function TransactionsPage() {
    const router = useRouter();
    const [ghostTransactions, setGhostTransactions] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

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

    const filteredData = {
        transaction: Array.isArray(ghostTransactions.transaction) ? 
            ghostTransactions.transaction.filter((transaction) =>
                transaction.id.toString().includes(searchTerm)
            ) : [],
        transactionTotals: ghostTransactions.transactionTotals || [],
    };

    return (
        <Container>
            <Navbar />
            <h1>Gestión de Transacciones</h1>
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
                            <TableCell>{ghostTransaction.createdAt}</TableCell>
                            <TableCell>-</TableCell>
                            <TableCell>
                                <IconButton
                                    color="primary"
                                    aria-label={"Eliminar transacción " + ghostTransaction.id}
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
        </Container>
    );
}
