import React, { useState } from 'react';
import { Box, Button, Grid, Paper, Typography } from '@mui/material';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [currentValue, setCurrentValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const handleNumberInput = (number) => {
    if (waitingForOperand) {
      setDisplay(String(number));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(number) : display + number);
    }
  };

  const handleOperationInput = (op) => {
    setOperation(op);
    setCurrentValue(parseFloat(display));
    setWaitingForOperand(true);
  };

  const handleEquals = () => {
    if (operation && currentValue !== null) {
      const current = parseFloat(display);
      let result;
      switch (operation) {
        case '+':
          result = currentValue + current;
          break;
        case '-':
          result = currentValue - current;
          break;
        case '*':
          result = currentValue * current;
          break;
        case '/':
          result = currentValue / current;
          break;
        default:
          return;
      }
      setDisplay(String(result));
      setOperation(null);
      setCurrentValue(null);
      setWaitingForOperand(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setCurrentValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const buttonStyle = {
    height: 60,
    fontSize: '1.5rem',
  };

  return (
    <Box sx={{ maxWidth: 300, margin: 'auto', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 2, bgcolor: '#f0f0f0' }}>
        <Typography variant="h4" align="right" sx={{ mb: 2, p: 1, bgcolor: 'white' }}>
          {display}
        </Typography>
        <Grid container spacing={1}>
          {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'].map((btn) => (
            <Grid item xs={3} key={btn}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  ...buttonStyle,
                  bgcolor: ['/', '*', '-', '+', '='].includes(btn) ? 'orange' : 'default',
                }}
                onClick={() => {
                  if (btn === '=') handleEquals();
                  else if (['+', '-', '*', '/'].includes(btn)) handleOperationInput(btn);
                  else handleNumberInput(btn);
                }}
              >
                {btn}
              </Button>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button
              variant="contained"
              fullWidth
              sx={{ ...buttonStyle, bgcolor: 'red' }}
              onClick={handleClear}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Calculator;
