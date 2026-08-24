  import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { PageHeader } from "@/components/PageHeader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getDailyAgenda } from "@/services/appointmentsService";

/* Obtiene la fecha actual en formato YYYY-MM-DD. */
function getLocalToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

/* Convierte una hora HH:mm a minutos. */
function timeToMinutes(time) {
    const [hours, minutes] = time.slice(0, 5).split(":").map(Number);
    return hours * 60 + minutes;
}

/* Convierte minutos al formato HH:mm. */
function minutesToTime(totalMinutes) {
    const hours = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
    const minutes = String(totalMinutes % 60).padStart(2, "0");
    return `${hours}:${minutes}`;
}

/* Convierte la hora recibida del API al formato HH:mm. */
function formatTime(value) {
    if (!value) {
        return "";
    }

    return value.includes("T") ? value.slice(11, 16) : value.slice(0, 5);
}

/* Divide el horario del establecimiento en espacios de una hora. */
function createTimeSlots(schedules) {
    const slots = [];

    schedules.forEach((schedule) => {
        let start = timeToMinutes(formatTime(schedule.horaInicio));
        const end = timeToMinutes(formatTime(schedule.horaFin));

        while (start < end) {
            const slotEnd = Math.min(start + 60, end);
            slots.push({
                start: minutesToTime(start),
                end: minutesToTime(slotEnd),
            });
            start = slotEnd;
        }
    });

    return slots;
}

/* Comprueba si una cita o restricción coincide con un espacio. */
function overlapsSlot(slot, startTime, endTime) {
    if (!startTime || !endTime) {
        return false;
    }

    const itemStart = timeToMinutes(formatTime(startTime));
    const itemEnd = timeToMinutes(formatTime(endTime));

    return (
        itemStart < timeToMinutes(slot.end) &&
        itemEnd > timeToMinutes(slot.start)
    );
}

/* Indica si el espacio está restringido, ocupado o disponible. */
function getSlotData(employee, generalRestrictions, slot) {
    const generalRestriction = generalRestrictions.find(
        (restriction) =>
            restriction.todoElDia ||
            overlapsSlot(slot, restriction.horaInicio, restriction.horaFin)
    );

    if (generalRestriction) {
        return { type: "restricted", restriction: generalRestriction };
    }

    const employeeRestriction = (employee.restricciones || []).find(
        (restriction) =>
            restriction.todoElDia ||
            overlapsSlot(slot, restriction.horaInicio, restriction.horaFin)
    );

    if (employeeRestriction) {
        return { type: "restricted", restriction: employeeRestriction };
    }

    const appointment = (employee.citas || []).find((item) =>
        overlapsSlot(slot, item.horaInicio, item.horaFin)
    );

    if (appointment) {
        return { type: "occupied", appointment };
    }

    return { type: "available" };
}

export function AgendaDailyPage() {
    const [date, setDate] = useState(getLocalToday());
    const [agenda, setAgenda] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /* Consulta nuevamente la agenda cuando cambia la fecha. */
    useEffect(() => {
        async function loadDailyAgenda() {
            try {
                setLoading(true);
                setError("");

                const response = await getDailyAgenda(date);
                setAgenda(response.data || response);
            } catch (requestError) {
                setAgenda(null);
                setError(requestError.message);
            } finally {
                setLoading(false);
            }
        }

        if (date) {
            loadDailyAgenda();
        }
    }, [date]);

    const schedules = agenda?.horarios || [];
    const employees = agenda?.empleados || [];
    const generalRestrictions = agenda?.restriccionesGenerales || [];
    const timeSlots = createTimeSlots(schedules);

    return (
        <section className="space-y-6">
            <PageHeader
                title="Agenda diaria del establecimiento"
                description="Consulte la disponibilidad de los empleados por fecha"
            />

            <div className="max-w-xs">
                <label htmlFor="date" className="mb-2 block text-sm font-medium">
                    Fecha
                </label>
                <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                />
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {loading ? (
                <p className="text-muted-foreground">Cargando agenda diaria...</p>
            ) : agenda ? (
                <>
                    {/* Muestra el horario general de la fecha seleccionada. */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Horario de atención</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {schedules.length === 0 ? (
                                <p>El establecimiento no atiende este día.</p>
                            ) : (
                                schedules.map((schedule) => (
                                    <p key={schedule.id}>
                                        {schedule.diaSemana?.nombre}: {" "}
                                        {formatTime(schedule.horaInicio)} - {" "}
                                        {formatTime(schedule.horaFin)}
                                    </p>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Muestra las restricciones de todo el establecimiento. */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Restricciones generales</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {generalRestrictions.length === 0 ? (
                                <p>No hay restricciones generales.</p>
                            ) : (
                                generalRestrictions.map((restriction) => (
                                    <div
                                        key={restriction.id}
                                        className="rounded-md border border-red-200 bg-red-50 p-3"
                                    >
                                        <p className="font-medium text-red-800">
                                            {restriction.motivo}
                                        </p>
                                        <p className="text-sm text-red-700">
                                            {restriction.todoElDia
                                                ? "Todo el día"
                                                : `${formatTime(restriction.horaInicio)} - ${formatTime(restriction.horaFin)}`}
                                        </p>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Usa filas para las horas y columnas para los empleados. */}
                    {schedules.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Disponibilidad por empleado</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {employees.length === 0 ? (
                                    <p>No hay empleados activos.</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-[800px] border-collapse">
                                            <thead>
                                                <tr>
                                                    <th className="border p-3 text-left">
                                                        Hora
                                                    </th>
                                                    {employees.map((employee) => (
                                                        <th
                                                            key={employee.id}
                                                            className="border p-3 text-left"
                                                        >
                                                            {employee.usuario?.nombre} {" "}
                                                            {employee.usuario?.primerApellido}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {timeSlots.map((slot) => (
                                                    <tr key={`${slot.start}-${slot.end}`}>
                                                        <td className="whitespace-nowrap border p-3 font-medium">
                                                            {slot.start} - {slot.end}
                                                        </td>

                                                        {employees.map((employee) => {
                                                            const slotData = getSlotData(
                                                                employee,
                                                                generalRestrictions,
                                                                slot
                                                            );

                                                            return (
                                                                <td
                                                                    key={employee.id}
                                                                    className="border p-2 align-top"
                                                                >
                                                                    {slotData.type === "restricted" ? (
                                                                        <div className="rounded-md bg-red-100 p-2 text-red-800">
                                                                            <p className="font-medium">
                                                                                Restricción
                                                                            </p>
                                                                            <p className="text-sm">
                                                                                {slotData.restriction.motivo}
                                                                            </p>
                                                                        </div>
                                                                    ) : slotData.type === "occupied" ? (
                                                                        <div className="rounded-md bg-yellow-100 p-2 text-yellow-900">
                                                                            <p className="font-medium">
                                                                                {slotData.appointment.servicio?.nombre}
                                                                            </p>
                                                                            <p className="text-sm">
                                                                                Cliente: {" "}
                                                                                {slotData.appointment.cliente?.nombre}
                                                                            </p>
                                                                            <p className="text-sm">
                                                                                {formatTime(slotData.appointment.horaInicio)} - {" "}
                                                                                {formatTime(slotData.appointment.horaFin)}
                                                                            </p>
                                                                            <p className="text-sm">
                                                                                Estado: {" "}
                                                                                {slotData.appointment.estadoCita?.nombre}
                                                                            </p>
                                                                            <Link
                                                                                to={`/citas/${slotData.appointment.id}`}
                                                                                className="mt-2 inline-block text-sm underline"
                                                                            >
                                                                                Ver detalle
                                                                            </Link>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="rounded-md bg-green-100 p-2 text-green-800">
                                                                            Disponible
                                                                        </div>
                                                                    )}
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </>
            ) : null}
        </section>
    );
}