import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    CalendarDays,
    Clock,
    Pencil,
    UserRound,
} from "lucide-react";

import { useAuth } from "@/auth/useAuth";
import {
    formatAppointmentDate,
    formatAppointmentTime,
} from "@/lib/appointmentUtils";
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
Muestra los datos principales de una cita.
*/

export function AppointmentCard({ appointment }) {
    const { user } = useAuth();
    const role = user?.rol?.nombre;

    return (
        <Card className="h-full">

            {/* Muestra el servicio y el estado de la cita. */}

            <CardHeader className="grid grid-cols-[1fr_auto] gap-3">
                <CardTitle>
                    {appointment.servicio.nombre}
                </CardTitle>

                <Badge variant="outline">
                    {appointment.estadoCita.nombre}
                </Badge>
            </CardHeader>

            <CardContent className="grid gap-3">

                {/* Muestra la fecha de la cita. */}

                <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    <span>
                        {formatAppointmentDate(
                            appointment.fecha
                        )}
                    </span>
                </div>

                {/* Muestra la hora de inicio y finalización. */}

                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                    {formatAppointmentTime(
            appointment.horaInicio
        )}{" "}
        -{" "}
        {formatAppointmentTime(
            appointment.horaFin
        )}
                    </span>
                </div>

                {/* Muestra el cliente de la cita. */}

                <div className="flex items-center gap-2">
                    <UserRound className="h-4 w-4" />
                    <span>
                        Cliente: {appointment.cliente.nombre}
                    </span>
                </div>

                {/* Muestra el empleado asignado. */}

                <div className="flex items-center gap-2">
                    <UserRound className="h-4 w-4" />
                    <span>
                        Empleado:{" "}
                        {appointment.empleado.usuario.nombre}
                    </span>
                </div>
            </CardContent>

            <CardFooter className="flex gap-2">

                {/* Abre la página de detalle. */}

                <Button
                    asChild
                    variant="outline"
                    className="flex-1"
                >
                    <Link to={`/citas/${appointment.id}`}>
                        Detalle
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </Button>


                {/* Administradores y empleados pueden editar. */}
                {(role === "Administrador" ||
    role === "Empleado") &&
    appointment.estadoCita.permiteEdicion && (
                    <Button
                        asChild
                        variant="outline"
                        className="flex-1"
                    >
                        <Link
                            to={`/citas/${appointment.id}/editar`}
                        >
                            Editar
                            <Pencil className="h-4 w-4" />
                        </Link>
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}

AppointmentCard.propTypes = {
    appointment: PropTypes.shape({
        id: PropTypes.number.isRequired,
        fecha: PropTypes.string.isRequired,
        horaInicio: PropTypes.string.isRequired,
        horaFin: PropTypes.string.isRequired,
        cliente: PropTypes.shape({
            nombre: PropTypes.string.isRequired,
        }).isRequired,
        empleado: PropTypes.shape({
            usuario: PropTypes.shape({
                nombre: PropTypes.string.isRequired,
            }).isRequired,
        }).isRequired,
        servicio: PropTypes.shape({
            nombre: PropTypes.string.isRequired,
        }).isRequired,
       estadoCita: PropTypes.shape({
    nombre: PropTypes.string.isRequired,
    permiteEdicion: PropTypes.bool.isRequired,
}).isRequired,
    }).isRequired,
};