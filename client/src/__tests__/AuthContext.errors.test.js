import React from 'react';
import { renderHook } from '@testing-library/react';
import { useAuth } from '../context/authContext.js';

describe('AuthContext error handling', () => {
  test('useAuth throws error when used outside AuthProvider', () => {
    // Suppress console.error for this test
    const consoleError = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within an authProvider');

    consoleError.mockRestore();
  });
});