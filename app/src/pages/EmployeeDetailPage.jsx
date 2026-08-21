import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import { PageHeader } from "@/components/PageHeader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getEmployeeById, getEmployeeAgenda } from "@/services/employeesService";
import { useAuth } from "@/auth/useAuth";

function formatDate(date) {
    if (!date) {
        return "No disponible";
    }

    return new Intl.DateTimeFormat("es-CR", {
        dateStyle: "long",
    }).format(new Date(date));
}

function formatTime(value) {
    if (!value) {
        return "No disponible";
    }

    const date = new Date(value);

    return new Intl.DateTimeFormat("es-CR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "UTC",
    }).format(date);
}

export function EmployeeDetailPage() {
    const { id } = useParams();
    const { isAuthenticated, user } = useAuth();
    const isAdmin = user?.rol?.nombre === "Administrador";
    const isEmployee = user?.rol?.nombre === "Empleado";
    const canViewEmployee = isAdmin || (
        isEmployee && String(user?.empleado?.id) === String(id)
    );

    const [employee, setEmployee] = useState(null);
    const [agenda, setAgenda] = useState(null);
    const [agendaDate, setAgendaDate] = useState(
        new Date().toISOString().slice(0, 10)
    );
    const [loading, setLoading] = useState(true);
    const [loadingAgenda, setLoadingAgenda] = useState(false);
    const [error, setError] = useState("");
    const [agendaError, setAgendaError] = useState("");
    const backPath = isAdmin
    ? "/empleados"
    : "/";

    useEffect(() => {
        async function loadEmployee() {
            try {
                setLoading(true);
                setError("");
                const response = await getEmployeeById(id);
                setEmployee(response.data);
            } catch (requestError) {
                setError(requestError.message);
            } finally {
                setLoading(false);
            }
        }

        loadEmployee();
    }, [id]);

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

            <Card>
                <CardHeader>
                    <CardTitle>Restricciones registradas</CardTitle>
                </CardHeader>

                <CardContent>
                    {employee.restricciones?.length > 0 ? (
                        <div className="space-y-4">
                            {employee.restricciones.map((restriction) => (
                                <div key={restriction.id} className="rounded-lg border p-4">
                                    <p><strong>Fecha:</strong> {formatDate(restriction.fecha)}</p>
                                    <p><strong>Hora inicio:</strong> {formatTime(restriction.horaInicio)}</p>
                                    <p><strong>Hora fin:</strong> {formatTime(restriction.horaFin)}</p>
                                    <p><strong>Tipo:</strong> {restriction.tipoRestriccion?.nombre || "No disponible"}</p>
                                    <p><strong>Estado:</strong> {restriction.activo ? "Activa" : "Inactiva"}</p>
                                    {restriction.descripcion && (
                                        <p><strong>Descripción:</strong> {restriction.descripcion}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No tiene restricciones registradas.</p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Agenda del empleado</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
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