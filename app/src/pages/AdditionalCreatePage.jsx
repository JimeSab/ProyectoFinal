import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { AdditionalForm } from "@/components/AdditionalForm";
import { PageHeader } from "@/components/PageHeader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createAdditional } from "@/services/additionalsService";

export function AdditionalCreatePage() {
    /*
    Utiliza useNavigate para cambiar al listado de adicionales
    después de crear correctamente un registro.
    */
    const navigate = useNavigate();

    /*
    Guarda los errores usando useState para poder mostrarlos
    en la interfaz cuando el API rechaza la información.
    */
    const [error, setError] = useState("");

    /*
    Crea el servicio adicional usando createAdditional y los datos
    recibidos desde AdditionalForm.
    */
    // Crea el adicional y regresa al listado cuando el API confirma la operación.
    async function handleCreate(formData) {
        try {
            // Elimina cualquier mensaje de error anterior.
            setError("");

            /*
            Envía el nombre, la descripción y el precio al API
            utilizando la función createAdditional.
            */
            const response = await createAdditional(formData);

            /*
            Utiliza navigate para regresar al listado y envía el mensaje
            de éxito para mostrar que el adicional fue creado.
            */
            navigate("/adicionales", {
                state: {
                    success: response.message,
                },
            });
        } catch (requestError) {
            /*
            Guarda el mensaje recibido del API usando setError
            para mostrarlo en la página.
            */
            setError(requestError.message);
        }
    }

    return (
        <section className="space-y-6">
            {/* Utiliza PageHeader para mantener el encabezado reutilizable del proyecto. */}
            <PageHeader
                title="Crear servicio adicional"
                description="Registre un nuevo servicio adicional para las citas"
            />

            {/*
            Muestra una alerta de shadcn cuando el API devuelve
            un error durante la creación.
            */}
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/*
            Utiliza AdditionalForm para mostrar los campos y ejecuta
            handleCreate cuando el formulario pasa las validaciones.
            */}
            <AdditionalForm onSubmit={handleCreate} />
        </section>
    );
}
