const API_URL = import.meta.env.VITE_API_URL;
// Listar servicios
// Obtiene todos los servicios para el listado general.
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
// Obtiene el detalle de un servicio específico.
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

// Envía la imagen al API y devuelve el nombre con que será almacenada.
export async function uploadServiceImage(
    file,
    previousFileName = null
) {
    try {
        if (!file) {
            throw new Error();
        }
        const formData = new FormData();
        formData.append("image", file);

        if (previousFileName) {
            formData.append("previousFileName", previousFileName);
        }

        const response = await fetch(`${API_URL}/images/upload`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
                const data = await response.json();
                console.error("========== ERROR AL SUBIR IMAGEN ==========");
                console.error(data);
                console.error("===========================================");
                throw new Error();
            }
            const data = await response.json();
            return data.fileName;
        } catch {
            throw new Error("No se pudo subir la imagen");
        }
    }

// Crear un servicio
// Crea un servicio utilizando los datos preparados por el formulario.
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

// Cambia únicamente el estado activo del servicio.
export async function updateServiceStatus(id, activo) {
    try {
        const response = await fetch(
            `${API_URL}/servicios/${id}/estado`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    activo: activo,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error(
                "========== ERROR CAMBIO DE ESTADO =========="
            );
            console.error(data);
            console.error(
                "=============================================="
            );

            throw new Error(
                data.message ||
                "No se pudo actualizar el estado del servicio."
            );
        }

        return data;
    } catch (error) {
        console.error(
            "Error al cambiar el estado:",
            error
        );

        throw new Error(
            error.message ||
            "No se pudo actualizar el estado del servicio."
        );
    }
}

/*
Usa GET para obtener SOLO los servicios activos
que pueden seleccionarse al crear una cita.
*/
// Obtiene solo los servicios que pueden utilizarse al crear una cita.
export async function getActiveServices() {
    try {
        const response = await fetch(
            `${API_URL}/servicios/activos`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "No se pudieron cargar los servicios activos."
            );
        }

        return data;
    } catch (error) {
        throw new Error(
            error.message ||
            "No se pudieron cargar los servicios activos."
        );
    }
}
