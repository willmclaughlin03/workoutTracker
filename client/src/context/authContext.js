import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { signIn, signOut, signUp } from "../api/auth.js"


const AuthContext = createContext(null)

// state management across setting users
const authReducer = (state, action) => {
    switch (action.type) {
        case 'SET_USER':
            return {
                ...state,
                user: action.payload.user,
                session: action.payload.session,
                loading: false,
                error: null
            };
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
                loading: false
            };
        case 'LOGOUT':
            return{
                user: null,
                session: null,
                loading: false,
                error: null
            };
        default:
            return state
    }
}
// sets inital state for users
const initalState = {
    user: null,
    session: null,
    loading: true,
    error: null
}

// wraps the entire application in this logic
export const AuthProvider = ({ children }) => {
    // sets state
    const [state, dispatch] = useReducer(authReducer, initalState);

    // retrieve any existing sessions,
    useEffect(() => {
        supabase.auth.getSession().then(({ data, error }) => {
            if (error) {
                dispatch({ type: 'SET_ERROR', payload: error.message});
            }else{
                dispatch({
                    type: 'SET_USER',
                    payload: {
                        user: data.session?.user ?? null,
                        session: data.session ?? null
                    }
                })
            }
        });
        //  sync with Supabase in case of token changes, logouts, or alt tabs
        const { data: listener} = supabase.auth.onAuthStateChange(
            (_event, session) => {
                dispatch({
                    type: 'SET_USER',
                    payload: {
                        user: session?.user ?? null,
                        session: session ?? null
                    }
                })
            }
        )

        return () => listener.subscription.unsubscribe();
    }, []);

    const [tokenExpiry, setTokenExpiry] = useState(null);

    useEffect(() => {
        const checkExpiry = async () => {
            const {data : { session } } = await supabase.auth.getSession()
            if (session?.expires_at) {
                setTokenExpiry(session.expires_at)
            }
        }
        checkExpiry()
    }, [session])


    // uses authJS supabase calls for login, then sets reducer state
    const login = async (email, password) => {
        dispatch({ type: 'SET_LOADING', payload : true});

        try {
            const session = await signIn(email, password);
            dispatch({
                type: 'SET_USER',
                payload: {
                    user: session.user,
                    session: session
                }
            })
            return { success : true, error: null}
        }catch(error){
            dispatch({ type: 'SET_ERROR', payload: error.message })
            return { success: false, error: error.message}
        }
    }
    // named context for better readability instead of signUP to differentiate betwen call signUp
    // same functionality as login; call auth.js DB func, then set reducer session state
    const signUp_context = async (email, password) => {
        dispatch( { type: 'SET_LOADING', payload : true});

        try {
            const data = await signUp(email, password);
            dispatch({
                type: 'SET_USER',
                payload: {
                    user: data.user,
                    session: data.session
                }
            })
            return { success: true, error: null}
        }catch(error){
            dispatch({ type: 'SET_ERROR', payload: error.message })
            return { success: false, error: error.message}
        }
    }
    // calls authJS signOut; sets reducer session state
    const logout = async () => {
        try{
            await signOut();
            dispatch({type : 'LOGOUT'});
            return { success : true, error: null}
        }catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message })
            return { success: false, error: error.message}
        }
    }
    // sets application states 
    const value = {
        user: state.user,
        session: state.session,
        loading: state.loading,
        error: state.error,
        login, 
        signUp_context,
        logout
    }

    return(
        <AuthContext.Provider value = { value }>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () =>  {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an authProvider')
    }
    return context;
}
export { authReducer }
