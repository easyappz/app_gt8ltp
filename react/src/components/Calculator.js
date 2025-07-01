import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Paper, Typography } from '@mui/material';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [currentValue, setCurrentValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [memory, setMemory] = useState(null);

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
      setDisplay(String(result));
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
      setDisplay(String(result));
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
    setDisplay(String(-parseFloat(display)));
  };

  const handlePercent = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const handleMemoryAdd = () => {
    setMemory((prev) => (prev || 0) + parseFloat(display));
  };

  const handleMemorySubtract = () => {
    setMemory((prev) => (prev || 0) - parseFloat(display));
  };

  const handleMemoryRecall = () => {
    if (memory !== null) {
      setDisplay(String(memory));
      setWaitingForOperand(true);
    }
  };

  const buttonStyle = {
    height: 60,
    fontSize: '1.2rem',
    fontWeight: 'bold',
  };

  const operationButtonStyle = {
    ...buttonStyle,
    bgcolor: 'orange',
    color: 'white',
    '&:hover': {
      bgcolor: '#e69500',
    },
  };

  const numberButtonStyle = {
    ...buttonStyle,
    bgcolor: '#e0e0e0',
    color: 'black',
    '&:hover': {
      bgcolor: '#d0d0d0',
    },
  };

  const functionButtonStyle = {
    ...buttonStyle,
    bgcolor: '#a0a0a0',
    color: 'white',
    '&:hover': {
      bgcolor: '#909090',
    },
  };

  return (
    <Box sx={{ maxWidth: 300, margin: 'auto', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 2, bgcolor: '#f0f0f0' }}>
        <Typography variant="h4" align="right" sx={{ mb: 2, p: 1, bgcolor: 'white', minHeight: '60px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
                sx={numberButtonStyle}
                onClick={() => handleNumberInput(btn)}
              >
                {btn}
              </Button>
            </Grid>
          ))}
          <Grid item xs={3}>
            <Button fullWidth variant="contained" sx={operationButtonStyle} onClick={() => handleOperationInput('*')}>*</Button>
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
          <Grid item xs={3}>
            <Button fullWidth variant="contained" sx={functionButtonStyle} onClick={handleMemoryAdd}>M+</Button>
          </Grid>
          <Grid item xs={3}>
            <Button fullWidth variant="contained" sx={functionButtonStyle} onClick={handleMemorySubtract}>M-</Button>
          </Grid>
          <Grid item xs={3}>
            <Button fullWidth variant="contained" sx={functionButtonStyle} onClick={handleMemoryRecall}>MR</Button>
          </Grid>
          <Grid item xs={3}>
            <Button fullWidth variant="contained" sx={functionButtonStyle} onClick={handleClear}>C</Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Calculator;
