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
    /*
    Utiliza useLocation para recibir el mensaje enviado por la página
    de creación o edición después de guardar correctamente un adicional.
    */
    const location = useLocation();

    /*
    Utiliza useState para guardar la lista de adicionales obtenida del API.
    Inicialmente se utiliza un arreglo vacío porque todavía no hay datos cargados.
    */
    const [additionals, setAdditionals] = useState([]);

    /*
    Guarda el texto escrito en el buscador usando useState
    para filtrar los adicionales por nombre o descripción.
    */
    const [search, setSearch] = useState("");

    /*
    Controla el estado de carga usando useState para mostrar
    un mensaje mientras se obtiene la información del API.
    */
    const [loading, setLoading] = useState(true);

    /*
    Guarda los mensajes de error usando useState para mostrarlos
    cuando falla la consulta o el cambio de estado.
    */
    const [error, setError] = useState("");

    /*
    Guarda el mensaje de éxito recibido mediante location.state
    para informar cuando un adicional fue creado o editado.
    */
    const [success, setSuccess] = useState(
        location.state?.success || ""
    );

    /*
    Guarda el ID del adicional que está cambiando de estado
    para deshabilitar únicamente el botón de ese registro.
    */
    const [changingId, setChangingId] = useState(null);

    const { isAuthenticated, user } = useAuth();
    const isAdmin = user?.rol?.nombre === "Administrador";

    /*
    Ejecuta loadAdditionals usando useEffect cuando se abre la página
    para solicitar al API la lista completa de servicios adicionales.
    */
    // Carga los servicios adicionales y muestra mensajes enviados desde otras páginas.
    useEffect(() => {
        async function loadAdditionals() {
            try {
                // Activa el mensaje de carga y elimina errores anteriores.
                setLoading(true);
                setError("");

                /*
                Obtiene los adicionales usando getAdditionals,
                que realiza una solicitud GET al API.
                */
                const response = await getAdditionals();

                /*
                Guarda response.data usando setAdditionals
                para poder mostrar los registros en la página.
                */
                setAdditionals(response.data);
            } catch (requestError) {
                /*
                Guarda el mensaje del error usando setError
                para mostrarlo en una alerta.
                */
                setError(requestError.message);
            } finally {
                /*
                Desactiva el estado de carga usando setLoading
                sin importar si la solicitud funcionó o falló.
                */
                setLoading(false);
            }
        }

        loadAdditionals();
    }, []);

    /*
    Filtra y ordena los adicionales usando useMemo para recalcular
    la lista únicamente cuando cambian los datos o la búsqueda.
    */
    // Filtra los adicionales por nombre o descripción para facilitar la búsqueda.
    const filteredAdditionals = useMemo(() => {
        // Convierte la búsqueda a minúsculas y elimina espacios externos.
        const normalizedSearch = search.trim().toLowerCase();

        /*
        Utiliza filter para conservar únicamente los registros cuyo
        nombre o descripción contienen el texto buscado.
        */
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

        /*
        Utiliza sort y localeCompare para ordenar los resultados
        alfabéticamente por nombre sin modificar el arreglo original.
        */
        return [...filtered].sort((firstAdditional, secondAdditional) =>
            firstAdditional.nombre.localeCompare(
                secondAdditional.nombre,
                "es"
            )
        );
    }, [additionals, search]);

    /*
    Activa o desactiva un adicional usando updateAdditionalStatus
    y envía al API el valor contrario a su estado actual.
    */
    // Cambia el estado del adicional y actualiza el listado después de guardar.
    async function handleStatusChange(additional) {
        const action = additional.activo
            ? "desactivar"
            : "activar";

        /*
        Utiliza confirm para solicitar autorización antes de cambiar
        el estado y evita modificarlo si el usuario presiona Cancelar.
        */
        const confirmed = window.confirm(
            `¿Desea ${action} el servicio adicional "${additional.nombre}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            // Guarda el ID para indicar cuál botón está procesándose.
            setChangingId(additional.id);

            // Elimina mensajes anteriores antes de realizar la solicitud.
            setError("");
            setSuccess("");

            /*
            Cambia el estado usando PATCH y envía el valor contrario:
            true se convierte en false y false se convierte en true.
            */
            const response = await updateAdditionalStatus(
                additional.id,
                !additional.activo
            );

            /*
            Utiliza map para actualizar solamente el adicional modificado
            y conservar los demás registros sin volver a cargar la página.
            */
            setAdditionals((currentAdditionals) =>
                currentAdditionals.map((currentAdditional) =>
                    currentAdditional.id === additional.id
                        ? response.data
                        : currentAdditional
                )
            );

            /*
            Muestra el mensaje de éxito enviado por el API
            después de actualizar correctamente el estado.
            */
            setSuccess(response.message);
        } catch (requestError) {
            // Muestra el mensaje si el cambio de estado falla.
            setError(requestError.message);
        } finally {
            // Limpia el ID para volver a habilitar el botón.
            setChangingId(null);
        }
    }

    /*
    Muestra este mensaje mientras loading sea true
    y evita intentar mostrar datos que todavía no se han recibido.
    */
    if (loading) {
        return (
            <p className="text-center text-muted-foreground">
                Cargando servicios adicionales...
            </p>
        );
    }

    return (
        <section>
            {/*
            Utiliza PageHeader para mostrar el título y Button con Link
            para navegar al formulario de creación.
            */}
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

            {/*
            Muestra una alerta verde usando el mensaje recibido
            después de crear, editar o cambiar el estado.
            */}
            {success && (
                <Alert className="mb-5 border-green-200 bg-green-50">
                    <AlertDescription className="text-green-800">
                        {success}
                    </AlertDescription>
                </Alert>
            )}

            {/* Muestra una alerta roja cuando ocurre algún error. */}
            {error && (
                <Alert variant="destructive" className="mb-5">
                    <AlertDescription>
                        {error}
                    </AlertDescription>
                </Alert>
            )}

            {/*
            Utiliza SearchBar para guardar en search lo que escribe
            el usuario y filtrar automáticamente la lista.
            */}
            <SearchBar
                value={search}
                onChange={setSearch}
            />

            {/*
            Comprueba si existen resultados para mostrar un mensaje vacío
            o crear una AdditionalCard por cada adicional usando map.
            */}
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
