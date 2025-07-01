import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Calculator from './Calculator';

describe('Calculator', () => {
  beforeEach(() => {
    render(<Calculator />);
  });

  test('renders calculator', () => {
    expect(screen.getByText('Calculator')).toBeInTheDocument();
  });

  test('performs basic addition', () => {
    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('='));
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('performs basic subtraction', () => {
    fireEvent.click(screen.getByText('5'));
    fireEvent.click(screen.getByText('-'));
    fireEvent.click(screen.getByText('3'));
    fireEvent.click(screen.getByText('='));
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  test('performs basic multiplication', () => {
    fireEvent.click(screen.getByText('4'));
    fireEvent.click(screen.getByText('×'));
    fireEvent.click(screen.getByText('3'));
    fireEvent.click(screen.getByText('='));
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  test('performs basic division', () => {
    fireEvent.click(screen.getByText('8'));
    fireEvent.click(screen.getByText('/'));
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('='));
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  test('handles decimal input', () => {
    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByText('.'));
    fireEvent.click(screen.getByText('5'));
    expect(screen.getByText('1.5')).toBeInTheDocument();
  });

  test('toggles sign', () => {
    fireEvent.click(screen.getByText('5'));
    fireEvent.click(screen.getByText('+/-'));
    expect(screen.getByText('-5')).toBeInTheDocument();
  });

  test('calculates percentage', () => {
    fireEvent.click(screen.getByText('5'));
    fireEvent.click(screen.getByText('0'));
    fireEvent.click(screen.getByText('%'));
    expect(screen.getByText('0.5')).toBeInTheDocument();
  });

  test('clears display', () => {
    fireEvent.click(screen.getByText('5'));
    fireEvent.click(screen.getByText('AC'));
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  test('handles memory operations', () => {
    fireEvent.click(screen.getByText('5'));
    fireEvent.click(screen.getByText('M+'));
    fireEvent.click(screen.getByText('AC'));
    fireEvent.click(screen.getByText('MR'));
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});