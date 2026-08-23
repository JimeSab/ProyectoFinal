const API_URL = import.meta.env.VITE_API_URL;

// Obtiene los horarios generales registrados, sin permitir modificaciones.
export async function getSchedules() {
    try {
        const response = await fetch(`${API_URL}/horarios-atencion`);

        if (!response.ok) {
            throw new Error();
        }

        return await response.json();
    } catch {
        throw new Error("No se pudieron cargar los horarios de atención.");
    }
}

// Obtiene el detalle de un horario específico.
export async function getScheduleById(id) {
    try {
        const response = await fetch(`${API_URL}/horarios-atencion/${id}`);

        if (!response.ok) {
            throw new Error();
        }

        return await response.json();
    } catch {
        throw new Error("No se pudo cargar el detalle del horario.");
    }
}
