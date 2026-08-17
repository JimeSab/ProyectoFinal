const API_URL = import.meta.env.VITE_API_URL;

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
            throw new Error(JSON.stringify(data, null, 2));
        }

        return await response.json();
    } catch {
        throw new Error("No se pudo crear el empleado");
    }
}

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
            throw new Error(JSON.stringify(data, null, 2));
        }

        return await response.json();
    } catch {
        throw new Error("No se pudo actualizar el empleado.");
    }
}

export async function updateEmployeeStatus(id, activo) {
    try {
        const response = await fetch(`${API_URL}/empleados/${id}/estado`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({activo}),
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

export async function getUsers() {
    try {
        const response = await fetch(`${API_URL}/usuarios`)
        if (!response.ok) {
            throw new Error();
        }
        return await response.json();
    } catch {
        throw new Error("No se pudieron cargar los usuarios");
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