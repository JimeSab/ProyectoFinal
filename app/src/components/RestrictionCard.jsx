import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Clock, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

/*
Recibe la fecha enviada por el API y separa el año, mes y día
para mostrarla como día/mes/año sin alterar la zona horaria.
*/
// Convierte la fecha de la restricción a un formato comprensible.
function formatDate(date) {
    const [year, month, day] = date.split("T")[0].split("-");
    return `${day}/${month}/${year}`;
}

/*
Recibe una hora del API y extrae solamente las horas y los minutos
para evitar mostrar segundos o información técnica innecesaria.
*/
// Permite mostrar correctamente horas recibidas como Time o DateTime.
function formatTime(time) {
    if (!time) {
        return "";
    }

    const timePart = time.includes("T")
        ? time.split("T")[1]
        : time;

    return timePart.slice(0, 5);
}

/*
Muestra una restricción dentro de una tarjeta reutilizable usando
componentes de shadcn para mantener el mismo diseño en todo el listado.
*/
// Muestra si la restricción es general o pertenece a un empleado específico.
export function RestrictionCard({ restriction }) {
    /*
    Obtiene el usuario relacionado con el empleado usando encadenamiento
    opcional, porque una restricción general no tiene empleado asignado.
    */
    const employeeUser = restriction.empleado?.usuario;

    /*
    Une el nombre y los apellidos usando filter para eliminar datos vacíos
    y join para formar el nombre completo del empleado.
    */
    const employeeName = employeeUser
        ? [
            employeeUser.nombre,
            employeeUser.primerApellido,
            employeeUser.segundoApellido,
        ]
            .filter(Boolean)
            .join(" ")
        : "Todo el establecimiento";

    /*
    Comprueba todoElDia para mostrar un texto comprensible o, si la
    restricción es parcial, presenta su hora de inicio y finalización.
    */
    const restrictedSchedule = restriction.todoElDia
        ? "Todo el día"
        : `${formatTime(restriction.horaInicio)} - ${formatTime(
            restriction.horaFin
        )}`;

    return (
        <Card className="h-full">
            <CardHeader className="grid grid-cols-[1fr_auto] items-start gap-3">
                <div className="space-y-2">
                    {/* Muestra el tipo de restricción recibido desde el API. */}
                    <CardTitle>
                        {restriction.tipoRestriccion?.nombre}
                    </CardTitle>

                    {/* Indica si afecta al establecimiento o a un empleado. */}
                    <p className="text-sm text-muted-foreground">
                        {restriction.empleado
                            ? "Restricción de empleado"
                            : "Restricción general"}
                    </p>
                </div>

                {/*
                Utiliza Badge y el valor activo para representar visualmente
                el estado actual de la restricción.
                */}
                <Badge
                    variant="outline"
                    className={
                        restriction.activo
                            ? "border-green-200 bg-green-50 text-green-700"
                            : "border-gray-200 bg-gray-100 text-gray-600"
                    }
                >
                    {restriction.activo ? "Activa" : "Inactiva"}
                </Badge>
            </CardHeader>

            <CardContent className="grid flex-1 gap-3">
                {/*
                Muestra la persona o el establecimiento afectado usando
                el nombre completo calculado anteriormente.
                */}
                <div className="flex items-center gap-2 text-sm">
                    <UserRound className="h-4 w-4" />
                    <span>{employeeName}</span>
                </div>

                {/* Utiliza formatDate para mostrar una fecha comprensible. */}
                <div className="flex items-center gap-2 text-sm">
                    <CalendarDays className="h-4 w-4" />
                    <span>{formatDate(restriction.fecha)}</span>
                </div>

                {/*
                Utiliza restrictedSchedule para mostrar el intervalo bloqueado
                o indicar que la restricción dura todo el día.
                */}
                <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>{restrictedSchedule}</span>
                </div>

                {/* Muestra el motivo por el cual se bloqueó ese horario. */}
                <p className="text-sm text-muted-foreground">
                    {restriction.motivo}
                </p>
            </CardContent>

            <CardFooter>
                {/*
                Utiliza Link con el ID de la restricción para navegar
                a la página que mostrará toda su información.
                */}
                <Button asChild variant="ghost" className="w-full group/btn bg-[#F9DFDF] text-black hover:bg-[#F9DFDF] hover:text-black transition-all duration-300">
                    <Link to={`/restricciones/${restriction.id}`}>
                        Ver detalle
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1.5"/>
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

/*
Utiliza PropTypes para verificar que la tarjeta reciba una restricción
con los campos y tipos de datos necesarios para poder mostrarla.
*/
RestrictionCard.propTypes = {
    restriction: PropTypes.shape({
        id: PropTypes.number.isRequired,
        fecha: PropTypes.string.isRequired,
        horaInicio: PropTypes.string,
        horaFin: PropTypes.string,
        todoElDia: PropTypes.bool.isRequired,
        motivo: PropTypes.string.isRequired,
        activo: PropTypes.bool.isRequired,

        tipoRestriccion: PropTypes.shape({
            nombre: PropTypes.string.isRequired,
        }).isRequired,

        empleado: PropTypes.shape({
            usuario: PropTypes.shape({
                nombre: PropTypes.string.isRequired,
                primerApellido: PropTypes.string,
                segundoApellido: PropTypes.string,
            }).isRequired,
        }),
    }).isRequired,
};
