import { createContext, useContext, useReducer, useEffect } from "react";

const WorkoutContext = createContext(null);

// Reducer for managing workout state
const workoutReducer = (state, action) => {
    switch (action.type) {
        case 'SET_SELECTED_DATE':
            return {
                ...state,
                selectedDate: action.payload
            };

        case 'SET_WORKOUTS':
            return {
                ...state,
                workouts: action.payload,
                loading: false,
                error: null
            };

        case 'ADD_WORKOUT':
            return {
                ...state,
                workouts: [...state.workouts, action.payload]};

        case 'UPDATE_WORKOUT':
            return {
                ...state,
                workouts: state.workouts.map(workout =>
                    workout.id === action.payload.id ? action.payload : workout
                )};

        case 'ADD_EXERCISE':
            return {
            ...state,
             workouts: state.workouts.map(workout =>
            workout.id === action.payload.workoutId
                ? { ...workout, exercises: [...workout.exercises, action.payload.exercise] }
                : workout
                )};

        case 'UPDATE_EXERCISE':
            return {
            ...state,
            workouts: state.workouts.map(workout =>
            workout.id === action.payload.workoutId
            ? {
                ...workout,
                exercises: workout.exercises.map(ex =>
                ex.id === action.payload.exercise.id ? action.payload.exercise : ex
                )
            }
            : workout)};

        case 'DELETE_EXERCISE':
            return {
                ...state,
                workouts: state.workouts.map(workout =>
                workout.id === action.payload.workoutId
                ? {
                    ...workout,
                    exercises: workout.exercises.filter(ex => ex.id !== action.payload.exerciseId)
                }
                : workout)    };

        case 'DELETE_WORKOUT':
            return {
                ...state,
                workouts: state.workouts.filter(workout => workout.id !== action.payload)
            };

        case 'SET_FAVORITES':
            return {
                ...state,
                favoriteWorkouts: action.payload
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
        
        case 'SET_EXERCISE_HISTORY':
            return{
                ...state,
                exerciseHistory: action.payload
            }

        default:
            return state;
    }
};

// Initial state
const initialState = {
    selectedDate: new Date(),
    workouts: [],
    exerciseHistory: {},
    favoriteWorkouts: [],
    loading: false,
    error: null
};

// Provider component
export const WorkoutProvider = ({ children }) => {
    const [state, dispatch] = useReducer(workoutReducer, initialState);

    // Action creators
    const setSelectedDate = (date) => {
        dispatch({ type: 'SET_SELECTED_DATE', payload: date });
    };

    const setWorkouts = (workouts) => {
        dispatch({ type: 'SET_WORKOUTS', payload: workouts });
    };

    const addWorkout = (workout) => {
        dispatch({ type: 'ADD_WORKOUT', payload: workout });
    };

    const updateWorkout = (workout) => {
        dispatch({ type: 'UPDATE_WORKOUT', payload: workout });
    };

    const deleteWorkout = (workoutId) => {
        dispatch({ type: 'DELETE_WORKOUT', payload: workoutId });
    };

    const setFavorites = (favorites) => {
        dispatch({ type: 'SET_FAVORITES', payload: favorites });
    };

    const setLoading = (loading) => {
        dispatch({ type: 'SET_LOADING', payload: loading });
    };

    const setError = (error) => {
        dispatch({ type: 'SET_ERROR', payload: error });
    };

    // Example: Fetch workouts for selected date
    useEffect(() => {
        const fetchWorkouts = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/workouts?date=${state.selectedDate}`)
                const data = await response.json()
                setWorkouts(data)
                
                setLoading(false);
            } catch (error) {
                setError(error.message);
            }
        };

        // Uncomment when you have your API ready
        fetchWorkouts();
    }, [state.selectedDate]);

    const value = {
        // State
        selectedDate: state.selectedDate,
        workouts: state.workouts,
        favoriteWorkouts: state.favoriteWorkouts,
        loading: state.loading,
        error: state.error,
        
        // Actions
        setSelectedDate,
        setWorkouts,
        addWorkout,
        updateWorkout,
        deleteWorkout,
        setFavorites,
        setLoading,
        setError
    };

    return (
        <WorkoutContext.Provider value={value}>
            {children}
        </WorkoutContext.Provider>
    );
};

// Custom hook to use the workout context
export const useWorkout = () => {
    const context = useContext(WorkoutContext);
    if (!context) {
        throw new Error('useWorkout must be used within a WorkoutProvider');
    }
    return context;
};