import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react"
import PropTypes from "prop-types"

import { AuthContext } from "./AuthContext"
import { getProfile, loginUser } from "@/services/authService"

const TOKEN_KEY = "token"

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [loading, setLoading] = useState(true)
    
    // Elimina el token y los datos del usuario para cerrar completamente la sesión.
    const clearSession = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY)
        setToken(null)
        setUser(null)
    }, [])

    useEffect(() => {
        let isMounted = true

        // Recupera la sesión guardada después de recargar la página
        // y consulta nuevamente el perfil del usuario.
        async function restoreSession() {
            const storedToken = localStorage.getItem(TOKEN_KEY)

            if (!storedToken) {
                if (isMounted) {
                    setLoading(false)
                }
                return
            }
            try {
                // Verifica que el token almacenado todavía sea válido.
                const response = await getProfile(storedToken)
                const profile = response.data ?? response

                if (!isMounted) {
                    return
                }

                setToken(storedToken)
                setUser(profile)
            } catch (error) {
                console.error(
                    "No se pudo restaurar la sesión:",
                    error
                )
                if (isMounted) {
                    clearSession()
                }
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        restoreSession()

        return () => {
            isMounted = false
        }
    }, [clearSession])

    // Autentica al usuario, obtiene su token y carga su perfil completo.
    const login = useCallback(async (credentials) => {
        const loginResponse = await loginUser(credentials)
        console.log("loginResponse", loginResponse)
        const newToken = loginResponse.data?.token

        console.log("newToken", newToken)
        if (!newToken) {
            throw new Error(
                "El API no devolvió un token válido."
            )
        }

        // Consulta el perfil para conocer el rol y los datos del usuario autenticado.
        const profileResponse = await getProfile(newToken)
        const profile =
            profileResponse.data ?? profileResponse

        localStorage.setItem(TOKEN_KEY, newToken)
        setToken(newToken)
        setUser(profile)

        return profile
    }, [])

    // Expone la función de cierre de sesión para los componentes de la aplicación.
    const logout = useCallback(() => {
        clearSession()
    }, [clearSession])

    const isAuthenticated = Boolean(token && user)

    const contextValue = useMemo(
        () => ({
            user,
            token,
            loading,
            login,
            logout,
            isAuthenticated,
        }),
        [
            user,
            token,
            loading,
            login,
            logout,
            isAuthenticated,
        ]
    )
    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
}