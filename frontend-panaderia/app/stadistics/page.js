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
} from "@mui/material";
import Navbar from "../../components/Navbar";
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
      processChartData(allProducts, groupBy);
    }
  }, [allProducts, startDate, endDate, groupBy]);

  useEffect(() => {
    filterTransactions();
  }, [startDate, endDate, filterType, searchTerm]);

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

      // Filtro de fechas
      if (startDate && new Date(createdAt) < new Date(startDate)) return;
      if (endDate && new Date(createdAt) > new Date(endDate)) return;

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
    const filtered = ghostTransactions.transaction?.filter((transaction) => {
      const transactionDate = new Date(transaction.createdAt);
      const isWithinDateRange =
        (!startDate || transactionDate >= new Date(startDate)) &&
        (!endDate || transactionDate <= new Date(endDate));

      const isMatchingType =
        filterType === "all" || transaction.transaction_type === filterType;

      const isMatchingSearchTerm =
        !searchTerm ||
        transaction.product.name.toLowerCase().includes(searchTerm.toLowerCase());

      return isWithinDateRange && isMatchingType && isMatchingSearchTerm;
    });

    setGhostTransactions({ transaction: filtered });
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
      <h1>Estadísticas de Transacciones</h1>
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
            <MenuItem value="product">Por Producto</MenuItem>
            <MenuItem value="category">Por Categoría</MenuItem>
          </Select>

          <Select
            value={filterType}
            onChange={(e) => handleFilterChange(e.target.value)}
            fullWidth
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="Venta">Ventas</MenuItem>
            <MenuItem value="Compra">Compras</MenuItem>
          </Select>

          {/* Filtros de fecha */}
          <TextField
            label="Fecha inicio"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label="Fecha fin"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />

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
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index % 2 === 0 ? COLORS[0] : COLORS[1]}
                  />
                ))}
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
          <h2>Tabla de Transacciones</h2>
          <TextField
            label="Buscar por Nombre de Producto"
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
                    $$
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
