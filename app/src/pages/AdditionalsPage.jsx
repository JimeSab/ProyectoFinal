import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { AdditionalCard } from "@/components/AdditionalCard";
import { PageHeader } from "@/components/PageHeader";
import { SearchBar } from "@/components/SearchBar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/useAuth";

import {
    getAdditionals,
    updateAdditionalStatus,
} from "@/services/additionalsService";

export function AdditionalsPage() {
    /* Recibe mensajes enviados desde otras páginas. */
    const location = useLocation();

    /* Guarda la lista de adicionales. */
    const [additionals, setAdditionals] = useState([]);

    /* Guarda el texto del buscador. */
    const [search, setSearch] = useState("");

    /* Controla el estado de carga. */
    const [loading, setLoading] = useState(true);

    /* Guarda los mensajes de error. */
    const [error, setError] = useState("");

    /* Guarda los mensajes de éxito. */
    const [success, setSuccess] = useState(
        location.state?.success || ""
    );

    /* Guarda el ID del adicional que se está actualizando. */
    const [changingId, setChangingId] = useState(null);

    const { isAuthenticated, user } = useAuth();
    const isAdmin = user?.rol?.nombre === "Administrador";

    /* Carga los adicionales cuando se abre la página. */
    useEffect(() => {
        async function loadAdditionals() {
            try {
                /* Inicia la carga y limpia errores anteriores. */
                setLoading(true);
                setError("");

                /* Consulta los adicionales en el API. */
                const response = await getAdditionals();

                /* Guarda los datos recibidos. */
                setAdditionals(response.data);
            } catch (requestError) {
                /* Guarda el error de la consulta. */
                setError(requestError.message);
            } finally {
                /* Finaliza el estado de carga. */
                setLoading(false);
            }
        }

        loadAdditionals();
    }, []);

    /* Filtra y ordena los adicionales. */
    const filteredAdditionals = useMemo(() => {
        /* Normaliza el texto de búsqueda. */
        const normalizedSearch = search.trim().toLowerCase();

        /* Filtra por nombre o descripción. */
        const filtered = additionals.filter((additional) => {
            return (
                additional.nombre
                    .toLowerCase()
                    .includes(normalizedSearch) ||
                additional.descripcion
                    .toLowerCase()
                    .includes(normalizedSearch)
            );
        });

        /* Ordena los resultados por nombre. */
        return [...filtered].sort((firstAdditional, secondAdditional) =>
            firstAdditional.nombre.localeCompare(
                secondAdditional.nombre,
                "es"
            )
        );
    }, [additionals, search]);

    /* Activa o desactiva un adicional. */
    async function handleStatusChange(additional) {
        const action = additional.activo
            ? "desactivar"
            : "activar";

        /* Solicita confirmación antes del cambio. */
        const confirmed = window.confirm(
            `¿Desea ${action} el servicio adicional "${additional.nombre}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            /* Identifica el adicional que se está actualizando. */
            setChangingId(additional.id);

            /* Limpia los mensajes anteriores. */
            setError("");
            setSuccess("");

            /* Envía el nuevo estado al API. */
            const response = await updateAdditionalStatus(
                additional.id,
                !additional.activo
            );

            /* Actualiza el adicional dentro de la lista. */
            setAdditionals((currentAdditionals) =>
                currentAdditionals.map((currentAdditional) =>
                    currentAdditional.id === additional.id
                        ? response.data
                        : currentAdditional
                )
            );

            /* Muestra el mensaje de éxito. */
            setSuccess(response.message);
        } catch (requestError) {
            /* Muestra el error del cambio de estado. */
            setError(requestError.message);
        } finally {
            /* Vuelve a habilitar el botón. */
            setChangingId(null);
        }
    }

    /* Muestra un mensaje mientras carga. */
    if (loading) {
        return (
            <p className="text-center text-muted-foreground">
                Cargando servicios adicionales...
            </p>
        );
    }

    return (
        <section>
            {/* Muestra el encabezado y el botón para crear. */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <PageHeader
                    title="Servicios adicionales"
                    description="Listado de servicios adicionales disponibles"
                />

                {isAuthenticated && isAdmin && (
                    <Button
                        asChild
                        className="bg-[#F5AFAF] text-black hover:bg-[#f29c9c]"
                    >
                        <Link to="/adicionales/nuevo">Nuevo adicional</Link>
                    </Button>
                )}
            </div>

            {/* Muestra los mensajes de éxito. */}
            {success && (
                <Alert className="mb-5 border-green-200 bg-green-50">
                    <AlertDescription className="text-green-800">
                        {success}
                    </AlertDescription>
                </Alert>
            )}

            {/* Muestra los mensajes de error. */}
            {error && (
                <Alert variant="destructive" className="mb-5">
                    <AlertDescription>
                        {error}
                    </AlertDescription>
                </Alert>
            )}

            {/* Muestra el buscador. */}
            <SearchBar
                value={search}
                onChange={setSearch}
            />

            {/* Muestra las tarjetas o un mensaje si no hay resultados. */}
            {filteredAdditionals.length === 0 ? (
                <p className="rounded-lg border border-dashed p-8 text-center">
                    No hay servicios adicionales para mostrar.
                </p>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredAdditionals.map((additional) => (
                        <AdditionalCard
                            key={additional.id}
                            additional={additional}
                            onRequestStatusChange={handleStatusChange}
                            changingStatus={
                                changingId === additional.id
                            }
                        />
                    ))}
                </div>
            )}
        </section>
    );
}