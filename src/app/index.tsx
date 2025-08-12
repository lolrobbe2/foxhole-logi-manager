import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider, useMediaQuery, CssBaseline } from '@mui/material';
import { lightFoxholeTheme, darkFoxholeTheme } from './themes';

const Root = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = prefersDarkMode ? darkFoxholeTheme : lightFoxholeTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
