import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';

//  Mocks before import
jest.mock('../utils/supabaseClient.js');
jest.mock('../api/auth.js');

/
import { AuthProvider, useAuth } from '../context/authContext.js';
import { supabase } from '../utils/supabaseClient.js';

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('loads session on mount', async () => {
    supabase.auth.getSession.mockResolvedValueOnce({
      data: {
        session: {
          user: { 
            id: '789',
            email: 'test@example.com'
          }
        }
      },
      error: null
    });

    const wrapper = ({ children }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.user).not.toBeNull();
    }, { timeout: 3000 });

    expect(result.current.user.id).toBe('789');
  });

  test('handles no session on mount', async () => {
    supabase.auth.getSession.mockResolvedValueOnce({
      data: { session: null },
      error: null
    });

    const wrapper = ({ children }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.session).toBeNull();
  });

  test('handles getSession error on mount', async () => {
    supabase.auth.getSession.mockResolvedValueOnce({
      data: { session: null },
      error: { message: 'Session fetch failed' }
    });

    const wrapper = ({ children }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Session fetch failed');
  });

  test('cleans up auth state listener on unmount', () => {
    const unsubscribeMock = jest.fn();
    
    supabase.auth.getSession.mockResolvedValueOnce({
      data: { session: null },
      error: null
    });
    
    supabase.auth.onAuthStateChange.mockReturnValue({
      data: {
        subscription: { unsubscribe: unsubscribeMock }
      }
    });

    const wrapper = ({ children }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { unmount } = renderHook(() => useAuth(), { wrapper });
    
    unmount();

    expect(unsubscribeMock).toHaveBeenCalled();
  });
});