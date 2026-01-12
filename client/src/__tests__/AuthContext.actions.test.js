import React from 'react';
import { renderHook, act } from '@testing-library/react';

// Mock BEFORE importing
jest.mock('../utils/supabaseClient.js');
jest.mock('../api/auth.js');

// NOW import
import { AuthProvider, useAuth } from '../context/authContext.js';
import { supabase } from '../utils/supabaseClient.js';
import { signIn, signUp, signOut } from '../api/auth.js';

describe('AuthContext actions', () => {
  const wrapper = ({ children }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mocks to defaults
    supabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null
    });
  });

  test('login success sets user state', async () => {
    signIn.mockResolvedValue({
      user: { id: '123' },
      session: { token: 'abc' }
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      const response = await result.current.login(
        'test@email.com',
        'password'
      );
      expect(response.success).toBe(true);
    });

    expect(result.current.user.id).toBe('123');
  });

  test('login failure sets error', async () => {
    signIn.mockRejectedValue(new Error('Invalid credentials'));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      const response = await result.current.login(
        'test@email.com',
        'wrong'
      );
      expect(response.success).toBe(false);
    });

    expect(result.current.error).toBe('Invalid credentials');
  });

  test('signup success sets user', async () => {
    signUp.mockResolvedValue({
      user: { id: '456' },
      session: { token: 'xyz' }
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      const response = await result.current.signUp_context(
        'new@email.com',
        'password'
      );
      expect(response.success).toBe(true);
    });

    expect(result.current.user.id).toBe('456');
  });

  test('logout clears auth state', async () => {
    signOut.mockResolvedValue();

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.session).toBeNull();
  });

  test('logout when already logged out does not error', async () => {
    signOut.mockResolvedValue();

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBeNull();

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.error).toBeNull();
  });

  test('logout failure sets error', async () => {
    signOut.mockRejectedValue(new Error('Logout failed'));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.error).toBe('Logout failed');
  });

  test('signup with existing email returns error', async () => {
    signUp.mockRejectedValue(new Error('Email already registered'));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      const response = await result.current.signUp_context(
        'existing@email.com',
        'password'
      );
      expect(response.success).toBe(false);
    });

    expect(result.current.error).toBe('Email already registered');
  });

  test('multiple failed login attempts accumulate errors', async () => {
    signIn
      .mockRejectedValueOnce(new Error('Wrong password'))
      .mockRejectedValueOnce(new Error('Account locked'));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('test@email.com', 'wrong1');
    });
    expect(result.current.error).toBe('Wrong password');

    await act(async () => {
      await result.current.login('test@email.com', 'wrong2');
    });
    expect(result.current.error).toBe('Account locked');
  });

  test('successful login after failed attempt clears error', async () => {
    signIn
      .mockRejectedValueOnce(new Error('Wrong password'))
      .mockResolvedValueOnce({
        user: { id: '123' },
        session: { token: 'abc' }
      });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('test@email.com', 'wrong');
    });
    expect(result.current.error).toBe('Wrong password');

    await act(async () => {
      await result.current.login('test@email.com', 'correct');
    });
    expect(result.current.error).toBeNull();
    expect(result.current.user.id).toBe('123');
  });
});