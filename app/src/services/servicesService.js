const API_URL = import.meta.env.VITE_API_URL;
export async function getServices() {
    try {
        const response = await fetch(`${API_URL}/servicios`);
        if (!response.ok) {
            throw new Error();
        }
        return await response.json();
    } catch {
        throw new Error("Error al obtener servicios");
    }
}

export async function getServiceById(id) {
    try {
        const response = await fetch(`${API_URL}/servicios/${id}`);
        if (!response.ok) {
            throw new Error();
        }
        return await response.json();
    } catch {
        throw new Error("No se pudo cargar el detalle del servicio.");
    }
}

export async function createService(data) {
    try {
        const response = await fetch(`${API_URL}/servicios`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "No se pudo crear el servicio");
        }

        return result;
    } catch (error) {
        throw new Error(error.message || "No se pudo crear el servicio");
    }
}