import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, Grid, Paper, Typography, useTheme, useMediaQuery, Snackbar } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [currentValue, setCurrentValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [memory, setMemory] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [history, setHistory] = useState([]);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

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
    const savedState = localStorage.getItem('calculatorState');
    if (savedState) {
      const { display, currentValue, operation, memory, isDarkMode, history, soundEnabled } = JSON.parse(savedState);
      setDisplay(display);
      setCurrentValue(currentValue);
      setOperation(operation);
      setMemory(memory);
      setIsDarkMode(isDarkMode);
      setHistory(history);
      setSoundEnabled(soundEnabled);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('calculatorState', JSON.stringify({
      display,
      currentValue,
      operation,
      memory,
      isDarkMode,
      history,
      soundEnabled
    }));
  }, [display, currentValue, operation, memory, isDarkMode, history, soundEnabled]);

  const playSound = useCallback(() => {
    if (soundEnabled) {
      const audio = new Audio('https://www.soundjay.com/buttons/button-1.mp3');
      audio.play();
    }
  }, [soundEnabled]);

  const handleNumberInput = (number) => {
    playSound();
    if (waitingForOperand) {
      setDisplay(number === '.' ? '0.' : number);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' && number !== '.' ? number : display + number);
    }
  };

  const handleOperationInput = (op) => {
    playSound();
    if (currentValue === null) {
      setCurrentValue(parseFloat(display));
    } else if (operation) {
      const result = calculate(currentValue, parseFloat(display), operation);
      setCurrentValue(result);
      setDisplay(formatNumber(result));
      addToHistory(`${currentValue} ${operation} ${display} = ${result}`);
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
    playSound();
    if (operation && currentValue !== null) {
      const result = calculate(currentValue, parseFloat(display), operation);
      setDisplay(formatNumber(result));
      addToHistory(`${currentValue} ${operation} ${display} = ${result}`);
      setCurrentValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const handleClear = () => {
    playSound();
    setDisplay('0');
    setCurrentValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const handleAllClear = () => {
    playSound();
    handleClear();
    setMemory(null);
    setHistory([]);
  };

  const handleToggleSign = () => {
    playSound();
    setDisplay(formatNumber(-parseFloat(display)));
  };

  const handlePercent = () => {
    playSound();
    const value = parseFloat(display);
    setDisplay(formatNumber(value / 100));
  };

  const handleMemoryAdd = () => {
    playSound();
    setMemory((prev) => (prev || 0) + parseFloat(display));
  };

  const handleMemorySubtract = () => {
    playSound();
    setMemory((prev) => (prev || 0) - parseFloat(display));
  };

  const handleMemoryRecall = () => {
    playSound();
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

  const addToHistory = (entry) => {
    setHistory((prev) => [entry, ...prev.slice(0, 9)]);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(display).then(() => {
      setShowSnackbar(true);
    });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowSnackbar(false);
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
            <Box>
              <Button
                size="small"
                onClick={() => setSoundEnabled(!soundEnabled)}
                sx={{ color: 'text.secondary', mr: 1 }}
              >
                {soundEnabled ? '🔊' : '🔇'}
              </Button>
              <Button
                size="small"
                onClick={() => setIsDarkMode(!isDarkMode)}
                sx={{ color: 'text.secondary' }}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </Button>
            </Box>
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
              cursor: 'pointer',
            }}
            onClick={handleCopyToClipboard}
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
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Memory: {memory !== null ? memory : 'Empty'}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Button size="small" onClick={handleMemoryAdd}>M+</Button>
              <Button size="small" onClick={handleMemorySubtract}>M-</Button>
              <Button size="small" onClick={handleMemoryRecall}>MR</Button>
            </Box>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              History:
            </Typography>
            {history.map((entry, index) => (
              <Typography key={index} variant="body2" color="text.secondary">
                {entry}
              </Typography>
            ))}
          </Box>
        </Paper>
      </Box>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={showSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        message="Copied to clipboard"
      />
    </ThemeProvider>
  );
};

export default Calculator;