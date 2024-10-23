"use client"
import React, {useState} from 'react';
import {Card, CardContent, Container} from "@mui/material";
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import SimpleSnackbar from '../../components/SimpleSnackbar';
import { useRouter } from 'next/navigation';

import AuthService from '../../services/AuthService';

import './page.css';

export default function Login(){
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [state, setState] = useState(true);

    const handleLogin = async () => {
        const login = await AuthService.handleLogin(email, password);
        setState(login);
        if(login){
            router.push('/inventory');
        }
    }

    const handleRegister = () => {
        router.push('/register');
    }

    return (
        <Container className={"flex-container"}>
            <Card className={"login-box"}>
                <CardContent>
                    <div className={"login-box-child"}>
                        <h1>Iniciar sesión</h1>
                    </div>
                    <SimpleSnackbar message={"Usuario o contraseña incorrectas"} openSnack={!state}
                                    closeSnack={() => setState(true)}/>
                    <div className={"login-box-child"}>
                        <TextField
                            id="outlined-basic"
                            label="Correo"
                            variant="outlined"
                            placeholder="alfa@beta.cl"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className={"login-box-child"}>
                        <TextField
                            id="outlined-basic"
                            label="Contraseña"
                            variant="outlined"
                            placeholder="*********"
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className={"login-box-child"}>
                        <Button onClick={handleLogin} variant="contained" sx={{textTransform:'none'}}>Iniciar sesión</Button>
                    </div>
                    <div className={"login-box-child"}>
                        <Button onClick={handleRegister} sx={{textTransform:'none'}}>Registrar</Button>
                    </div>
                </CardContent>
            </Card>
        </Container>
    );
}