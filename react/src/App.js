import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import Calculator from './components/Calculator';
import { CssBaseline, Container } from '@mui/material';

function App() {
  return (
    <ErrorBoundary>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Calculator />
      </Container>
    </ErrorBoundary>
  );
}

export default App;