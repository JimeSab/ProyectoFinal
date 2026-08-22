import { useEffect, useState } from "react";

import { useAuth } from "@/auth/useAuth";
import { AppointmentList } from "@/components/AppointmentList";
import { PageHeader } from "@/components/PageHeader";
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
import { Input } from "@/components/ui/input";

import {
    getAppointmentEmployeeAgenda,
} from "@/services/appointmentsService";
import {
    getLocalToday,
} from "@/lib/appointmentUtils";

export function AgendaEmployeePage() {
    const { user } = useAuth();

    const [date, setDate] = useState(
        getLocalToday()
    );
    const [agenda, setAgenda] = useState(null);
    const [loading, setLoading] =
        useState(true);
    const [error, setError] = useState("");

    const employeeId = user?.empleado?.id;

    /*
    Carga la agenda cuando cambia la fecha.
    */
   
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
                setError(requestError.message);
            } finally {
                setLoading(false);
            }
        }

        if (employeeId && date) {
            loadAgenda();
        }
    }, [employeeId, date]);

    return (
        <section className="space-y-6">
            <PageHeader
                title="Mi agenda"
                description="Consulte sus citas y horarios por fecha"
            />

            <div className="max-w-xs">
                <label
                    htmlFor="date"
                    className="mb-2 block text-sm font-medium"
                >
                    Fecha
                </label>

                <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(event) =>
                        setDate(event.target.value)
                    }
                />
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>
                        {error}
                    </AlertDescription>
                </Alert>
            )}

            {loading ? (
                <p className="text-muted-foreground">
                    Cargando agenda...
                </p>
            ) : agenda ? (
                <>
                    {/* Muestra el horario del establecimiento. */}

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Horario de atención
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            {agenda.horarios.length ===
                            0 ? (
                                <p>
                                    No hay horario de atención.
                                </p>
                            ) : (
                                agenda.horarios.map(
                                    (schedule) => (
                                        <p
                                            key={
                                                schedule.id
                                            }
                                        >
                                            {
                                                schedule
                                                    .diaSemana
                                                    .nombre
                                            }
                                            :{" "}
                                            {
                                                schedule.horaInicio
                                            }{" "}
                                            -{" "}
                                            {
                                                schedule.horaFin
                                            }
                                        </p>
                                    )
                                )
                            )}
                        </CardContent>
                    </Card>

                    {/* Muestra las restricciones de la fecha. */}

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Restricciones
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-3">
                            {agenda.restricciones
                                .length === 0 ? (
                                <p>
                                    No hay restricciones.
                                </p>
                            ) : (
                                agenda.restricciones.map(
                                    (restriction) => (
                                        <div
                                            key={
                                                restriction.id
                                            }
                                            className="rounded-md border p-3"
                                        >
                                            <p>
                                                {
                                                    restriction
                                                        .motivo
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
                        </CardContent>
                    </Card>

                    {/* Reutiliza AppointmentList para mostrar las citas. */}

                    <div>
                        <h2 className="mb-4 text-xl font-semibold">
                            Citas del día
                        </h2>

                        {agenda.citas.length === 0 ? (
                            <p>
                                No hay citas para esta fecha.
                            </p>
                        ) : (
                            <AppointmentList
                                appointments={
                                    agenda.citas
                                }
                            />
                        )}
                    </div>
                </>
            ) : null}
        </section>
    );
}