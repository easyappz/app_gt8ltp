import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Paper, Typography, useTheme, useMediaQuery } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [currentValue, setCurrentValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [memory, setMemory] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const customTheme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#ff9500',
      },
      secondary: {
        main: isDarkMode ? '#505050' : '#e0e0e0',
      },
      background: {
        default: isDarkMode ? '#000000' : '#f0f0f0',
        paper: isDarkMode ? '#1c1c1c' : '#ffffff',
      },
    },
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key;
      if (/[0-9.]/.test(key)) {
        handleNumberInput(key);
      } else if (['+', '-', '*', '/'].includes(key)) {
        handleOperationInput(key);
      } else if (key === 'Enter') {
        handleEquals();
      } else if (key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [display, currentValue, operation, waitingForOperand]);

  const handleNumberInput = (number) => {
    if (waitingForOperand) {
      setDisplay(number === '.' ? '0.' : number);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' && number !== '.' ? number : display + number);
    }
  };

  const handleOperationInput = (op) => {
    if (currentValue === null) {
      setCurrentValue(parseFloat(display));
    } else if (operation) {
      const result = calculate(currentValue, parseFloat(display), operation);
      setCurrentValue(result);
      setDisplay(formatNumber(result));
    }
    setOperation(op);
    setWaitingForOperand(true);
  };

  const calculate = (a, b, op) => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b !== 0 ? a / b : 'Error';
      default: return b;
    }
  };

  const handleEquals = () => {
    if (operation && currentValue !== null) {
      const result = calculate(currentValue, parseFloat(display), operation);
      setDisplay(formatNumber(result));
      setCurrentValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setCurrentValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const handleAllClear = () => {
    handleClear();
    setMemory(null);
  };

  const handleToggleSign = () => {
    setDisplay(formatNumber(-parseFloat(display)));
  };

  const handlePercent = () => {
    const value = parseFloat(display);
    setDisplay(formatNumber(value / 100));
  };

  const handleMemoryAdd = () => {
    setMemory((prev) => (prev || 0) + parseFloat(display));
  };

  const handleMemorySubtract = () => {
    setMemory((prev) => (prev || 0) - parseFloat(display));
  };

  const handleMemoryRecall = () => {
    if (memory !== null) {
      setDisplay(formatNumber(memory));
      setWaitingForOperand(true);
    }
  };

  const formatNumber = (num) => {
    if (num === 'Error') return num;
    const formatted = parseFloat(num.toPrecision(12)).toString();
    if (formatted.length > 10) {
      return parseFloat(num).toExponential(5);
    }
    return formatted;
  };

  const buttonStyle = {
    height: isMobile ? 50 : 60,
    fontSize: isMobile ? '1rem' : '1.2rem',
    fontWeight: 'bold',
    borderRadius: '50%',
    transition: 'all 0.1s',
    '&:active': {
      transform: 'scale(0.95)',
    },
  };

  const operationButtonStyle = {
    ...buttonStyle,
    bgcolor: 'primary.main',
    color: 'white',
    '&:hover': {
      bgcolor: 'primary.dark',
    },
  };

  const numberButtonStyle = {
    ...buttonStyle,
    bgcolor: 'secondary.main',
    color: isDarkMode ? 'white' : 'black',
    '&:hover': {
      bgcolor: 'secondary.dark',
    },
  };

  const functionButtonStyle = {
    ...buttonStyle,
    bgcolor: isDarkMode ? '#333333' : '#a0a0a0',
    color: isDarkMode ? 'white' : 'black',
    '&:hover': {
      bgcolor: isDarkMode ? '#444444' : '#909090',
    },
  };

  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{ maxWidth: 300, margin: 'auto', mt: 4 }}>
        <Paper elevation={3} sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" color="text.secondary">
              Calculator
            </Typography>
            <Button
              size="small"
              onClick={() => setIsDarkMode(!isDarkMode)}
              sx={{ color: 'text.secondary' }}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </Button>
          </Box>
          <Typography
            variant="h4"
            align="right"
            sx={{
              mb: 2,
              p: 1,
              bgcolor: 'background.default',
              color: 'text.primary',
              minHeight: '60px',
              borderRadius: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {display}
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={3}>
              <Button fullWidth variant="contained" sx={functionButtonStyle} onClick={handleAllClear}>AC</Button>
            </Grid>
            <Grid item xs={3}>
              <Button fullWidth variant="contained" sx={functionButtonStyle} onClick={handleToggleSign}>+/-</Button>
            </Grid>
            <Grid item xs={3}>
              <Button fullWidth variant="contained" sx={functionButtonStyle} onClick={handlePercent}>%</Button>
            </Grid>
            <Grid item xs={3}>
              <Button fullWidth variant="contained" sx={operationButtonStyle} onClick={() => handleOperationInput('/')}>/</Button>
            </Grid>
            {['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.'].map((btn) => (
              <Grid item xs={btn === '0' ? 6 : 3} key={btn}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    ...numberButtonStyle,
                    borderRadius: btn === '0' ? '50px' : '50%',
                  }}
                  onClick={() => handleNumberInput(btn)}
                >
                  {btn}
                </Button>
              </Grid>
            ))}
            <Grid item xs={3}>
              <Button fullWidth variant="contained" sx={operationButtonStyle} onClick={() => handleOperationInput('*')}>×</Button>
            </Grid>
            <Grid item xs={3}>
              <Button fullWidth variant="contained" sx={operationButtonStyle} onClick={() => handleOperationInput('-')}>-</Button>
            </Grid>
            <Grid item xs={3}>
              <Button fullWidth variant="contained" sx={operationButtonStyle} onClick={() => handleOperationInput('+')}>+</Button>
            </Grid>
            <Grid item xs={3}>
              <Button fullWidth variant="contained" sx={operationButtonStyle} onClick={handleEquals}>=</Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default Calculator;