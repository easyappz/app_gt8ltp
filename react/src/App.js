import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import Calculator from './components/Calculator';
import { CssBaseline, Container, Typography } from '@mui/material';

function App() {
  return (
    <ErrorBoundary>
      <CssBaseline />
      <Container maxWidth="sm">
        <Typography variant="h3" component="h1" align="center" gutterBottom sx={{ mt: 4 }}>
          iOS-style Calculator
        </Typography>
        <Calculator />
      </Container>
    </ErrorBoundary>
  );
}

export default App;
