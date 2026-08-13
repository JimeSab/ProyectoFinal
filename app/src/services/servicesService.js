const API_URL = import.meta.env.VITE_API_URL;
// Listar servicios
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
// Obtener servicio por ID
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
// Crear un servicio
export async function createService(serviceData) {
    try {
        const response = await fetch(`${API_URL}/servicios`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(serviceData),
        });

        if (!response.ok) {
            const data = await response.json();
            console.error("========== ERROR API ==========");
            console.error(data);
            console.error("===============================");
            throw new Error(JSON.stringify(data, null, 2));
        }

        return await response.json();
    } catch {
        throw new Error("No se pudo crear el servicio");
    }
}
// Actualizar un servicio
export async function updateService(id, serviceData) {
    try {
        const response = await fetch(`${API_URL}/servicios/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(serviceData),
        });

        if (!response.ok) {
            const data = await response.json();
            console.error("========== ERROR API UPDATE ==========");
            console.error(data);
            console.error("======================================");
            throw new Error(JSON.stringify(data, null, 2));
        }

        return await response.json();
    } catch {
        throw new Error("No se pudo actualizar el servicio.");
    }
}