import PropTypes from "prop-types"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "./useAuth"

export function ProtectedRoute({ children }) {
    const location = useLocation()
    const { isAuthenticated, loading } = useAuth()
    
    if (loading) {
        return (
            <p className="text-center text-muted-foreground">
                Verificando sesión...
            </p>
        )
    }
    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location
                }}
            />
        )
    }
    return children
}
ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired
}
