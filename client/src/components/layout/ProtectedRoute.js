import { Navigate } from "react-router-dom"
import { useAuth } from "../../context/authContext.js"
import LoadingSpinner from "../common/LoadingSpinner.js"

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if(loading){
        return(
            <div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner size="lg" message="Loading..." />
            </div>
        );
    }
    //if logged in, render, else login
    // replace history stack
    return user ? children : <Navigate to="/login" replace />;
}