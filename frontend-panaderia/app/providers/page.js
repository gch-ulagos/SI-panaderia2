"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  AlertTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Switch,
} from "@mui/material";
import { Edit, Delete, Check } from "@mui/icons-material";
import Navbar from "../../components/Navbar";
import ProviderService from "../../services/ProviderService";
import { useRouter } from "next/navigation";

export default function ManageProveedores() {
  const router = useRouter();
  const [proveedores, setProveedores] = useState([]);
  const [newProveedor, setNewProveedor] = useState({ empresa: "", contacto: "" });
  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchProveedores = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await ProviderService.getAllProveedores(token);
      setProveedores(data || []);
    } catch (error) {
      console.error("Error fetching proveedores:", error);
      setErrorMessage("Error al obtener proveedores");
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  const addProveedor = async () => {
    const { empresa, contacto } = newProveedor;
    if (!empresa || !contacto.match(/^\d+$/)) {
      setErrorMessage("Asegúrese de llenar todos los campos correctamente.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await ProviderService.createProveedor(newProveedor, token);
      setSuccessMessage(response.message);
      setErrorMessage(null);
      setNewProveedor({ empresa: "", contacto: "" });
      fetchProveedores();
    } catch (error) {
      setErrorMessage("Error al crear proveedor");
      setSuccessMessage(null);
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const token = localStorage.getItem("token");
      const response = await ProviderService.updateProveedor(id, { estado: !estadoActual }, token);
      setSuccessMessage(response.message);
      setErrorMessage(null);
      fetchProveedores();
    } catch (error) {
      setErrorMessage("Error al actualizar el estado del proveedor");
      setSuccessMessage(null);
    }
  };

  const updateProveedor = async (id) => {
    if (!selectedProveedor) return;
    try {
      const token = localStorage.getItem("token");
      const response = await ProviderService.updateProveedor(id, selectedProveedor, token);
      setSuccessMessage(response.message);
      setErrorMessage(null);
      fetchProveedores();
      setSelectedProveedor(null);
    } catch (error) {
      setErrorMessage("Error al actualizar proveedor");
      setSuccessMessage(null);
    }
  };

  const handleEditClick = (proveedor) => {
    if (selectedProveedor?.id === proveedor.id) {
      updateProveedor(proveedor.id);
    } else {
      setSelectedProveedor(proveedor);
    }
  };

  const deleteProveedor = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await ProviderService.deleteProveedor(id, token);
      setSuccessMessage(response.message);
      setErrorMessage(null);
      fetchProveedores();
    } catch (error) {
      console.error("Error details:", error);
      const errorMessage = error.response?.data || "Error al eliminar el proveedor";
      setErrorMessage(errorMessage);
      setSuccessMessage(null);
    }
  };

  return (
    <Container>
      <Navbar />
      <Typography variant="h4" gutterBottom>
        Proveedores
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

      {/* Formulario para agregar un nuevo proveedor */}
      <div style={{ marginBottom: "20px" }}>
        <TextField
          label="Nombre de la empresa"
          value={newProveedor.empresa}
          onChange={(e) => setNewProveedor({ ...newProveedor, empresa: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Contacto (solo números)"
          value={newProveedor.contacto}
          onChange={(e) => setNewProveedor({ ...newProveedor, contacto: e.target.value })}
          fullWidth
          margin="normal"
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={addProveedor}
          style={{ textTransform: "none", marginTop: "10px" }}
        >
          Agregar proveedor
        </Button>
      </div>

      {/* Tabla de proveedores */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Contacto</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {proveedores.map((proveedor) => (
            <TableRow key={proveedor.id}>
              <TableCell>{proveedor.id}</TableCell>
              <TableCell>
                {selectedProveedor && selectedProveedor.id === proveedor.id ? (
                  <TextField
                    fullWidth
                    value={selectedProveedor.empresa}
                    onChange={(e) =>
                      setSelectedProveedor({ ...selectedProveedor, empresa: e.target.value })
                    }
                  />
                ) : (
                  proveedor.empresa
                )}
              </TableCell>
              <TableCell>
                {selectedProveedor && selectedProveedor.id === proveedor.id ? (
                  <TextField
                    fullWidth
                    value={selectedProveedor.contacto}
                    onChange={(e) =>
                      setSelectedProveedor({ ...selectedProveedor, contacto: e.target.value })
                    }
                  />
                ) : (
                  proveedor.contacto
                )}
              </TableCell>
              <TableCell>
                {selectedProveedor && selectedProveedor.id === proveedor.id ? (
                  <Switch
                    checked={selectedProveedor.estado}
                    onChange={() =>
                      setSelectedProveedor({
                        ...selectedProveedor,
                        estado: !selectedProveedor.estado,
                      })
                    }
                    color="primary"
                  />
                ) : (
                  proveedor.estado ? "Activo" : "Inactivo"
                )}
              </TableCell>
              <TableCell>
                <IconButton
                  color="primary"
                  onClick={() => handleEditClick(proveedor)}
                >
                  {selectedProveedor && selectedProveedor.id === proveedor.id ? (
                    <Check />
                  ) : (
                    <Edit />
                  )}
                </IconButton>
                <IconButton color="error" onClick={() => deleteProveedor(proveedor.id)}>
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
