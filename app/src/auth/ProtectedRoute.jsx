import PropTypes from "prop-types"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "./useAuth"

// Protege las páginas que solo pueden consultar usuarios autenticados.
export function ProtectedRoute({ children }) {
    const location = useLocation()
    const { isAuthenticated, loading } = useAuth()
    
    // Espera a que termine la recuperación de la sesión antes de redirigir.
    if (loading) {
        return (
            <p className="text-center text-muted-foreground">
                Verificando sesión...
            </p>
        )
    }
    // Si no existe una sesión válida, envía al usuario al inicio de sesión.
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
