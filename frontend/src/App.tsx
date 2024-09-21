import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const theme = createTheme();

function App() {
  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="sm">
          <Box sx={{ my: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              TS Todo List
            </Typography>
            <Typography variant="body1">
              Welcome to your TypeScript-powered Todo List!
            </Typography>
          </Box>
        </Container>
      </ThemeProvider>
  );
}

export default App;
