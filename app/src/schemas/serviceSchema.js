import { z } from "zod";

const validImageTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

export const serviceSchema = z.object({
    nombre: z
        .string()
        .trim()
        .min(1, "El nombre es obligatorio.")
        .min(3, "El nombre debe tener al menos 3 caracteres.")
        .max(120, "El nombre no puede superar 120 caracteres."),

    descripcion: z
        .string()
        .trim()
        .min(1, "La descripción es obligatoria.")
        .min(10, "La descripción debe tener al menos 10 caracteres.")
        .max(500, "La descripción no puede superar 500 caracteres."),

    precioBase: z.coerce
        .number({
            message: "El precio es obligatorio.",
        })
        .positive("El precio debe ser mayor que cero."),

    duracionMinutos: z.coerce
        .number({
            message: "La duración es obligatoria.",
        })
        .int("La duración debe ser un número entero.")
        .min(15, "La duración mínima es de 15 minutos.")
        .max(480, "La duración máxima es de 480 minutos."),

    especialidadId: z
        .string()
        .min(1, "Debe seleccionar una especialidad."),

    imagen: z
        .any()
        .optional()
        .refine(
            (files) =>
                !files ||
                files.length === 0 ||
                validImageTypes.includes(files[0].type),
            "Solo se permiten imágenes JPG, PNG o WEBP."
        )
        .refine(
            (files) =>
                !files ||
                files.length === 0 ||
                files[0].size <= 2 * 1024 * 1024,
            "La imagen no debe superar los 2 MB."
        ),
});