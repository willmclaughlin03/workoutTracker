import axios from 'axios'
import { supabase } from '../utils/supabaseClient'
import "dotenv/config"

const apiClient = axios.create({
    baseURL: process.env.SUPABASE_URL,
    headers : {
        'Content-Type' : 'application/json'
    },
    timeout: 20000
})
//Attach the JWT token to every request
apiClient.interceptors.request.use(
    async (config) => {
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.access_token) {
            config.headers.Authorization = `Bearer ${session.access_token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

//Global 401 handler
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401){
            const { data : { session }, error: refreshError } = await supabase.auth.refreshSession()

            if (refreshError || !session) {
                // logout user if the refresh is unsuccessful
                await supabase.auth.signOut()
                window.location.href = '/login'
                return Promise.reject(error)
            }
            // retry with new token
            error.config.headers.Authorization = `Bearer ${session.access_token}`
            return apiClient.request(error.config)
        }

        return Promise.reject(error)
    }
)

export default apiClient