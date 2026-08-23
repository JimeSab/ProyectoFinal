import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ArrowRight, Pencil } from "lucide-react";
import { useAuth } from "@/auth/useAuth";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

/*Muestra información de un servicio adicional usando una tarjeta 
de shadcn para reutilizar el mismo diseño en todos los registros del listado.*/
export function AdditionalCard({
    additional,
    onRequestStatusChange,
    changingStatus = false,
}) {
    const { isAuthenticated, user } = useAuth();
    // Las acciones de mantenimiento solo están disponibles para el administrador.
    const isAdmin = user?.rol?.nombre === "Administrador";

    // Muestra el precio, estado y enlaces del servicio adicional.
    return (
        <Card className="h-full">

            {/* Muestra nombre y utiliza Badge para enseñar si el servicio adicional está activo o inactivo */}

            <CardHeader className="grid grid-cols-[1fr_auto] items-start gap-3">
                <CardTitle>{additional.nombre}</CardTitle>

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

            {/*Muestra descripción y convierte el precio usando Number para después presentarlo con el formato de moneda de Costa Rica.
            */}

            <CardContent className="grid flex-1 gap-3">
                <p className="text-sm text-muted-foreground">
                    {additional.descripcion}
                </p>

                <p className="text-lg font-semibold">
                    ₡{Number(additional.precio).toLocaleString("es-CR")}
                </p>
            </CardContent>

            {/* Agrupa las acciones disponibles para cada servicio adicional. */}
            <CardFooter className="flex flex-wrap gap-2">

                {/*
                Utiliza Link con el ID del adicional para navegar
                a la página que mostrará la información completa.
                */}
                <Button
                    asChild
                    variant="ghost"
                    className="w-full group/btn bg-[#F9DFDF] text-black hover:bg-[#F9DFDF] hover:text-black transition-all duration-300"
                >
                    <Link to={`/adicionales/${additional.id}`}>
                        <span className="font-semibold">Ver detalles</span>

                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
                    </Link>
                </Button>

                {/*
                Utiliza Link con el ID del adicional para navegar
                al formulario de edición del registro seleccionado.
                */}
                {isAuthenticated && isAdmin && (
                    <>
                        <Button asChild variant="outline" className="flex-1">
                            <Link to={`/adicionales/${additional.id}/editar`}>
                                Editar
                                <Pencil />
                            </Link>
                        </Button>

                        {/*
                Utiliza onRequestStatusChange para comunicarle al listado
                cuál adicional se desea activar o desactivar.
                */}
                        <Button
                            type="button"
                            variant={additional.activo ? "destructive" : "secondary"}
                            className="w-full"
                            disabled={changingStatus}
                            onClick={() => onRequestStatusChange(additional)}
                        >
                            {changingStatus
                                ? "Actualizando..."
                                : additional.activo
                                    ? "Desactivar"
                                    : "Activar"}
                        </Button>
                    </>
                )}
            </CardFooter>
        </Card>
    );
}

/*
Utiliza PropTypes para comprobar que la tarjeta reciba el adicional,
la función para cambiar su estado y un valor booleano de carga.
*/
AdditionalCard.propTypes = {
    additional: PropTypes.shape({
        id: PropTypes.number.isRequired,
        nombre: PropTypes.string.isRequired,
        descripcion: PropTypes.string.isRequired,
        precio: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]).isRequired,
        activo: PropTypes.bool.isRequired,
    }).isRequired,

    onRequestStatusChange: PropTypes.func.isRequired,
    changingStatus: PropTypes.bool,
};
