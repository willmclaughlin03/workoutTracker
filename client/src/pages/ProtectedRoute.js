import { Navigate } from "react-router-dom"
import { useAuth } from "../auth/authContext"

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) return null;
    return user ? children : <Navigate to = "/login"></Navigate>
}