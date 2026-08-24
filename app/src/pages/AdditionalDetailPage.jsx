import { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import { useAuth } from "@/auth/useAuth";

import { PageHeader } from "@/components/PageHeader";

import { Alert, AlertDescription } from "@/components/ui/alert";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { getAdditionalById } from "@/services/additionalsService";

export function AdditionalDetailPage() {
    /* Obtiene el ID del adicional desde la URL. */
    const { id } = useParams();

    /* Guarda la información del adicional. */
    const [additional, setAdditional] = useState(null);

    /* Indica si los datos todavía están cargando. */
    const [loading, setLoading] = useState(true);

    /* Guarda los errores recibidos del API. */
    const [error, setError] = useState("");

    const { isAuthenticated, user } = useAuth();

    const isAdmin = user?.rol?.nombre === "Administrador";

    /* Consulta el adicional cuando cambia el ID. */
    useEffect(() => {
        async function loadAdditional() {
            try {
                /* Inicia la carga y limpia errores anteriores. */
                setLoading(true);
                setError("");

                /* Obtiene el adicional seleccionado desde el API. */
                const response = await getAdditionalById(id);

                /* Guarda los datos recibidos. */
                setAdditional(response.data);
            } catch (requestError) {
                /* Guarda el error para mostrarlo en pantalla. */
                setError(requestError.message);
            } finally {
                /* Finaliza la carga. */
                setLoading(false);
            }
        }

        loadAdditional();
    }, [id]);

    /* Muestra un mensaje mientras carga la información. */
    if (loading) {
        return (
            <p className="text-center text-muted-foreground">
                Cargando detalle del servicio adicional...
            </p>
        );
    }

    /* Muestra un error si no se encontró el adicional. */
    if (error || !additional) {
        return (
            <section className="space-y-4">
                <Alert variant="destructive">
                    <AlertDescription>
                        {error || "El servicio adicional no existe."}
                    </AlertDescription>
                </Alert>

                <Button asChild variant="outline">
                    <Link to="/adicionales">
                        Volver
                    </Link>
                </Button>
            </section>
        );
    }

    return (
        <section className="space-y-6">
            {/* Regresa al listado de adicionales. */}
            <Button asChild variant="outline">
                <Link to="/adicionales">
                    Volver
                </Link>
            </Button>

            {/* Muestra el encabezado de la página. */}
            <PageHeader
                title={additional.nombre}
                description="Información detallada del servicio adicional"
            />

            {/* Muestra la información dentro de una tarjeta. */}
            <Card className="mx-auto max-w-3xl">
                <CardHeader className="grid grid-cols-[1fr_auto] items-start gap-3">
                    <CardTitle className="text-2xl">
                        {additional.nombre}
                    </CardTitle>

                    {/* Muestra si está activo o inactivo. */}
                    <Badge
                        variant="outline"
                        className={
                            additional.activo
                                ? "border-green-200 bg-green-50 text-green-700"
                                : "border-gray-200 bg-gray-100 text-gray-600"
                        }
                    >
                        {additional.activo ? "Activo" : "Inactivo"}
                    </Badge>
                </CardHeader>

                <CardContent className="grid gap-5">
                    {/* Muestra la descripción del adicional. */}
                    <div>
                        <p className="mb-1 text-sm font-medium">
                            Descripción
                        </p>

                        <p className="leading-relaxed text-muted-foreground">
                            {additional.descripcion}
                        </p>
                    </div>

                    {/* Muestra el precio con formato de Costa Rica. */}
                    <div>
                        <p className="mb-1 text-sm font-medium">
                            Precio adicional
                        </p>

                        <p className="text-2xl font-bold">
                            ₡
                            {Number(additional.precio).toLocaleString(
                                "es-CR"
                            )}
                        </p>
                    </div>

                    {/* Permite editar si el usuario es administrador. */}
                    {isAuthenticated && isAdmin && (
                        <Button
                            asChild
                            className="bg-[#F5AFAF] text-black hover:bg-[#f29c9c]"
                        >
                            <Link
                                to={`/adicionales/${additional.id}/editar`}
                            >
                                Editar servicio adicional
                            </Link>
                        </Button>
                    )}
                </CardContent>
            </Card>
        </section>
    );
}