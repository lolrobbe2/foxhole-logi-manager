import { createTheme } from '@mui/material/styles';

export const lightFoxholeTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#646cff', // Foxhole blue accent
    },
    background: {
      default: '#ffffff', // white background
      paper: '#f5f5f5',   // light grey paper surfaces
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',    // dark text
      secondary: 'rgba(0, 0, 0, 0.6)',   // secondary dark text
    },
  },
  typography: {
    fontFamily: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'].join(','),
  },
});

export const darkFoxholeTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#646cff', // same blue accent
    },
    background: {
      default: '#242424', // dark foxhole background
      paper: '#2e2e2e',   // slightly lighter dark surfaces
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.87)',  // near white text
      secondary: 'rgba(255, 255, 255, 0.6)', // lighter secondary text
    },
  },
  typography: {
    fontFamily: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'].join(','),
  },
});
