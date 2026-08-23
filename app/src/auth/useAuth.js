import { useContext } from "react"
import { AuthContext } from "./AuthContext"

// Facilita el acceso al contexto de autenticación desde los componentes.
export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error(
            "useAuth debe utilizarse dentro de un AuthProvider."
        )
    }
    return context
}
