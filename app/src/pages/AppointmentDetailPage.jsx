import { useEffect, useState } from "react";
import {
    Link,
    Navigate,
    useParams,
} from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { useAuth } from "@/auth/useAuth";
import { FormError } from "@/components/FormError";
import { PageHeader } from "@/components/PageHeader";
import {
    Alert,
    AlertDescription,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

import {
    cancelAppointment,
    getAppointmentById,
} from "@/services/appointmentsService";
import {
    cancellationSchema,
} from "@/schemas/appointmentSchema";
import {
    formatAppointmentDate,
} from "@/lib/appointmentUtils";

export function AppointmentDetailPage() {
    const { id } = useParams();
    const { user } = useAuth();

    const [appointment, setAppointment] =
        useState(null);
    const [reason, setReason] = useState("");
    const [loading, setLoading] =
        useState(true);
    const [error, setError] = useState("");
    const [cancelError, setCancelError] =
        useState("");
    const [success, setSuccess] = useState("");

    /*
    Carga la cita utilizando el ID de la ruta
    */
    useEffect(() => {
        async function loadAppointment() {
            try {
                setLoading(true);
                setError("");

                const response =
                    await getAppointmentById(id);

                setAppointment(
                    response.data || response
                );
            } catch (requestError) {
                setError(requestError.message);
            } finally {
                setLoading(false);
            }
        }

        loadAppointment();
    }, [id]);

    /*
    Valida el motivo y cancela la cita
    */

    async function handleCancelAppointment() {
        const validation =
            cancellationSchema.safeParse({
                motivoCancelacion: reason,
            });

        if (!validation.success) {
            setCancelError(
                validation.error.issues[0].message
            );
            return;
        }

        try {
            setCancelError("");
            setError("");

            const response =
                await cancelAppointment(
                    id,
                    validation.data
                        .motivoCancelacion
                );

            setAppointment(
                response.data || response
            );

            setSuccess(
                response.message ||
                "Cita cancelada correctamente."
            );

            setReason("");
        } catch (requestError) {
            setError(requestError.message);
        }
    }

    if (loading) {
        return (
            <p className="text-muted-foreground">
                Cargando detalle...
            </p>
        );
    }

    if (!appointment) {
        return (
            <section className="space-y-4">
                <PageHeader
                    title="Cita no encontrada"
                    description="No existe una cita con ese identificador"
                />

                <Button asChild variant="outline">
                    <Link to="/citas">
                        Volver a citas
                    </Link>
                </Button>
            </section>
        );
    }

    const role = user?.rol?.nombre;

    const employeeOwnsAppointment =
        role === "Empleado" &&
        user?.empleado?.id ===
            appointment.empleadoId;

    const clientOwnsAppointment =
        role === "Cliente" &&
        user?.id === appointment.clienteId;

        const canView =
    role === "Administrador" ||
    employeeOwnsAppointment ||
    clientOwnsAppointment;

if (!canView) {
    return (
        <Navigate
            to="/unauthorized"
            replace
        />
    );
}

    const canManage =
        role === "Administrador" ||
        employeeOwnsAppointment;

    const canEdit =
        canManage &&
        appointment.estadoCita.permiteEdicion;

    const canCancel =
        appointment.estadoCita
            .permiteCancelacionCliente &&
        (
            role === "Administrador" ||
            employeeOwnsAppointment ||
            clientOwnsAppointment
        );

    return (
        <section className="space-y-6">
            <Button asChild variant="outline">
                <Link to="/citas">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver a citas
                </Link>
            </Button>

            <PageHeader
                title={
                    appointment.servicio.nombre
                }
                description="Información detallada de la cita"
            />

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>
                        {error}
                    </AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert>
                    <AlertDescription>
                        {success}
                    </AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>
                        Datos de la cita
                    </CardTitle>
                </CardHeader>

                <CardContent className="grid gap-4 md:grid-cols-2">
                    <p>
                        <strong>Estado:</strong>{" "}
                        {
                            appointment.estadoCita
                                .nombre
                        }
                    </p>

                    <p>
                        <strong>Fecha:</strong>{" "}
                        {formatAppointmentDate(
                            appointment.fecha
                        )}
                    </p>

                    <p>
                        <strong>Horario:</strong>{" "}
                        {appointment.horaInicio} -{" "}
                        {appointment.horaFin}
                    </p>

                    <p>
                        <strong>Duración:</strong>{" "}
                        {
                            appointment.duracionMinutos
                        }{" "}
                        minutos
                    </p>

                    <p>
                        <strong>Cliente:</strong>{" "}
                        {appointment.cliente.nombre}{" "}
                        {
                            appointment.cliente
                                .primerApellido
                        }
                    </p>

                    <p>
                        <strong>Empleado:</strong>{" "}
                        {
                            appointment.empleado
                                .usuario.nombre
                        }
                    </p>

                    <p>
                        <strong>
                            Precio del servicio:
                        </strong>{" "}
                        ₡
                        {Number(
                            appointment.precioServicio
                        ).toLocaleString("es-CR")}
                    </p>

                    <p>
                        <strong>
                            Costo de adicionales:
                        </strong>{" "}
                        ₡
                        {Number(
                            appointment.costoAdicionales
                        ).toLocaleString("es-CR")}
                    </p>

                    <p>
                        <strong>Total:</strong>{" "}
                        ₡
                        {Number(
                            appointment.costoTotal
                        ).toLocaleString("es-CR")}
                    </p>

                    <p>
                        <strong>Observaciones:</strong>{" "}
                        {appointment.observaciones ||
                            "Sin observaciones"}
                    </p>

                    <div className="md:col-span-2">
                        <strong>
                            Servicios adicionales:
                        </strong>

                        {appointment.adicionales
                            .length === 0 ? (
                            <p>
                                Sin servicios adicionales
                            </p>
                        ) : (
                            <ul className="list-disc pl-5">
                                {appointment.adicionales.map(
                                    (additional) => (
                                        <li
                                            key={
                                                additional.id
                                            }
                                        >
                                            {
                                                additional.nombre
                                            }
                                        </li>
                                    )
                                )}
                            </ul>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Muestra las acciones permitidas */}

            {canManage && (
                <div className="flex gap-3">
                    {canEdit && (
                        <Button asChild>
                            <Link
                                to={`/citas/${id}/editar`}
                            >
                                Editar cita
                            </Link>
                        </Button>
                    )}

                    <Button asChild variant="outline">
                        <Link
                            to={`/citas/${id}/estado`}
                        >
                            Cambiar estado
                        </Link>
                    </Button>
                </div>
            )}

            {/* Cancela una cita cuando su estado lo permite */}

            {canCancel && (
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Cancelar cita
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3">
                        <label
                            htmlFor="reason"
                            className="text-sm font-medium"
                        >
                            Motivo de cancelación
                        </label>

                        <Textarea
                            id="reason"
                            value={reason}
                            onChange={(event) =>
                                setReason(
                                    event.target.value
                                )
                            }
                            placeholder="Escriba el motivo"
                        />

                        <FormError
                            message={cancelError}
                        />

                        <Button
                            type="button"
                            variant="destructive"
                            onClick={
                                handleCancelAppointment
                            }
                        >
                            Cancelar cita
                        </Button>
                    </CardContent>
                </Card>
            )}
        </section>
    );
}