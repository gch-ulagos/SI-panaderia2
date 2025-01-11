// theme.js
"use client"
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#a98467', // Color principal (azul por defecto)
      contrastText: '#ffffff', // Texto sobre el color principal
    },
    secondary: {
      main: '#adc178', // Color secundario (rosa por defecto)
      contrastText: '#ffffff', // Texto sobre el color secundario
    },
    background: {
      default: '#f0ead2', // Fondo de la página
      paper: '#dde5b6', // Fondo de los componentes
    },
    text: {
      primary: '#333333', // Color del texto principal
      secondary: '#666666', // Color del texto secundario
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif', // Cambiar tipografía si es necesario
    button: {
      textTransform: 'none', // Evitar mayúsculas en los botones
    },
  },
});

export default theme;