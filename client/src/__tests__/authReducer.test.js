import { authReducer } from '../context/authContext.js';

describe('authReducer', () => {
  const initialState = {
    user: null,
    session: null,
    loading: true,
    error: null
  };

  test('handles unknown action type gracefully', () => {
  const result = authReducer(initialState, { type: 'UNKNOWN_ACTION' });
  expect(result).toEqual(initialState);
});

test('SET_LOADING updates loading state', () => {
  const result = authReducer(initialState, {
    type: 'SET_LOADING',
    payload: false
  });
  expect(result.loading).toBe(false);
});


  test('SET_USER sets user and session', () => {
    const action = {
      type: 'SET_USER',
      payload: {
        user: { id: '123' },
        session: { token: 'abc' }
      }
    };

    const result = authReducer(initialState, action);

    expect(result).toEqual({
      user: { id: '123' },
      session: { token: 'abc' },
      loading: false,
      error: null
    });
  });

  test('SET_ERROR sets error and stops loading', () => {
    const result = authReducer(initialState, {
      type: 'SET_ERROR',
      payload: 'Invalid credentials'
    });

    expect(result.error).toBe('Invalid credentials');
    expect(result.loading).toBe(false);
  });

  test('LOGOUT resets auth state', () => {
    const loggedIn = {
      user: { id: '123' },
      session: { token: 'abc' },
      loading: false,
      error: null
    };

    const result = authReducer(loggedIn, { type: 'LOGOUT' });

    expect(result).toEqual({
      user: null,
      session: null,
      loading: false,
      error: null
    });
  });
});
