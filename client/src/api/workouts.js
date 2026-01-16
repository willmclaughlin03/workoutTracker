import apiClient from './apiClient.js'

export const getWorkouts = async (startDate, endDate) => {
    try{
    const response = await apiClient.get('/workouts', {
        params: { startDate, endDate}
    })
    return { data: response.data, error: null}}
    catch(error){
        const message = error.response?.data.message || 'Failed to fetch workouts'
        return {data: null, error: message}
    }
}

export const createWorkout = async (workoutData) => {
    try{
    const response = await apiClient.post('/workouts', workoutData)
    return { data: response.data, error : null}}
    catch{
        const message = error.response?.data.message || 'Feailed to create workout'
        return { data : null, error: message}
    }
}

export const updateWorkout = async (workoutId, workoutData) => {
    try {
    const response = await apiClient.put(`/workouts/${workoutId}`, workoutData)
    return { data : response.data, error: null}}
    catch{
        const message = error.response?.data.message || "Failed to update workouts"
        return { data : null, error : message}
    }
}

export const deleteWorkout = async(workoutId) => {
    try{
    await apiClient.delete(`/workouts/${workoutId}`)
    }catch{
        const message = error.response?.data.message || "Failed to delete workout"
        return { data: null, error : message}
    }
}