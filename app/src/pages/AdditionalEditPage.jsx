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
    /*
    Obtiene el ID de la dirección usando useParams para identificar
    cuál servicio adicional debe consultarse y actualizarse.
    */
    const { id } = useParams();

    /*
    Utiliza useNavigate para regresar al listado después
    de actualizar correctamente el servicio adicional.
    */
    const navigate = useNavigate();

    /*
    Guarda los datos recibidos del API usando useState
    para cargarlos dentro del formulario de edición.
    */
    const [additional, setAdditional] = useState(null);

    /*
    Controla la carga usando useState para mostrar un mensaje
    mientras se consulta la información del adicional.
    */
    const [loading, setLoading] = useState(true);

    /*
    Guarda los errores usando useState para mostrarlos
    si falla la consulta o la actualización.
    */
    const [error, setError] = useState("");

    /*
    Consulta el adicional usando useEffect cuando se abre la página
    o cuando cambia el ID recibido desde la dirección.
    */
    // Carga el adicional seleccionado para mostrar sus datos actuales en el formulario.
    useEffect(() => {
        async function loadAdditional() {
            try {
                setLoading(true);
                setError("");

                /*
                Obtiene el registro usando getAdditionalById
                para cargar sus datos actuales en el formulario.
                */
                const response = await getAdditionalById(id);

                // Guarda la información recibida para mostrarla en el formulario.
                setAdditional(response.data);
            } catch (requestError) {
                /*
                Guarda el mensaje recibido del API usando setError
                para mostrarlo claramente en la interfaz.
                */
                setError(requestError.message);
            } finally {
                // Finaliza el estado de carga aunque la solicitud falle.
                setLoading(false);
            }
        }

        loadAdditional();
    }, [id]);

    /*
    Actualiza el adicional usando updateAdditional, el ID recibido
    y los nuevos datos validados por AdditionalForm.
    */
    // Envía los cambios del adicional y conserva su identificador original.
    async function handleUpdate(formData) {
        try {
            setError("");

            /*
            Envía nombre, descripción y precio usando PUT
            para actualizar todos los campos editables del adicional.
            */
            const response = await updateAdditional(id, formData);

            /*
            Regresa al listado usando navigate y envía el mensaje
            de éxito recibido desde el API.
            */
            navigate("/adicionales", {
                state: {
                    success: response.message,
                },
            });
        } catch (requestError) {
            /*
            Guarda el error usando setError para mantener
            el formulario visible y explicar qué ocurrió.
            */
            setError(requestError.message);
        }
    }

    // Muestra un mensaje mientras se consultan los datos.
    if (loading) {
        return (
            <p className="text-center text-muted-foreground">
                Cargando servicio adicional...
            </p>
        );
    }

    /*
    Muestra una alerta cuando no fue posible encontrar
    o cargar el servicio adicional solicitado.
    */
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
            {/* Utiliza PageHeader para mantener el encabezado del proyecto. */}
            <PageHeader
                title="Editar servicio adicional"
                description={`Modifique la información de ${additional.nombre}`}
            />

            {/* Muestra el error cuando el API rechaza la actualización. */}
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/*
            Reutiliza AdditionalForm y envía initialData para mostrar
            los valores actuales del adicional dentro de los campos.
            */}
            <AdditionalForm
                initialData={additional}
                onSubmit={handleUpdate}
                submitText="Actualizar adicional"
            />
        </section>
    );
}
