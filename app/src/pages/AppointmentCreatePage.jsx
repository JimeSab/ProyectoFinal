import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "@/auth/useAuth";
import { AppointmentForm } from "@/components/AppointmentForm";
import { PageHeader } from "@/components/PageHeader";
import {
    Alert,
    AlertDescription,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import {
    checkAvailability,
    createAppointment,
    getActiveClients,
    getAppointmentStatuses,
} from "@/services/appointmentsService";
import { getActiveServices } from "@/services/servicesService";
import { getActiveAdditionals } from "@/services/additionalsService";
import { getActiveEmployees } from "@/services/employeesService";

export function AppointmentCreatePage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [clients, setClients] = useState([]);
    const [services, setServices] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [additionals, setAdditionals] =
        useState([]);
    const [statuses, setStatuses] = useState([]);
    const [loading, setLoading] =
        useState(true);
    const [error, setError] = useState("");

    /*
    Carga los datos necesarios para el formulario.
    */

    useEffect(() => {
        async function loadFormData() {
            try {
                setLoading(true);

                const [
                    clientsData,
                    servicesData,
                    additionalsData,
                    statusesData,
                ] = await Promise.all([
                    getActiveClients(),
                    getActiveServices(),
                    getActiveAdditionals(),
                    getAppointmentStatuses(),
                ]);

                const clientList =
                    clientsData.data || clientsData;

                setClients(
                    clientList.filter(
                        (client) => client.activo
                    )
                );

                setServices(
                    servicesData.data || servicesData
                );

                setAdditionals(
                    additionalsData.data ||
                    additionalsData
                );

                setStatuses(
                    statusesData.data || statusesData
                );
            } catch (requestError) {
                setError(requestError.message);
            } finally {
                setLoading(false);
            }
        }

        loadFormData();
    }, []);

    /*
    Carga los empleados que pueden realizar
    el servicio seleccionado.
    */

    async function handleServiceChange(serviceId) {
        if (!serviceId) {
            setEmployees([]);
            return;
        }

        try {
            setError("");

            const response =
    await getActiveEmployees(serviceId);

const employeeList =
    response.data || response;

/*Si ingresó un empleado, solamente puede
seleccionarse a sí mismo.*/
if (user?.rol?.nombre === "Empleado") {
    setEmployees(
        employeeList.filter(
            (employee) =>
                String(employee.id) ===
                String(user?.empleado?.id)
        )
    );
} else {
    setEmployees(employeeList);
}
        } catch (requestError) {
            setError(requestError.message);
        }
    }

    /*
    Comprueba la disponibilidad y después crea la cita.
    */

    async function handleCreateAppointment(formData) {
        try {
            setError("");

            const pendingStatus = statuses.find(
                (status) =>
                    status.nombre === "Pendiente"
            );

            if (!pendingStatus) {
                throw new Error(
                    "No se encontró el estado Pendiente."
                );
            }

            const availabilityResponse =
                await checkAvailability({
                    empleadoId:
                        formData.empleadoId,
                    servicioId:
                        formData.servicioId,
                    fecha: formData.fecha,
                    horaInicio:
                        formData.horaInicio,
                    horaFin: formData.horaFin,
                });

            const availability =
                availabilityResponse.data ||
                availabilityResponse;

            if (!availability.disponible) {
                throw new Error(
                    availability.motivo
                );
            }

            const appointmentData = {
                ...formData,
                estadoCitaId: pendingStatus.id,
                creadoPorUsuarioId: user.id,
            };

            const response =
                await createAppointment(
                    appointmentData
                );

            navigate("/citas", {
                state: {
                    success: response.message,
                },
            });
        } catch (requestError) {
            setError(requestError.message);
        }
    }

    if (loading) {
        return (
            <p className="text-muted-foreground">
                Cargando datos del formulario...
            </p>
        );
    }

    return (
        <section className="space-y-6">
            <Button asChild variant="outline">
                <Link to="/citas">Volver</Link>
            </Button>

            <PageHeader
                title="Crear cita"
                description="Complete la información de la cita"
            />

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>
                        {error}
                    </AlertDescription>
                </Alert>
            )}

            <AppointmentForm
                onSubmit={
                    handleCreateAppointment
                }
                onServiceChange={
                    handleServiceChange
                }
                clients={clients}
                services={services}
                employees={employees}
                additionals={additionals}
                submitText="Crear cita"
            />
        </section>
    );
}