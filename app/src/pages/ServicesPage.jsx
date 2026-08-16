import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getServices } from "../services/servicesService";
import { ServiceList } from "../components/ServiceList";
import { PageHeader } from "@/components/PageHeader";
import { SearchBar } from "@/components/SearchBar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/useAuth";

export function ServicesPage() {
    const [services, setServices] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated, user } = useAuth();
    const isAdmin = user?.rol?.nombre === "Administrador";

    useEffect(() => {
        async function fetchServices() {
            try {
                setLoading(true);
                const data = await getServices();
                setServices(data.data);
            } catch (error) {
                console.error("Error al cargar servicios", error);
                setError("Error al cargar servicios");
            } finally {
                setLoading(false);
            }
        }

        fetchServices();
    }, []);

    const filteredServices = services.filter((service) =>
        service.nombre.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <p className="text-center text-muted-foreground">
                Cargando servicios...
            </p>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    return (
        <section>
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <PageHeader
                    title="Servicios"
                    description="Listado de servicios disponibles"
                    isBadge={false}
                />

                {isAuthenticated && isAdmin && (
                    <Button
                        asChild
                        className="bg-[#F5AFAF] text-black hover:bg-[#f29c9c]"
                    >
                        <Link to="/servicios/nuevo">Nuevo servicio</Link>
                    </Button>
                )}
            </div>

            <SearchBar value={search} onChange={setSearch} />

            {filteredServices.length === 0 ? (
                <p>No hay resultados</p>
            ) : (
                <ServiceList services={filteredServices} />
            )}
        </section>
    );
}