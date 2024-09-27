"use client"
import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import { Container, Typography, Box } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            router.push('/users');
        }
    }, []);

    return (
        <Container maxWidth="sm">
            <Box 
                display="flex" 
                flexDirection="column" 
                alignItems="center" 
                justifyContent="center" 
                height="100vh" 
                textAlign="center"
            >
                <Typography variant="h3" gutterBottom>
                    Panadería Santa Laura
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Sistema de Inventario
                </Typography>
                <Button 
                    id="iniciar-sesion" 
                    variant="contained" 
                    onClick={() => router.push('/login')}
                    sx={{ mt: 4 }}
                >
                    Iniciar Sesión
                </Button>
            </Box>
        </Container>
    );
}