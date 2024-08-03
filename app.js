import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import App from "/Users/michaelnwachi/Pantry/app"; // Adjust path if necessary
import theme from 'Users/michaelnwachi/Pantry/theme'; // Adjust path if necessary

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);
