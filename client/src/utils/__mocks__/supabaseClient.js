// __mocks__/supabaseClient.js
export const supabase = {
  auth: {
    getSession: jest.fn(() => 
      Promise.resolve({
        data: { session: null },
        error: null
      })
    ),
    onAuthStateChange: jest.fn(() => ({
      data: {
        subscription: { unsubscribe: jest.fn() }
      }
    })),
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn()
  }
};