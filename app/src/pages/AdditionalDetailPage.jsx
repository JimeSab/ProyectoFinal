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
    /*
    Obtiene el ID desde la dirección usando useParams
    para consultar el servicio adicional seleccionado.
    */
    const { id } = useParams();

    /*
    Guarda el adicional usando useState para poder mostrar
    la información recibida desde el API.
    */
    const [additional, setAdditional] = useState(null);

    /*
    Controla la carga usando useState para mostrar un mensaje
    mientras se realiza la solicitud al API.
    */
    const [loading, setLoading] = useState(true);

    /*
    Guarda el mensaje de error usando useState para mostrarlo
    si el adicional no existe o falla la conexión.
    */
    const [error, setError] = useState("");

    const { isAuthenticated, user } = useAuth();
    const isAdmin = user?.rol?.nombre === "Administrador";

    /*
    Consulta el adicional usando useEffect cuando se abre la página
    o cuando cambia el ID de la dirección.
    */
    useEffect(() => {
        async function loadAdditional() {
            try {
                // Activa la carga y elimina errores anteriores.
                setLoading(true);
                setError("");

                /*
                Obtiene el detalle usando getAdditionalById,
                que realiza una solicitud GET con el ID seleccionado.
                */
                const response = await getAdditionalById(id);

                /*
                Guarda response.data usando setAdditional
                para mostrar la información en la tarjeta.
                */
                setAdditional(response.data);
            } catch (requestError) {
                /*
                Guarda el mensaje recibido usando setError
                para mostrarlo claramente en la interfaz.
                */
                setError(requestError.message);
            } finally {
                /*
                Desactiva la carga después de completar la solicitud,
                aunque haya ocurrido un error.
                */
                setLoading(false);
            }
        }

        loadAdditional();
    }, [id]);

    /*
    Muestra un mensaje mientras loading sea true
    para indicar que los datos todavía se están consultando.
    */
    if (loading) {
        return (
            <p className="text-center text-muted-foreground">
                Cargando detalle del servicio adicional...
            </p>
        );
    }

    /*
    Muestra el error y un botón para regresar cuando el API
    no devuelve información del adicional solicitado.
    */
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
                        Volver al listado
                    </Link>
                </Button>
            </section>
        );
    }

    return (
        <section className="space-y-6">
            {/*
            Utiliza Link para regresar al listado sin recargar
            completamente la aplicación.
            */}
            <Button asChild variant="outline">
                <Link to="/adicionales">
                    Volver
                </Link>
            </Button>

            {/* Utiliza PageHeader para mantener el encabezado del proyecto. */}
            <PageHeader
                title={additional.nombre}
                description="Información detallada del servicio adicional"
            />

            {/*
            Organiza los datos usando Card de shadcn
            para mantener un diseño consistente y reutilizable.
            */}
            <Card className="mx-auto max-w-3xl">
                <CardHeader className="grid grid-cols-[1fr_auto] items-start gap-3">
                    <CardTitle className="text-2xl">
                        {additional.nombre}
                    </CardTitle>

                    {/*
                    Utiliza Badge y una condición para mostrar
                    visualmente si el adicional está activo o inactivo.
                    */}
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
                    {/* Muestra la descripción recibida desde el API. */}
                    <div>
                        <p className="mb-1 text-sm font-medium">
                            Descripción
                        </p>

                        <p className="leading-relaxed text-muted-foreground">
                            {additional.descripcion}
                        </p>
                    </div>

                    {/*
                    Convierte el precio usando Number y toLocaleString
                    para presentarlo con el formato numérico de Costa Rica.
                    */}
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

                    {/*
                    Utiliza el ID dentro de Link para abrir la página
                    de edición correspondiente al adicional seleccionado.
                    */}
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