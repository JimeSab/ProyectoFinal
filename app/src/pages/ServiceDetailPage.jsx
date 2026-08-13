import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";

import { getServiceById } from "@/services/servicesService";

const IMAGE_URL = import.meta.env.VITE_API_URL;

export function ServiceDetailPage() {
    const { id } = useParams();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadService() {
            try {
                setLoading(true);
                setError("");
                const data = await getServiceById(id);
                if (!data) {
                    setService(null);
                    return;
                }
                setService(data.data);
            } catch {
                setError("Ocurrió un error al cargar el servicio.");
            } finally {
                setLoading(false);
            }
        }

        loadService();
    }, [id]);

    if (loading) {
        return <p className="text-muted-foreground">Cargando detalle...</p>;
    }

    if (error) {
        return <Alert>{error}</Alert>;
    }

    if (!service) {
        return (
            <section className="space-y-4">
                <PageHeader
                    title="Servicio no encontrado"
                    description="No existe un servicio asociado al identificador solicitado."
                />
                <Button asChild variant="outline">
                    <Link to="/servicios">Volver al listado de servicios</Link>
                </Button>
            </section>
        );
    }

    return (
        <section className="space-y-6">
            <Button asChild variant="outline">
                <Link to="/servicios">Volver al listado de servicios</Link>
            </Button>

            <PageHeader
                title={service.nombre}
                description="Información detallada del servicio seleccionado"
            />

            <Card className="overflow-hidden">
                {service.imagen && (
                    <img
                        src={`${IMAGE_URL}/images/${service.imagen}`}
                        alt={service.nombre}
                        className="h-72 w-full object-cover"
                    />
                )}

                <CardHeader>
                    <CardTitle>{service.nombre}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    <p className="leading-relaxed text-muted-foreground">
                        {service.descripcion}
                    </p>

                    <p>
                        <strong>Precio base:</strong> ₡
                        {Number(service.precioBase).toLocaleString("es-CR")}
                    </p>

                    <p>
                        <strong>Duración:</strong> {service.duracionMinutos} minutos
                    </p>

                    <p>
                        <strong>Especialidad ID:</strong> {service.especialidadId}
                    </p>

                    <p>
                        <strong>Estado:</strong>{" "}
                        {service.activo ? "Activo" : "Inactivo"}
                    </p>

                    <div className="flex gap-3">
                        <Button asChild>
                            <Link to={`/servicios/${service.id}/editar`}>
                                Editar servicio
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}