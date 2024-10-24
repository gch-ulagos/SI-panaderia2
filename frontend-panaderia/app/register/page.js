"use client"
import React from "react";
import {Card, CardContent, Container} from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SimpleSnackbar from "@/components/SimpleSnackbar";
import AuthService from "@/services/AuthService";

import './page.css';

const Register = () => {
    // Register from user -> name, email, password, cellphone
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [password_second, setPasswordSecond] = React.useState("");
    const [cellphone, setCellphone] = React.useState("");

    const [message, setMessage] = React.useState("");
    const [openSnack, setOpenSnack] = React.useState(false);
    const handleRegister = async () => {
        if(password !== password_second){
            setMessage("Las contraseñas no coinciden");
            setOpenSnack(true);
            return;
        }
        const response = await AuthService.registerUser(name, email, password, password_second, cellphone);
        if(!response){
            setMessage("Error al registrar usuario");
            setOpenSnack(true);
        } else {
            setMessage("Usuario Registrado Exitosamente!");
            setOpenSnack(true);
        }
    }

    return (
        <Container>
            <SimpleSnackbar message={message} openSnack={openSnack} closeSnack={() => {setOpenSnack(!openSnack)}}/>
            <Card className="form">
                <CardContent>
                    <h1>Registrar Usuario</h1>
                    <div className="input-form">
                        <TextField
                            id="outlined-basic"
                            label="Nombre"
                            variant="outlined"
                            required
                            placeholder="Oleh Oleig"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="input-form">
                        <TextField
                            id="outlined-basic"
                            label="Email"
                            variant="outlined"
                            required
                            placeholder="alfa@beta.cl"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="input-form">
                        <TextField
                            id="outlined-basic"
                            label="Contraseña"
                            variant="outlined"
                            required
                            type="password"
                            placeholder="****"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="input-form">
                        <TextField
                            id="outlined-basic"
                            label="Confirmar Contraseña"
                            variant="outlined"
                            type="password"
                            required
                            placeholder="****"
                            onChange={(e) => setPasswordSecond(e.target.value)}
                        />
                    </div>
                    <div className="input-form">
                        <TextField
                            id="outlined-basic"
                            label="Teléfono"
                            variant="outlined"
                            required
                            placeholder="+56987654321"
                            onChange={(e) => setCellphone(e.target.value)}
                        />
                    </div>
                    <div className="input-form">
                        <Button variant="contained" onClick={handleRegister} sx={{textTransform:'none'}}>Registrar</Button>
                    </div>
                </CardContent>
            </Card>
        </Container>
    )
}

export default Register;