import axios from 'axios'
import { supabase } from '../utils/supabaseClient'
import "dotenv/config"

let isRefreshing = false
let refreshSubscribers = []

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


const onRefreshed = (token) => {
    refreshSubscribers.map(callback => callback(token))
    refreshSubscribers = [];
}

//Global 401 handler
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Wait for refresh to complete
        return new Promise((resolve) => {
          refreshSubscribers.push((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data: { session }, error: refreshError } = 
          await supabase.auth.refreshSession();

        if (refreshError || !session) {
          await supabase.auth.signOut();
          window.location.href = '/login';
          return Promise.reject(error);
        }

        isRefreshing = false;
        onRefreshed(session.access_token);
        
        originalRequest.headers.Authorization = `Bearer ${session.access_token}`;
        return apiClient(originalRequest);
      } catch (err) {
        isRefreshing = false;
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
)



export default apiClient