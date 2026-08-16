const API_URL = import.meta.env.VITE_API_URL

export async function loginUser(credentials) {
    try {
        const response = await fetch(`${API_URL}/usuarios/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials)
        })
        if (!response.ok) {
            throw new Error("Correo o contraseña incorrectos.")
        }
        return await response.json()
    } catch {
        throw new Error("No se pudo iniciar sesión.")
    }
}

export async function registerUser(userData) {
    try {
        const response = await fetch(`${API_URL}/usuarios/registro`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        })
        if (!response.ok) {
            const data = await response.json()
            throw new Error(data.message || "No se pudo registrar el usuario.")
        }
        return await response.json()
    } catch (error) {
        throw new Error(error.message || "No se pudo registrar el usuario.")
    }
}

export async function getProfile(token) {
    try {
        const response = await fetch(`${API_URL}/usuarios/perfil`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if (!response.ok) {
            throw new Error("Token inválido o expirado.")
        }
        return await response.json()
    } catch {
        throw new Error("No se pudo obtener el perfil del usuario.")
    }
}