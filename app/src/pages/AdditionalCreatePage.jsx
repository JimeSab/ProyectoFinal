import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { AdditionalForm } from "@/components/AdditionalForm";

import { PageHeader } from "@/components/PageHeader";

import { Alert, AlertDescription } from "@/components/ui/alert";

import { createAdditional } from "@/services/additionalsService";

export function AdditionalCreatePage() {

    /* Permite regresar al listado después de crear el adicional. */
    const navigate = useNavigate();

    /* Guarda los errores enviados por el API. */
    const [error, setError] = useState("");

    /* Envía los datos al API para crear el servicio adicional. */
    async function handleCreate(formData) {
        try {
            /* Limpia cualquier error anterior. */
            setError("");

            /* Crea el adicional con los datos del formulario. */
            const response = await createAdditional(formData);

            /* Regresa al listado y envía el mensaje de éxito. */
            navigate("/adicionales", {
                state: {
                    success: response.message,
                },
            });
        } catch (requestError) {
            /* Muestra el error recibido del API. */
            setError(requestError.message);
        }
    }

    return (
        <section className="space-y-6">
            {/* Muestra el encabezado de la página. */}
            <PageHeader
                title="Crear servicio adicional"
                description="Registre un nuevo servicio adicional para las citas"
            />

            {/* Muestra una alerta si ocurre un error. */}
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Muestra el formulario y ejecuta handleCreate al enviarlo. */}
            <AdditionalForm onSubmit={handleCreate} />
        </section>
    );
}