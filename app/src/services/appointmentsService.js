const API_URL = import.meta.env.VITE_API_URL;

/*
Obtiene todas las citas.
GET /citas
*/
export async function getAppointments() {
    try {
        const response = await fetch(`${API_URL}/citas`);

        if (!response.ok) {
            throw new Error();
        }

        return await response.json();
    } catch {
        throw new Error("No se pudieron cargar las citas.");
    }
}

/*
Obtiene las citas de un cliente usando su ID.
GET /citas/cliente/:clienteId
*/
export async function getAppointmentsByClient(clienteId) {
    try {
        const response = await fetch(
            `${API_URL}/citas/cliente/${clienteId}`
        );

        if (!response.ok) {
            throw new Error();
        }

        return await response.json();
    } catch {
        throw new Error(
            "No se pudieron cargar las citas del cliente."
        );
    }
}

/*
Obtiene las citas de un empleado usando su ID.
GET /citas/empleado/:empleadoId
*/
export async function getAppointmentsByEmployee(empleadoId) {
    try {
        const response = await fetch(
            `${API_URL}/citas/empleado/${empleadoId}`
        );

        if (!response.ok) {
            throw new Error();
        }

        return await response.json();
    } catch {
        throw new Error(
            "No se pudieron cargar las citas del empleado."
        );
    }
}

/*
Obtiene el detalle de una cita usando su ID.
GET /citas/:id
*/
export async function getAppointmentById(id) {
    try {
        const response = await fetch(
            `${API_URL}/citas/${id}`
        );

        if (!response.ok) {
            throw new Error();
        }

        return await response.json();
    } catch {
        throw new Error(
            "No se pudo cargar el detalle de la cita."
        );
    }
}

/*
Envía los datos para comprobar la disponibilidad.
POST /citas/disponibilidad
*/
export async function checkAvailability(availabilityData) {
    try {
        const response = await fetch(
            `${API_URL}/citas/disponibilidad`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(availabilityData),
            }
        );

        if (!response.ok) {
            const data = await response.json();

            throw new Error(
                data.message ||
                "No se pudo comprobar la disponibilidad."
            );
        }

        return await response.json();
    } catch (error) {
        throw new Error(
            error.message ||
            "No se pudo comprobar la disponibilidad."
        );
    }
}

/*
Envía los datos de una nueva cita.
POST /citas
*/
export async function createAppointment(appointmentData) {
    try {
        const response = await fetch(
            `${API_URL}/citas`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(appointmentData),
            }
        );

        if (!response.ok) {
            const data = await response.json();

            throw new Error(
                data.message ||
                "No se pudo crear la cita."
            );
        }

        return await response.json();
    } catch (error) {
        throw new Error(
            error.message ||
            "No se pudo crear la cita."
        );
    }
}

/*
Actualiza una cita usando su ID.
PUT /citas/:id
*/
export async function updateAppointment(
    id,
    appointmentData
) {
    try {
        const response = await fetch(
            `${API_URL}/citas/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(appointmentData),
            }
        );

        if (!response.ok) {
            const data = await response.json();

            throw new Error(
                data.message ||
                "No se pudo actualizar la cita."
            );
        }

        return await response.json();
    } catch (error) {
        throw new Error(
            error.message ||
            "No se pudo actualizar la cita."
        );
    }
}

/*
Cancela una cita y envía el motivo.
PATCH /citas/:id/cancelar
*/
export async function cancelAppointment(
    id,
    motivoCancelacion
) {
    try {
        const response = await fetch(
            `${API_URL}/citas/${id}/cancelar`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    motivoCancelacion,
                }),
            }
        );

        if (!response.ok) {
            const data = await response.json();

            throw new Error(
                data.message ||
                "No se pudo cancelar la cita."
            );
        }

        return await response.json();
    } catch (error) {
        throw new Error(
            error.message ||
            "No se pudo cancelar la cita."
        );
    }
}

/*
Cambia el estado de una cita.
PATCH /citas/:id/estado
*/
export async function updateAppointmentStatus(
    id,
    estadoCitaId
) {
    try {
        const response = await fetch(
            `${API_URL}/citas/${id}/estado`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    estadoCitaId,
                }),
            }
        );

        if (!response.ok) {
            const data = await response.json();

            throw new Error(
                data.message ||
                "No se pudo cambiar el estado."
            );
        }

        return await response.json();
    } catch (error) {
        throw new Error(
            error.message ||
            "No se pudo cambiar el estado."
        );
    }
}

/*
Obtiene la agenda de un empleado para una fecha.
GET /citas/agenda-empleado/:empleadoId
*/
export async function getAppointmentEmployeeAgenda(
    empleadoId,
    fecha
) {
    try {
        const response = await fetch(
            `${API_URL}/citas/agenda-empleado/${empleadoId}?fecha=${fecha}`
        );

        if (!response.ok) {
            throw new Error();
        }

        return await response.json();
    } catch {
        throw new Error(
            "No se pudo cargar la agenda del empleado."
        );
    }
}

/*
Obtiene la agenda diaria del establecimiento.
GET /citas/agenda-diaria
*/
export async function getDailyAgenda(fecha) {
    try {
        const response = await fetch(
            `${API_URL}/citas/agenda-diaria?fecha=${fecha}`
        );

        if (!response.ok) {
            throw new Error();
        }

        return await response.json();
    } catch {
        throw new Error(
            "No se pudo cargar la agenda diaria."
        );
    }
}

/*
Obtiene los usuarios que tienen rol Cliente.
GET /usuarios?rol=Cliente
*/
export async function getActiveClients() {
    try {
        const response = await fetch(
            `${API_URL}/usuarios?rol=Cliente`
        );

        if (!response.ok) {
            throw new Error();
        }

        return await response.json();
    } catch {
        throw new Error(
            "No se pudieron cargar los clientes."
        );
    }
}

/*
Obtiene los estados activos de las citas.
GET /estados-cita
*/
export async function getAppointmentStatuses() {
    try {
        const response = await fetch(
            `${API_URL}/estados-cita`
        );

        if (!response.ok) {
            throw new Error();
        }

        return await response.json();
    } catch {
        throw new Error(
            "No se pudieron cargar los estados de cita."
        );
    }
}