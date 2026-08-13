// Obtiene la dirección del API desde el archivo .env para utilizarla en las solicitudes.
const API_URL = import.meta.env.VITE_API_URL;

// Realiza las solicitudes al API utilizando fetch y devuelve la respuesta en formato JSON
async function request(path, options, errorMessage) {
    try {
        const response = await fetch(`${API_URL}${path}`, options);
        const data = await response.json();

        // Verifica si la solicitud fue exitosa y muestra los errores enviados por el API
        if (!response.ok) {
            const validationMessage = data?.validationErrors
                ?.map((error) => error.message)
                .join(" ");

            throw new Error(
                validationMessage || data?.message || errorMessage
            );
        }

        return data;
    } catch (error) {
        // Muestra un mensaje cuando no se puede establecer conexión con el API
        if (error instanceof TypeError) {
            throw new Error(
                "No se pudo conectar con el API. Verifique que esté encendida."
            );
        }

        throw error;
    }
}

// Lista todos los servicios adicionales utilizando el método GET
export async function getAdditionals() {
    return request(
        "/servicios-adicionales",
        undefined,
        "No se pudieron obtener los servicios adicionales."
    );
}

// Obtiene el detalle de un servicio adicional usando su ID y método GET
export async function getAdditionalById(id) {
    return request(
        `/servicios-adicionales/${id}`,
        undefined,
        "No se pudo cargar el servicio adicional."
    );
}
// Crea un servicio adicional  método POST y envia los datos en formato JSON
export async function createAdditional(additionalData) {
    return request(
        "/servicios-adicionales",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(additionalData),
        },
        "No se pudo crear el servicio adicional."
    );
}

// Edita un servicio adicional usando su ID, el método PUT y los datos del formulario.
export async function updateAdditional(id, additionalData) {
    return request(
        `/servicios-adicionales/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(additionalData),
        },
        "No se pudo actualizar el servicio adicional."
    );
}

// Activa / desactiva un servicio adicional usando PATCH y enviando el estado como true o false
export async function updateAdditionalStatus(id, activo) {
    return request(
        `/servicios-adicionales/${id}/estado`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ activo }),
        },
        "No se pudo cambiar el estado del servicio adicional."
    );
}