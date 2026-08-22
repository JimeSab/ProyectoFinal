import { z } from "zod";

/*
Obtiene la fecha actual en formato año-mes-día
para impedir que se seleccionen fechas pasadas.
*/
function getToday() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

/*
Usa Zod para validar los datos escritos o seleccionados
antes de enviar una cita al API.
*/
export const appointmentSchema = z.object({
    clienteId: z
        .string()
        .min(1, "Debe seleccionar un cliente."),

    servicioId: z
        .string()
        .min(1, "Debe seleccionar un servicio."),

    empleadoId: z
        .string()
        .min(1, "Debe seleccionar un empleado."),

    fecha: z
        .string()
        .min(1, "Debe seleccionar una fecha.")
        .regex(
            /^\d{4}-\d{2}-\d{2}$/,
            "La fecha no tiene un formato válido."
        )
        .refine(
            (value) => value >= getToday(),
            {
                message: "La fecha no puede estar en el pasado.",
            }
        ),

    horaInicio: z
        .string()
        .min(1, "Debe seleccionar una hora disponible.")
        .regex(
            /^([01]\d|2[0-3]):[0-5]\d$/,
            "La hora no tiene un formato válido."
        ),

    observaciones: z
        .string()
        .trim()
        .max(
            500,
            "Las observaciones no pueden superar 500 caracteres."
        )
        .refine(
            (value) =>
                value.length === 0 ||
                value.length >= 3,
            "Las observaciones deben tener al menos 3 caracteres."
        ),

    adicionalIds: z
        .array(z.string())
        .refine(
            (ids) =>
                new Set(ids).size === ids.length,
            "No puede seleccionar adicionales repetidos."
        ),
});

/*
Valida que la cancelación tenga un motivo
antes de enviarla al API.
*/
export const cancellationSchema = z.object({
    motivoCancelacion: z
        .string()
        .trim()
        .min(
            5,
            "El motivo debe contener al menos 5 caracteres."
        )
        .max(
            255,
            "El motivo no puede superar 255 caracteres."
        ),
});