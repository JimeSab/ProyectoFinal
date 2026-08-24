import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import { PageHeader } from "@/components/PageHeader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getEmployeeById, getEmployeeAgenda } from "@/services/employeesService";
import { getRestrictions } from "@/services/restrictionsService";
import { useAuth } from "@/auth/useAuth";

// Convierte la fecha recibida por el API a un formato legible para la pantalla.
function formatDate(date) {
    if (!date) {
        return "No disponible";
    }

    const dateText = String(date).slice(0, 10);
    const [year, month, day] = dateText
        .split("-")
        .map(Number);

    const localDate = new Date(
        year,
        month - 1,
        day
    );

    return new Intl.DateTimeFormat("es-CR", {
        dateStyle: "long",
    }).format(localDate);
}

// Extrae únicamente la hora y los minutos de valores DateTime o Time.
function formatTime(value) {
    if (!value) {
        return "No disponible";
    }

    const text = String(value);

    // Si el API devuelve una fecha con hora.
    if (text.includes("T")) {
        return text.slice(11, 16);
    }

    // Si el API devuelve una hora como 09:00:00.
    if (/^\d{2}:\d{2}/.test(text)) {
        return text.slice(0, 5);
    }

    const date = new Date(text);

    if (Number.isNaN(date.getTime())) {
        return "No disponible";
    }

    return new Intl.DateTimeFormat("es-CR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "UTC",
    }).format(date);
}

// Extrae la fecha sin hora para comparar fechas del API y del formulario.
function normalizeDate(date) {
    return String(date).slice(0, 10);
}

export function EmployeeDetailPage() {
    const { id } = useParams();
    const { isAuthenticated, user } = useAuth();
    const isAdmin = user?.rol?.nombre === "Administrador";
    const isEmployee = user?.rol?.nombre === "Empleado";
    // Administradores y empleados pueden consultar el detalle del empleado.
    const canViewEmployee = isAdmin || isEmployee;

    // Guarda la información del empleado, la agenda y los estados de carga.
    const [employee, setEmployee] = useState(null);
    const [generalRestrictions, setGeneralRestrictions] = useState([]);
    const [agenda, setAgenda] = useState(null);
    const [agendaDate, setAgendaDate] = useState(
        new Date().toISOString().slice(0, 10)
    );
    const [loading, setLoading] = useState(true);
    const [loadingAgenda, setLoadingAgenda] = useState(false);
    const [error, setError] = useState("");
    const [agendaError, setAgendaError] = useState("");
    const backPath = "/empleados";

    // Une las restricciones individuales y generales para filtrarlas por fecha.
    const allRestrictions = [
        ...(employee?.restricciones || []),
        ...generalRestrictions,
    ];

    // Muestra únicamente las restricciones que aplican a la fecha seleccionada.
    const selectedDateRestrictions =
        allRestrictions.filter(
            (restriction) =>
                normalizeDate(restriction.fecha) === agendaDate
        );

    // Carga el empleado y las restricciones generales desde el API.
    useEffect(() => {
        async function loadEmployee() {
            try {
                setLoading(true);
                setError("");
                const [employeeResponse, restrictionsResponse] =
                    await Promise.all([
                        getEmployeeById(id),
                        getRestrictions(),
                    ]);

                setEmployee(employeeResponse.data);

                const restrictions =
                    restrictionsResponse.data || restrictionsResponse;

                // Conserva las restricciones sin empleado asignado porque afectan a todo el establecimiento.
                setGeneralRestrictions(
                    restrictions.filter(
                        (restriction) => !restriction.empleadoId
                    )
                );
            } catch (requestError) {
                setError(requestError.message);
            } finally {
                setLoading(false);
            }
        }

        loadEmployee();
    }, [id]);

    // Consulta la agenda y las restricciones aplicables cuando cambia la fecha.
    useEffect(() => {
        async function loadAgenda() {
            try {
                setLoadingAgenda(true);
                setAgendaError("");
                const response = await getEmployeeAgenda(id, agendaDate);
                setAgenda(response.data);
            } catch (requestError) {
                setAgenda(null);
                setAgendaError(requestError.message);
            } finally {
                setLoadingAgenda(false);
            }
        }

        loadAgenda();
    }, [id, agendaDate]);

    if (loading) {
        return <p className="text-muted-foreground">Cargando detalle del empleado...</p>;
    }

    if (error || !employee) {
        return (
            <section className="space-y-4">
                <Alert variant="destructive">
                    <AlertDescription>{error || "El empleado no existe."}</AlertDescription>
                </Alert>
                <Button asChild variant="outline">
                    <Link to={backPath}>Volver</Link>
                </Button>
            </section>
        );
    }

    if (!canViewEmployee) {
        return <Navigate to="/unauthorized" replace />;
    }
    return (
        <section className="space-y-6">
            <Button asChild variant="outline">
                <Link to={backPath}>Volver</Link>
            </Button>

            <PageHeader
                title={`${employee.usuario?.nombre} ${employee.usuario?.primerApellido}`}
                description="Detalle del empleado"
            />

            <Card>
                <CardHeader>
                    <CardTitle>Información general</CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                    <p><strong>Nombre:</strong> {employee.usuario?.nombre} {employee.usuario?.primerApellido}</p>
                    <p><strong>Correo:</strong> {employee.usuario?.correo}</p>
                    <p><strong>Teléfono:</strong> {employee.usuario?.telefono || "No disponible"}</p>
                    <p><strong>Código del empleado:</strong> {employee.codigoEmpleado}</p>
                    <p><strong>Especialidad:</strong> {employee.especialidad?.nombre}</p>
                    <p><strong>Estado:</strong> {employee.activo ? "Activo" : "Inactivo"}</p>
                    <p><strong>Cantidad de citas asignadas:</strong> {employee.citas?.length || 0}</p>

                    {isAuthenticated && isAdmin && (
                        <Button asChild>
                            <Link to={`/empleados/${employee.id}/editar`}>Editar empleado</Link>
                        </Button>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Servicios que puede realizar</CardTitle>
                </CardHeader>

                <CardContent>
                    {employee.servicios?.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-1">
                            {employee.servicios.map((service) => (
                                <li key={service.id}>
                                    {service.nombre}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-muted-foreground">No tiene servicios asignados.</p>
                    )}
                </CardContent>
            </Card>

            {/* Muestra las restricciones generales e individuales de la fecha seleccionada. */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        Restricciones para la fecha seleccionada
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    {selectedDateRestrictions.length > 0 ? (
                        <div className="space-y-4">
                            {selectedDateRestrictions.map((restriction) => (
                                <div
                                    key={restriction.id}
                                    className="rounded-lg border p-4"
                                >
                                    <p>
                                        <strong>Aplicación:</strong>{" "}
                                        {restriction.empleadoId
                                            ? "Empleado específico"
                                            : "Todo el establecimiento"}
                                    </p>

                                    <p>
                                        <strong>Fecha:</strong>{" "}
                                        {formatDate(restriction.fecha)}
                                    </p>

                                    <p>
                                        <strong>Horario:</strong>{" "}
                                        {restriction.todoElDia
                                            ? "Todo el día"
                                            : `${formatTime(
                                                restriction.horaInicio
                                            )} - ${formatTime(
                                                restriction.horaFin
                                            )}`}
                                    </p>

                                    <p>
                                        <strong>Tipo:</strong>{" "}
                                        {restriction.tipoRestriccion?.nombre ||
                                            (restriction.empleadoId
                                                ? "Específica de empleado"
                                                : "General del establecimiento")}
                                    </p>

                                    <p>
                                        <strong>Motivo:</strong>{" "}
                                        {restriction.motivo ||
                                            restriction.descripcion ||
                                            "No disponible"}
                                    </p>

                                    <p>
                                        <strong>Estado:</strong>{" "}
                                        {restriction.activo
                                            ? "Activa"
                                            : "Inactiva"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">
                            No hay restricciones para la fecha seleccionada.
                        </p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Agenda del empleado</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Permite cambiar la fecha para consultar otra agenda. */}
                    <div className="max-w-xs">
                        <label htmlFor="agendaDate" className="mb-2 block text-sm font-medium">
                            Consultar por fecha
                        </label>
                        <input
                            id="agendaDate"
                            type="date"
                            value={agendaDate}
                            onChange={(event) => setAgendaDate(event.target.value)}
                            className="w-full rounded-md border px-3 py-2"
                        />
                    </div>

                    {loadingAgenda ? (
                        <p className="text-muted-foreground">Cargando agenda...</p>
                    ) : agendaError ? (
                        <Alert variant="destructive">
                            <AlertDescription>{agendaError}</AlertDescription>
                        </Alert>
                    ) : agenda ? (
                        <div className="space-y-5">
                            <div className="grid gap-3 sm:grid-cols-3">
                                <div className="rounded-lg border p-4">
                                    <p className="text-sm text-muted-foreground">Citas</p>
                                    <p className="text-2xl font-bold">{agenda.citas?.length || 0}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-3 text-lg font-semibold">Citas del día</h3>

                                {/* Muestra las citas asignadas al empleado para la fecha seleccionada. */}
                                {agenda.citas?.length > 0 ? (
                                    <div className="space-y-4">
                                        {agenda.citas.map((appointment) => (
                                            <div key={appointment.id} className="rounded-lg border p-4">
                                                <p><strong>Cliente:</strong> {appointment.cliente?.nombre} {appointment.cliente?.primerApellido}</p>
                                                <p><strong>Servicio:</strong> {appointment.servicio?.nombre}</p>
                                                <p><strong>Estado:</strong> {appointment.estadoCita?.nombre}</p>
                                                <p><strong>Hora inicio:</strong> {formatTime(appointment.horaInicio)}</p>
                                                <p><strong>Hora fin:</strong> {formatTime(appointment.horaFin)}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground">No hay citas para esta fecha.</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No se pudo cargar la agenda.</p>
                    )}
                </CardContent>
            </Card>
        </section>
    );
}
