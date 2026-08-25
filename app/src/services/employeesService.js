const API_URL = import.meta.env.VITE_API_URL;

// Obtiene el listado completo de empleados para el administrador.
export async function getEmployees() {
    try {
        const response = await fetch(`${API_URL}/empleados`);
        if (!response.ok) {
            throw new Error();
        }
        return await response.json();
    } catch {
        throw new Error("Error al obtener empleados");
    }
}

// Obtiene el detalle de un empleado, incluyendo sus servicios y citas.
export async function getEmployeeById(id) {
    try {
        const response = await fetch(`${API_URL}/empleados/${id}`);
        if (!response.ok) {
            throw new Error();
        }
        return await response.json();
    } catch {
        throw new Error("No se pudo cargar al empleado");
    }
}

// Registra un empleado y sus asociaciones de servicios.
export async function createEmployee(employeeData) {
    try {
        const response = await fetch(`${API_URL}/empleados`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(employeeData),
        });

        if (!response.ok) {
            const data = await response.json();
            console.error("========== ERROR API ==========");
            console.error(data);
            console.error("===============================");
            throw new Error(
                data.message || "No se pudo guardar el empleado."
            );
        }

        return await response.json();
    } catch (error) {
        throw new Error(
            error.message || "No se pudo crear el empleado"
        );
    }
}

// Actualiza la información y los servicios asignados al empleado.
export async function updateEmployee(id, employeeData) {
    try {
        const response = await fetch(`${API_URL}/empleados/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(employeeData),
        });

        if (!response.ok) {
            const data = await response.json();
            console.error("========== ERROR API UPDATE ==========");
            console.error(data);
            console.error("======================================");
            throw new Error(
                data.message || "No se pudo guardar el empleado."
            );
        }

        return await response.json();
    } catch (error) {
        throw new Error(
            error.message || "No se pudo actualizar el empleado."
        );
    }
}

// Cambia el estado del empleado según las validaciones del API.
export async function updateEmployeeStatus(id, activo) {
    try {
        const response = await fetch(`${API_URL}/empleados/${id}/estado`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ activo }),
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
        throw new Error("No se pudo actualizar el estado del empleado.");
    }
}

// Consulta usuarios disponibles para asociarlos a un empleado.
export async function getUsers(rol) {
    try {
        const query = rol
            ? `?rol=${encodeURIComponent(rol)}` // Lllamar solo usuarios con rol de empleado
            : "";

        const response = await fetch(
            `${API_URL}/usuarios${query}`
        );

        if (!response.ok) {
            throw new Error();
        }

        return await response.json();
    } catch {
        throw new Error(
            "No se pudieron cargar los usuarios"
        );
    }
}

export async function getSpecialties() {
    try {
        const response = await fetch(`${API_URL}/especialidades`)
        if (!response.ok) {
            throw new Error();
        }
        return await response.json();
    } catch {
        throw new Error("No se pudieron cargar las especialidades");
    }
}

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

// Consulta la agenda y restricciones de un empleado para una fecha.
export async function getEmployeeAgenda(id, fecha) {
    try {
        const response = await fetch(`${API_URL}/empleados/${id}/agenda?fecha=${fecha}`);

        if (!response.ok) {
            throw new Error();
        }

        return await response.json();
    } catch {
        throw new Error("No se pudo cargar la agenda del empleado.");
    }
}

/*
Usa servicio seleccionado para obtener solo
los empleados activos que pueden hacer ese servicio
*/
// Obtiene empleados activos que tienen asignado el servicio seleccionado.
export async function getActiveEmployees(serviceId) {
    try {
        const response = await fetch(
            `${API_URL}/empleados/activos?servicioId=${encodeURIComponent(serviceId)}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "No se pudieron cargar los empleados activos."
            );
        }

        return data;
    } catch (error) {
        throw new Error(
            error.message ||
            "No se pudieron cargar los empleados activos."
        );
    }
}
