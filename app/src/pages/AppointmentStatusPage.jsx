import { useEffect, useState } from "react";
import {
    Link,
    Navigate,
    useNavigate,
    useParams,
} from "react-router-dom";

import { useAuth } from "@/auth/useAuth";
import { PageHeader } from "@/components/PageHeader";
import {
    Alert,
    AlertDescription,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    getAppointmentById,
    getAppointmentStatuses,
    updateAppointmentStatus,
} from "@/services/appointmentsService";

export function AppointmentStatusPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [appointment, setAppointment] =
        useState(null);
    const [statuses, setStatuses] = useState([]);
    const [statusId, setStatusId] = useState("");
    const [loading, setLoading] =
        useState(true);
    const [error, setError] = useState("");

    /*Carga la cita y los estados disponibles.*/

    useEffect(() => {
        async function loadStatusData() {
            try {
                setLoading(true);

                const [
                    appointmentResponse,
                    statusesResponse,
                ] = await Promise.all([
                    getAppointmentById(id),
                    getAppointmentStatuses(),
                ]);

                const appointmentData =
                    appointmentResponse.data ||
                    appointmentResponse;

                setAppointment(appointmentData);

                setStatuses(
                    statusesResponse.data ||
                    statusesResponse
                );

                setStatusId(
                    String(
                        appointmentData.estadoCitaId
                    )
                );
            } catch (requestError) {
                setError(requestError.message);
            } finally {
                setLoading(false);
            }
        }

        loadStatusData();
    }, [id]);

    /*
    Envía el nuevo estado al API.
    */

    async function handleStatusChange(event) {
        event.preventDefault();

        if (!statusId) {
            setError(
                "Debe seleccionar un estado."
            );
            return;
        }

        try {
            setError("");

            await updateAppointmentStatus(
                id,
                Number(statusId)
            );

            navigate(`/citas/${id}`);
        } catch (requestError) {
            setError(requestError.message);
        }
    }

    if (loading) {
        return (
            <p className="text-muted-foreground">
                Cargando estados...
            </p>
        );
    }

    if (!appointment) {
        return (
            <Alert variant="destructive">
                <AlertDescription>
                    No se encontró la cita.
                </AlertDescription>
            </Alert>
        );
    }

/*Comprueba que el empleado solamente pueda cambiar
el estado de las citas que tiene asignadas*/
const employeeCannotChangeStatus =
    user?.rol?.nombre === "Empleado" &&
    String(user?.empleado?.id) !==
        String(appointment.empleadoId);

if (employeeCannotChangeStatus) {
    return (
        <Navigate
            to="/unauthorized"
            replace
        />
    );
}

    return (
        <section className="space-y-6">
            <Button asChild variant="outline">
                <Link to={`/citas/${id}`}>
                    Volver al detalle
                </Link>
            </Button>

            <PageHeader
                title="Cambiar estado"
                description={
                    appointment.servicio.nombre
                }
            />

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>
                        {error}
                    </AlertDescription>
                </Alert>
            )}

            <Card>
                <form
                    onSubmit={handleStatusChange}
                >
                    <CardHeader>
                        <CardTitle>
                            Estado de la cita
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3">
                        <p>
                            Estado actual:{" "}
                            <strong>
                                {
                                    appointment
                                        .estadoCita
                                        .nombre
                                }
                            </strong>
                        </p>

                        <label
                            htmlFor="statusId"
                            className="text-sm font-medium"
                        >
                            Nuevo estado
                        </label>

                        <select
                            id="statusId"
                            value={statusId}
                            onChange={(event) =>
                                setStatusId(
                                    event.target.value
                                )
                            }
                            className="flex h-10 w-full rounded-md border px-3"
                        >
                            <option value="">
                                Seleccione un estado
                            </option>

                            {statuses.map((status) => (
                                <option
                                    key={status.id}
                                    value={status.id}
                                >
                                    {status.nombre}
                                </option>
                            ))}
                        </select>
                    </CardContent>

                    <CardFooter className="justify-end border-t pt-6">
                        <Button type="submit">
                            Guardar estado
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </section>
    );
}