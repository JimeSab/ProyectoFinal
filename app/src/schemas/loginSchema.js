import { z } from "zod";

// Valida que el correo y la contraseña cumplan los requisitos antes del login.
export const loginSchema = z.object({
    correo: z
        .string()
        .trim()
        .min(1, "El correo es obligatorio")
        .email("El correo no tiene un formato válido"),
    password: z
        .string()
        .min(1, "La contraseña es obligatoria.")
        .min(8, "La contraseña debe tener al menos 8 caracteres.")
        .regex(
            /[A-Z]/,
            "La contraseña debe contener al menos una letra mayúscula."
        )
        .regex(
            /[a-z]/,
            "La contraseña debe contener al menos una letra minúscula."
        )
        .regex(
            /[0-9]/,
            "La contraseña debe contener al menos un número."
        ),
});
