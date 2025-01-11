import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from  './theme';
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Inventario | Panadería Santa Laura",
  description: "GCH Ulagos",
};

export default function RootLayout({ children }) {
  return (
    <ThemeProvider theme={theme}>
    <html lang="es">
      <CssBaseline />
      <head>
        <link rel="icon" href="/favicon.ico"/>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
    </ThemeProvider>
  );
}
