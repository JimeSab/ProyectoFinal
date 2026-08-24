import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { AdditionalForm } from "@/components/AdditionalForm";

import { PageHeader } from "@/components/PageHeader";

import { Alert, AlertDescription } from "@/components/ui/alert";

import {
    getAdditionalById,
    updateAdditional,
} from "@/services/additionalsService";

export function AdditionalEditPage() {
    /* Obtiene el ID desde la dirección. */
    const { id } = useParams();

    /* Permite regresar al listado. */
    const navigate = useNavigate();

    /* Guarda los datos del adicional. */
    const [additional, setAdditional] = useState(null);

    /* Controla el estado de carga. */
    const [loading, setLoading] = useState(true);

    /* Guarda los errores del API. */
    const [error, setError] = useState("");

    /* Carga el adicional cuando cambia el ID. */
    useEffect(() => {
        async function loadAdditional() {
            try {
                setLoading(true);
                setError("");

                /* Consulta el adicional seleccionado. */
                const response = await getAdditionalById(id);

                /* Guarda los datos para el formulario. */
                setAdditional(response.data);
            } catch (requestError) {
                /* Guarda el error recibido. */
                setError(requestError.message);
            } finally {
                /* Finaliza la carga. */
                setLoading(false);
            }
        }

        loadAdditional();
    }, [id]);

    /* Envía los cambios del adicional. */
    async function handleUpdate(formData) {
        try {
            setError("");

            /* Actualiza el adicional en el API. */
            const response = await updateAdditional(id, formData);

            /* Regresa al listado con el mensaje de éxito. */
            navigate("/adicionales", {
                state: {
                    success: response.message,
                },
            });
        } catch (requestError) {
            /* Muestra el error de actualización. */
            setError(requestError.message);
        }
    }

    /* Muestra un mensaje mientras carga. */
    if (loading) {
        return (
            <p className="text-center text-muted-foreground">
                Cargando servicio adicional...
            </p>
        );
    }

    /* Muestra un error si no existe el adicional. */
    if (!additional) {
        return (
            <Alert variant="destructive">
                <AlertDescription>
                    {error || "El servicio adicional no existe."}
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <section className="space-y-6">
            {/* Muestra el encabezado. */}
            <PageHeader
                title="Editar servicio adicional"
                description={`Modifique la información de ${additional.nombre}`}
            />

            {/* Muestra el error del API. */}
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Muestra el formulario con los datos actuales. */}
            <AdditionalForm
                initialData={additional}
                onSubmit={handleUpdate}
                submitText="Actualizar adicional"
            />
        </section>
    );
}