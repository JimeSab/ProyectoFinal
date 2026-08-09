import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getServiceById } from "../services/servicesService";
import { PageHeader } from "@/components/PageHeader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function ServiceDetailPage() {
    const { id } = useParams();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchService() {
            try {
                setLoading(true);
                const data = await getServiceById(id);
                setService(data.data);
            } catch (error) {
                console.error(error);
                setError("No se pudo cargar el detalle del servicio");
            } finally {
                setLoading(false);
            }
        }

        fetchService();
    }, [id]);

    if (loading) {
        return <p className="text-center text-muted-foreground">Cargando detalle...</p>;
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    if (!service) {
        return (
            <Alert variant="destructive">
                <AlertDescription>El servicio no existe.</AlertDescription>
            </Alert>
        );
    }

    const API_URL = import.meta.env.VITE_API_URL;

    return (
        <section className="space-y-6">
            <PageHeader
                title={service.nombre}
                description="Detalle del servicio"
            />

            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl overflow-hidden border bg-white">
                    <img
                        src={`${API_URL}/images/${service.imagen}`}
                        alt={service.nombre}
                        className="h-full w-full object-cover"
                    />
                </div>

                <div className="space-y-4 rounded-xl border bg-white p-6">
                    <p>
                        <strong>Descripción:</strong> {service.descripcion}
                    </p>
                    <p>
                        <strong>Precio base:</strong> ₡
                        {Number(service.precioBase).toLocaleString("es-CR")}
                    </p>
                    <p>
                        <strong>Duración:</strong> {service.duracionMinutos} minutos
                    </p>
                    <p>
                        <strong>Estado:</strong>{" "}
                        {service.activo ? "Activo" : "Inactivo"}
                    </p>
                    <p>
                        <strong>Especialidad ID:</strong> {service.especialidadId}
                    </p>

                    <Button asChild className="bg-[#F5AFAF] text-black hover:bg-[#f29c9c]">
                        <Link to="/servicios">Volver</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}