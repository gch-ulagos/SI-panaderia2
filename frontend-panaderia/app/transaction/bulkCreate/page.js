"use client";
import React, { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  AlertTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Navbar from "../../../components/Navbar";
import ProductService from "@/services/ProductService";
import TransactionService from "@/services/TransactionService";
import { useRouter } from "next/navigation";

export default function BulkCreateTransactions() {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorMessages, setErrorMessages] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const data = await ProductService.getProducts(token);
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setErrorMessage("Error al obtener productos");
      }
    };

    fetchProducts();
  }, []);

  const handleInputChange = (index, field, value) => {
    const updatedTransactions = [...transactions];
    const updatedErrorMessages = { ...errorMessages };

    if (field === "quantity") {
      const transaction = updatedTransactions[index];
      let isValid = true;
      let error = "";

      if (transaction.measure_type === "Unidad") {
        if (!/^\d+$/.test(value)) {
          isValid = false;
          error = "Solo números enteros permitidos.";
        }
      } else if (transaction.measure_type === "Kilo") {
        if (!/^\d*\.?\d*$/.test(value)) {
          isValid = false;
          error = "Solo números válidos permitidos.";
        }
      }

      if (!isValid) {
        updatedErrorMessages[index] = error;
        value = transaction.quantity || "";
      } else {
        delete updatedErrorMessages[index];
      }

      updatedTransactions[index][field] = value;
    } else if (field === "id_product") {
      const selectedProduct = products.find((product) => product.id === parseInt(value));
      if (selectedProduct) {
        updatedTransactions[index].name = selectedProduct.name;
        updatedTransactions[index].price = selectedProduct.price;
        updatedTransactions[index].measure_type = selectedProduct.measure_type;
      }
    }

    updatedTransactions[index][field] = value;
    setTransactions(updatedTransactions);
    setErrorMessages(updatedErrorMessages);
  };

  const calculateTotalPrice = () => {
    return transactions.reduce((acc, transaction) => {
      const quantity =
        transaction.measure_type === "unidad"
          ? parseInt(transaction.quantity || 0)
          : parseFloat(transaction.quantity || 0);
      return acc + quantity * (transaction.price || 0);
    }, 0);
  };

  const addRow = () => {
    setTransactions([
      ...transactions,
      { id_product: "", name: "", transaction_type: "Venta", quantity: "", price: 0, measure_type: "" },
    ]);
  };

  const deleteRow = (index) => {
    const updatedTransactions = transactions.filter((_, i) => i !== index);
    setTransactions(updatedTransactions);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      const formattedTransactions = transactions.map((transaction) => ({
        ...transaction,
        quantity:
          transaction.measure_type === "unidad"
            ? parseInt(transaction.quantity)
            : parseFloat(transaction.quantity),
      }));

      await TransactionService.bulkCreateTransactions(formattedTransactions, token);
      setSuccessMessage("Transacciones creadas exitosamente");
      setErrorMessage(null);
      setTransactions([]);
      router.push("/transaction");
    } catch (error) {
      setErrorMessage(error.message || "Error al crear transacciones");
      setSuccessMessage(null);
    }
  };

  return (
    <Container>
      <Navbar />
      <Typography variant="h4" gutterBottom>
        Creación masiva de transacciones
      </Typography>
      {successMessage && (
        <Alert severity="success">
          <AlertTitle>Exitoso</AlertTitle>
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {errorMessage}
        </Alert>
      )}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID producto</TableCell>
            <TableCell>Nombre del producto</TableCell>
            <TableCell>Tipo de transacción</TableCell>
            <TableCell>Cantidad</TableCell>
            <TableCell>Precio total</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction, index) => (
            <TableRow key={index}>
              <TableCell style={{ width: "15%" }}>
                <TextField
                  fullWidth
                  required
                  value={transaction.id_product}
                  onChange={(e) => handleInputChange(index, "id_product", e.target.value)}
                  list="product-ids"
                  type="number"
                />
                <datalist id="product-ids">
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.id} - {product.name}
                    </option>
                  ))}
                </datalist>
              </TableCell>
              <TableCell>
                <TextField fullWidth disabled value={transaction.name} />
              </TableCell>
              <TableCell>
                <Select
                  fullWidth
                  required
                  value={transaction.transaction_type}
                  onChange={(e) => handleInputChange(index, "transaction_type", e.target.value)}
                >
                  <MenuItem value="Compra">Compra</MenuItem>
                  <MenuItem value="Venta">Venta</MenuItem>
                </Select>
              </TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  required
                  type="text"
                  value={transaction.quantity}
                  onChange={(e) => handleInputChange(index, "quantity", e.target.value)}
                  error={!!errorMessages[index]}
                  helperText={errorMessages[index] || ""}
                />
              </TableCell>
              <TableCell>
                <TextField fullWidth disabled value={transaction.price} />
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => deleteRow(index)}
                  sx={{ textTransform: "none" }}
                >
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={5} align="right">
              <Typography variant="h6">
                Precio total: {calculateTotalPrice().toFixed(2)}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Button variant="contained" color="primary" onClick={addRow} sx={{ textTransform: "none" }}>
        Añadir fila
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ textTransform: "none" }}
        style={{ marginLeft: "16px" }}
        disabled={calculateTotalPrice() <= 0}
      >
        Crear transacciones
      </Button>
    </Container>
  );
}
