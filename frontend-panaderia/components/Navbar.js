import React, { useEffect, useState } from 'react';
import './Navbar.css';
import Button from '@mui/material/Button';
import AuthService from '@/services/AuthService';
import { useRouter } from 'next/navigation';
import { useTheme } from '@mui/material/styles';
import { PowerSettingsNew as PowerSettingsNewIcon } from '@mui/icons-material';
import Image from 'next/image';

const Navbar = () => {
    const router = useRouter();
    const [user, setUser] = useState({ name: "" });
    const theme = useTheme();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        setUser(storedUser ? JSON.parse(storedUser) : { name: "" });
    }, []);

    const handleLogout = async () => {
        const token = localStorage.getItem('token');
        const result = await AuthService.logOut(token);
        if (result) {
            router.push('/');
        }
    };

    const handleIndex = () => {
        router.push('/inventory');
    };

    return (
        <div className="navbar">
            <div className="navbar-item">
                <p style={{ color: theme.palette.primary.main }}>Bienvenido/a, {user?.name}</p>
            </div>

            <div className="navbar-item">
                <div onClick={() => router.push('/inventory')} style={{ cursor: 'pointer' }}>
                    <Image src="/logo.png" alt="Logo" width={220} height={140} />
                </div>
            </div>

            <div className="navbar-item">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleLogout}
                    sx={{ textTransform: 'none', backgroundColor:'#f79d65' }}
                    endIcon={<PowerSettingsNewIcon fontSize="small" style={{ color: 'white' }} />} // Ícono corregido
                >
                    Desconectarse
                </Button>
            </div>
        </div>
    );
};

export default Navbar;
