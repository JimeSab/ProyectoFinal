import { z } from "zod";

export const registrationSchema = z
    .object({
        nombre: z
        .string()
        .trim()
        .min(1, "El nombre es obligatorio.")
        .min(3, "El nombre debe tener al menos 3 caracteres.")
        .max(100, "El nombre no debe superar 100 caracteres.")
        .regex(
            /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/,
            "El nombre solo puede contener letras y espacios."
        ),

        primerApellido: z
            .string()
            .trim()
            .min(1, "El primer apellido es obligatorio.")
            .min(2, "El primer apellido debe tener al menos 2 caracteres."),
        segundoApellido: z
            .string()
            .trim()
            .optional()
            .or(z.literal("")),

        correo: z
        .string()
        .trim()
        .min(1, "El correo electrónico es obligatorio.")
        .email("Ingrese un correo electrónico válido."),

        telefono: z
        .string()
        .trim()
        .min(1, "El teléfono es obligatorio.")
        .regex(
            /^[0-9]{8}$/,
            "El teléfono debe contener exactamente 8 dígitos y escribirse sin guiones."
        ),
        
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