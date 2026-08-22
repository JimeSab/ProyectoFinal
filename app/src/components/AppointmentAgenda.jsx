import { useEffect, useState } from "react";
import PropTypes from "prop-types";

import {
    Alert,
    AlertDescription,
} from "@/components/ui/alert";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    getAppointmentEmployeeAgenda,
} from "@/services/appointmentsService";

export function AppointmentAgenda({
    employeeId,
    date,
}) {
    const [agenda, setAgenda] = useState(null);
    const [loading, setLoading] =
        useState(false);
    const [error, setError] = useState("");

    /*Carga la agenda del empleado seleccionado*/

    useEffect(() => {
        async function loadAgenda() {
            try {
                setLoading(true);
                setError("");

                const response =
                    await getAppointmentEmployeeAgenda(
                        employeeId,
                        date
                    );

                setAgenda(
                    response.data || response
                );
            } catch (requestError) {
                setAgenda(null);
                setError(requestError.message);
            } finally {
                setLoading(false);
            }
        }

        if (employeeId && date) {
            loadAgenda();
        } else {
            setAgenda(null);
        }
    }, [employeeId, date]);

    if (!employeeId || !date) {
        return (
            <p className="text-sm text-muted-foreground">
                Seleccione un empleado y una fecha para consultar su agenda.
            </p>
        );
    }

    if (loading) {
        return (
            <p className="text-muted-foreground">
                Cargando agenda...
            </p>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertDescription>
                    {error}
                </AlertDescription>
            </Alert>
        );
    }

    if (!agenda) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Agenda del empleado
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">

                {/* Muestra el horario de atención */}

                <div>
                    <h3 className="font-semibold">
                        Horario
                    </h3>

                    {agenda.horarios.length === 0 ? (
                        <p>
                            No hay horario de atención.
                        </p>
                    ) : (
                        agenda.horarios.map(
                            (schedule) => (
                                <p key={schedule.id}>
                                    {
                                        schedule.horaInicio
                                    }{" "}
                                    - {schedule.horaFin}
                                </p>
                            )
                        )
                    )}
                </div>

                {/* Muestra las restricciones */}

                <div>
                    <h3 className="font-semibold">
                        Restricciones
                    </h3>

                    {agenda.restricciones.length ===
                    0 ? (
                        <p>No hay restricciones.</p>
                    ) : (
                        agenda.restricciones.map(
                            (restriction) => (
                                <div
                                    key={restriction.id}
                                    className="mb-2 rounded-md border p-2"
                                >
                                    <p>
                                        {
                                            restriction.motivo
                                        }
                                    </p>

                                    <p>
                                        {restriction.todoElDia
                                            ? "Todo el día"
                                            : `${restriction.horaInicio} - ${restriction.horaFin}`}
                                    </p>
                                </div>
                            )
                        )
                    )}
                </div>

                {/* Muestra las citas existentes */}
                
                <div>
                    <h3 className="font-semibold">
                        Citas registradas
                    </h3>

                    {agenda.citas.length === 0 ? (
                        <p>
                            No hay citas para esta fecha.
                        </p>
                    ) : (
                        agenda.citas.map(
                            (appointment) => (
                                <div
                                    key={appointment.id}
                                    className="mb-2 rounded-md border p-2"
                                >
                                    <p>
                                        {
                                            appointment
                                                .servicio
                                                .nombre
                                        }
                                    </p>

                                    <p>
                                        {
                                            appointment.horaInicio
                                        }{" "}
                                        -{" "}
                                        {
                                            appointment.horaFin
                                        }
                                    </p>

                                    <p>
                                        {
                                            appointment
                                                .estadoCita
                                                .nombre
                                        }
                                    </p>
                                </div>
                            )
                        )
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

AppointmentAgenda.propTypes = {
    employeeId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    date: PropTypes.string,
};