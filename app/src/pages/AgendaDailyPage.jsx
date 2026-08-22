import { useEffect, useState } from "react";

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
    getDailyAgenda,
} from "@/services/appointmentsService";
import {
    getLocalToday,
} from "@/lib/appointmentUtils";

export function AgendaDailyPage() {
    const [date, setDate] = useState(
        getLocalToday()
    );
    const [agenda, setAgenda] = useState(null);
    const [loading, setLoading] =
        useState(true);
    const [error, setError] = useState("");

    /*
    Carga la agenda diaria cuando cambia la fecha
    */
    useEffect(() => {
        async function loadDailyAgenda() {
            try {
                setLoading(true);
                setError("");

                const response =
                    await getDailyAgenda(date);

                setAgenda(
                    response.data || response
                );
            } catch (requestError) {
                setError(requestError.message);
            } finally {
                setLoading(false);
            }
        }

        if (date) {
            loadDailyAgenda();
        }
    }, [date]);

    return (
        <section className="space-y-6">
            <PageHeader
                title="Agenda diaria"
                description="Consulte las citas del establecimiento"
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
                    Cargando agenda diaria...
                </p>
            ) : agenda ? (
                <>
                    {/* Muestra el horario general */}

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
                                    El establecimiento no atiende este día.
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

                    {/* Muestra restricciones generales */}

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Restricciones generales
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-3">
                            {agenda
                                .restriccionesGenerales
                                .length === 0 ? (
                                <p>
                                    No hay restricciones generales.
                                </p>
                            ) : (
                                agenda.restriccionesGenerales.map(
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

                    {/* Muestra las citas de cada empleado */}

                    {agenda.empleados.map(
                        (employee) => (
                            <Card key={employee.id}>
                                <CardHeader>
                                    <CardTitle>
                                        {
                                            employee.usuario
                                                .nombre
                                        }{" "}
                                        {
                                            employee.usuario
                                                .primerApellido
                                        }
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    {employee.restricciones
                                        .length > 0 && (
                                        <div>
                                            <h3 className="font-semibold">
                                                Restricciones
                                            </h3>

                                            {employee.restricciones.map(
                                                (
                                                    restriction
                                                ) => (
                                                    <p
                                                        key={
                                                            restriction.id
                                                        }
                                                    >
                                                        {
                                                            restriction.motivo
                                                        }
                                                    </p>
                                                )
                                            )}
                                        </div>
                                    )}

                                    {employee.citas.length ===
                                    0 ? (
                                        <p>
                                            No tiene citas para esta fecha.
                                        </p>
                                    ) : (
                                        <AppointmentList
                                            appointments={
                                                employee.citas
                                            }
                                        />
                                    )}
                                </CardContent>
                            </Card>
                        )
                    )}
                </>
            ) : null}
        </section>
    );
}