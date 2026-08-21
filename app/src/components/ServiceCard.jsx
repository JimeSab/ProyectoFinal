import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/auth/useAuth";

export function ServiceCard({
    service,
    onRequestStatusChange,
    changingStatus = false,
}) {
    const { isAuthenticated, user } = useAuth();

    const isAdmin =
        user?.rol?.nombre === "Administrador";

    const API_URL = import.meta.env.VITE_API_URL;

    return (
        <Card className="overflow-hidden">
            <div className="h-64 overflow-hidden">
                <img
                    src={`${API_URL}/images/${service.imagen}`}
                    alt={service.nombre}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
            </div>

            <CardHeader>
                <CardTitle>{service.nombre}</CardTitle>
            </CardHeader>

            <Badge variant="outline" className={`${service.activo ? "border-green-200 bg-green-50 text-green-700 position: center" : "border-gray-200 bg-gray-100 text-gray-600"} ml-4`}>
                {service.activo ? "Activo" : "Inactivo"}
            </Badge>

            <CardContent className="grid gap-2.5">
                <p className="text-sm text-muted-foreground">
                    {service.descripcion}
                </p>

                <p className="text-sm text-muted-foreground">
                    <strong>Precio:</strong> ₡
                    {Number(service.precioBase).toLocaleString("es-CR")}
                </p>

                <p className="text-sm text-muted-foreground">
                    <strong>Duración:</strong> {service.duracionMinutos} minutos
                </p>
            </CardContent>

            <CardFooter className="flex flex-col gap-2 pt-3">
                <Button
                    asChild
                    variant="ghost"
                    className="w-full group/btn hover:bg-accent hover:text-accent-foreground transition-all duration-300 bg-[#F9DFDF]"
                >
                    <Link to={`/servicios/${service.id}`}>
                        <span className="font-semibold">Ver detalles</span>
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1.5 bg-[#F9DFDF]" />
                    </Link>
                </Button>

                {isAuthenticated && isAdmin && (
                    <Button
                        type="button"
                        variant={
                            service.activo
                                ? "destructive"
                                : "secondary"
                        }
                        className="w-full mt-2"
                        disabled={changingStatus}
                        onClick={() =>
                            onRequestStatusChange(service)
                        }
                    >
                        {changingStatus
                            ? "Actualizando..."
                            : service.activo
                                ? "Desactivar"
                                : "Activar"}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}

ServiceCard.propTypes = {
    service: PropTypes.shape({
        id: PropTypes.number.isRequired,
        nombre: PropTypes.string.isRequired,
        descripcion: PropTypes.string.isRequired,
        precioBase: PropTypes.string.isRequired,
        duracionMinutos: PropTypes.number.isRequired,
        imagen: PropTypes.string,
        activo: PropTypes.bool.isRequired,
    }).isRequired,
    changingStatus: PropTypes.bool,
    onRequestStatusChange: PropTypes.func.isRequired,
};