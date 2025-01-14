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
import ClientService from "../../services/ClientService";
import { useRouter } from "next/navigation";

export default function ManageClientes() {
  const router = useRouter();
  const [Clientes, setClientes] = useState([]);
  const [newCliente, setnewCliente] = useState({ empresa: "", contacto: "" });
  const [selectedCliente, setselectedCliente] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchClientes = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await ClientService.getAllClientes(token);
      setClientes(data || []);
    } catch (error) {
      console.error("Error fetching clientes:", error);
      setErrorMessage("Error al obtener los clientes");
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const addCliente = async () => {
    const { nombre, direccion, contacto } = newCliente;
    if (!nombre || !direccion || !contacto || !/^\+?[0-9]{1,12}$/.test(contacto)) {
      setErrorMessage(
        "Por favor, completa todos los campos correctamente. El contacto debe iniciar opcionalmente con '+' y contener hasta 12 números."
      );
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await ClientService.createCliente(newCliente, token);
      setSuccessMessage(response.message);
      setErrorMessage(null);
      setnewCliente({ empresa: "", contacto: "" });
      fetchProveedores();
    } catch (error) {
      setErrorMessage("Error al crear cliente");
      setSuccessMessage(null);
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      const token = localStorage.getItem("token");
      const response = await ClientService.updateCliente(id, { estado: !estadoActual }, token);
      setSuccessMessage(response.message);
      setErrorMessage(null);
      fetchClientes();
    } catch (error) {
      setErrorMessage("Error al actualizar el estado del cliente");
      setSuccessMessage(null);
    }
  };

  const updateCliente = async (id) => {
    if (!selectedCliente) return;
    try {
      const token = localStorage.getItem("token");
      const response = await ClientService.updateCliente(id, selectedCliente, token);
      setSuccessMessage(response.message);
      setErrorMessage(null);
      fetchClientes();
      setselectedCliente(null);
    } catch (error) {
      setErrorMessage("Error al actualizar cliente");
      setSuccessMessage(null);
    }
  };

  const handleEditClick = (Cliente) => {
    if (selectedCliente?.id === Cliente.id) {
      updateCliente(Cliente.id);
    } else {
      setselectedCliente(Cliente);
    }
  };

  const deleteCliente = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await ClientService.deleteCliente(id, token);
      setSuccessMessage(response.message);
      setErrorMessage(null);
      fetchClientes();
    } catch (error) {
      console.error("Error details:", error);
      const errorMessage = error.response?.data || "Error al eliminar al cliente";
      setErrorMessage(errorMessage);
      setSuccessMessage(null);
    }
  };

  return (
    <Container>
      <Navbar />
      <Typography variant="h4" gutterBottom>
        Clientes
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

      {/* Formulario para agregar un nuevo Cliente */}
      <div style={{ marginBottom: "20px" }}>
        <TextField
          label="Nombre"
          value={newCliente.nombre}
          onChange={(e) => setnewCliente({ ...newCliente, nombre: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Direccion"
          value={newCliente.direccion}
          onChange={(e) => setnewCliente({ ...newCliente, direccion: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Contacto (solo números)"
          value={newCliente.contacto}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\+?[0-9]{0,12}$/.test(value)) {
              setnewCliente({ ...newCliente, contacto: value });
            }
          }}
          fullWidth
          margin="normal"
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={addCliente}
          style={{ textTransform: "none", marginTop: "10px" }}
        >
          Agregar cliente
        </Button>
      </div>

      {/* Tabla de Clientes */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Direccion</TableCell>
            <TableCell>Contacto</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Clientes.map((Cliente) => (
            <TableRow key={Cliente.id}>
              <TableCell>{Cliente.id}</TableCell>
              <TableCell>
                {selectedCliente && selectedCliente.id === Cliente.id ? (
                  <TextField
                    fullWidth
                    value={selectedCliente.nombre}
                    onChange={(e) =>
                      setselectedCliente({ ...selectedCliente, nombre: e.target.value })
                    }
                  />
                ) : (
                  Cliente.nombre
                )}
              </TableCell>
              <TableCell>
                {selectedCliente && selectedCliente.id === Cliente.id ? (
                  <TextField
                    fullWidth
                    value={selectedCliente.direccion}
                    onChange={(e) =>
                      setselectedCliente({ ...selectedCliente, direccion: e.target.value })
                    }
                  />
                ) : (
                  Cliente.direccion
                )}
              </TableCell>
              <TableCell>
                {selectedCliente && selectedCliente.id === Cliente.id ? (
                  <TextField
                    fullWidth
                    value={selectedCliente.contacto}
                    onChange={(e) =>
                      setselectedCliente({ ...selectedCliente, contacto: e.target.value })
                    }
                  />
                ) : (
                  Cliente.contacto
                )}
              </TableCell>
              <TableCell>
                {selectedCliente && selectedCliente.id === Cliente.id ? (
                  <Switch
                    checked={selectedCliente.estado}
                    onChange={() =>
                      setselectedCliente({
                        ...selectedCliente,
                        estado: !selectedCliente.estado,
                      })
                    }
                    color="primary"
                  />
                ) : (
                  Cliente.estado ? "Activo" : "Inactivo"
                )}
              </TableCell>
              <TableCell>
                <IconButton
                  color="primary"
                  onClick={() => handleEditClick(Cliente)}
                >
                  {selectedCliente && selectedCliente.id === Cliente.id ? (
                    <Check />
                  ) : (
                    <Edit />
                  )}
                </IconButton>
                <IconButton color="error" onClick={() => deleteCliente(Cliente.id)}>
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
