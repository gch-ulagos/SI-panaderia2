"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Grid,
  Select,
  MenuItem,
  Button
} from "@mui/material";
import Navbar from "../../components/Navbar";
import ExcelService from "@/services/ExcelService";
import TransactionService from "@/services/TransactionService";
import CategoryService from "@/services/CategoryService";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { useRouter } from "next/navigation";

export default function TransactionsPage() {
  const router = useRouter();
  const [ghostTransactions, setGhostTransactions] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [groupBy, setGroupBy] = useState("product");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDateError, setStartDateError] = useState(false);
  const [endDateError, setEndDateError] = useState(false);

  const [originalGhostTransactions, setOriginalGhostTransactions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
    fetchGhostTransactions(token);
    fetchAllProducts(token);
    fetchCategories(token);
  }, []);

  useEffect(() => {
    if (allProducts.length > 0) {
      processChartData(allProducts, groupBy, filterType);
    }
  }, [allProducts, startDate, endDate, groupBy, filterType]);
  

  useEffect(() => {
    filterTransactions();
  }, [startDate, endDate, filterType, searchTerm]);

  const fetchGhostTransactions = async (token) => {
    try {
      const data = await TransactionService.getGhostTransactions(token);
      setOriginalGhostTransactions(data || []);
      setGhostTransactions(data || []);
    } catch (e) {
      console.error("Error fetching ghost transactions", e);
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

  const fetchCategories = async (token) => {
    try {
      const data = await CategoryService.getAllCategories(token);
      setCategories(data || []);
    } catch (e) {
      console.error("Error fetching categories", e);
    }
  };

  const processChartData = (data, groupBy) => {
    const aggregatedData = {};

    data.forEach((product) => {
      const {
        transaction_type,
        product: { name, category } = {},
        quantity,
        price,
        createdAt,
      } = product;

      if (startDate && new Date(createdAt) < new Date(startDate)) return;
      if (endDate && new Date(createdAt) > new Date(endDate)) return;

      if (filterType !== "all" && transaction_type !== filterType) return;

      const key =
        groupBy === "product"
          ? name
          : categories.find((cat) => cat.id === category)?.name || "Desconocido";

      if (!aggregatedData[key]) {
        aggregatedData[key] = { name: key, Venta: 0, Compra: 0 };
      }
      if (transaction_type === "Venta") {
        aggregatedData[key].Venta += quantity * price;
      } else if (transaction_type === "Compra") {
        aggregatedData[key].Compra += quantity * price;
      }
    });

    setChartData(Object.values(aggregatedData));
  };

  const filterTransactions = () => {

    const matchingProducts = allProducts.filter(
      (product) =>
        product.product.name &&
        product.product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    const matchingTransactionIds = matchingProducts.map(
      (product) => product.id_transactions
    );

    const filtered = originalGhostTransactions.transaction?.filter((transaction) => {
      const transactionDate = new Date(transaction.createdAt);
      const isWithinDateRange =
        (!startDate || transactionDate >= new Date(startDate)) &&
        (!endDate || transactionDate <= new Date(endDate));

      const isMatchingType =
        filterType === "all" || transaction.transaction_type === filterType;

        const isMatchingSearchTerm =
        !searchTerm || matchingTransactionIds.includes(transaction.id);

      return isWithinDateRange && isMatchingType && isMatchingSearchTerm;
    });

    setGhostTransactions({ transaction: filtered });
  };

  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setStartDateError(false);
    setEndDateError(false);
    setFilterType("all");
    setSearchTerm("");
    setGhostTransactions(originalGhostTransactions);
  };

  const DownloadAllTransacciones = async () => {
    const token = localStorage.getItem("token");
        try {
            await ExcelService.getAllTransacciones(token);
        } catch (error) {
            console.error("Error al descargar producciones:", error);
        }
    };

  const handleGroupByChange = (value) => {
    setGroupBy(value);
    processChartData(allProducts, value);
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
  };

  const COLORS = ["#82ca9d", "#ff6565"];

  const filteredProducts = allProducts.filter((product) =>
    product.product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <Container>
      <Navbar />
      <h1>Estadísticas de transacciones</h1>
      <Grid container spacing={2}>
        {/* Gráficos */}
        <Grid item xs={12} sm={6}>
          <h2>Gráficos</h2>
          {/* Filtros */}
          <Select
            value={groupBy}
            onChange={(e) => handleGroupByChange(e.target.value)}
            fullWidth
            style={{ marginBottom: "1rem" }}
          >
            <MenuItem value="product">Por producto</MenuItem>
            <MenuItem value="category">Por categoría</MenuItem>
          </Select>

          <Select
            value={filterType}
            onChange={(e) => handleFilterChange(e.target.value)}
            fullWidth
          > 
            <MenuItem value="Venta">Ventas</MenuItem>
            <MenuItem value="Compra">Compras</MenuItem>
          </Select>

          {/* Filtros de fecha */}
          <TextField
            label="Fecha inicio"
            type="date"
            value={startDate || ""}
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
            fullWidth
            margin="normal"
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
            value={endDate || ""}
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
            fullWidth
            margin="normal"
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
            variant="outlined"
            color="secondary"
            onClick={resetFilters}
            style={{ marginTop: "10px", textTransform: "none" }}
          >
            Restablecer filtros
          </Button>
          <Button variant="contained" color="primary" onClick={DownloadAllTransacciones} style={{ margin: "10px", textTransform: 'none' }}>
                Descargar todas las transacciones
          </Button>

          {/* Gráfico circular */}
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey={filterType === "Venta" ? "Venta" : "Compra"}
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={(entry) => entry.name}
              >
                {chartData.map((entry, index) => {
                   return (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.Venta > 0 ? COLORS[0] : COLORS[1]}
                    />
                  );
                })}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          {/* Gráfico de barras */}
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Venta" fill={COLORS[0]} name="Ventas" />
              <Bar dataKey="Compra" fill={COLORS[1]} name="Compras" />
            </BarChart>
          </ResponsiveContainer>
        </Grid>

        {/* Tabla de transacciones */}
        <Grid item xs={12} sm={6}>
          <h2>Tabla de transacciones</h2>
          <TextField
            label="Buscar por nombre de producto"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
          />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Productos</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Fecha</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ghostTransactions.transaction?.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.id}</TableCell>
                  <TableCell>{transaction.transaction_type}</TableCell>
                  <TableCell>
                    {filteredProducts
                      .filter((product) => product.id_transactions === transaction.id)
                      .map((product, index) => (
                        <li key={index}>{product.product.name}</li>
                      ))}
                  </TableCell>
                  <TableCell>
                    {filteredProducts
                      .filter((product) => product.id_transactions === transaction.id)
                      .map((product, index) => (
                        <li key={index}>{product.quantity}</li>
                      ))}
                  </TableCell>
                  <TableCell>
                    $
                    {filteredProducts
                      .filter((product) => product.id_transactions === transaction.id)
                      .reduce((sum, product) => sum + product.quantity * product.price, 0)}
                  </TableCell>
                  <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </Container>
  );
}
