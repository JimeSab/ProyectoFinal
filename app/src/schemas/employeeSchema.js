import { z } from "zod";

// Valida la información obligatoria y el formato del código del empleado.
export const employeeSchema = z.object({
    usuarioId: z
        .string()
        .min(1, "Debe seleccionar un usuario."),

    especialidadId: z
        .string()
        .min(1, "Debe seleccionar una especialidad."),

    codigoEmpleado: z
        .string()
        .trim()
        .min(1, "El código es obligatorio.")
        .min(3, "Debe tener al menos 3 caracteres.")
        .max(30, "El código no puede superar 30 caracteres.")
        .regex(
            /^[A-Za-z0-9_-]+$/,
            "El código solo puede contener letras, números, guiones y guion bajo."
        ),

    descripcion: z
        .string()
        .trim()
        .max(500, "La descripción no puede superar 500 caracteres.")
        .optional(),

    servicioIds: z
        .array(z.string())
        .min(1, "Debe seleccionar al menos un servicio.")
        .refine(
            (ids) => new Set(ids).size === ids.length,
            "No puede repetir servicios."
        ),
});
