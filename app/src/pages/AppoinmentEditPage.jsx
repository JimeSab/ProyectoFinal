import { useEffect, useState } from "react";

import {
    Navigate,
    useNavigate,
    useParams,
} from "react-router-dom";

import { useAuth } from "@/auth/useAuth";
import { AppointmentForm } from "@/components/AppointmentForm";
import { PageHeader } from "@/components/PageHeader";
import {
    Alert,
    AlertDescription,
} from "@/components/ui/alert";

import {
    checkAvailability,
    getActiveClients,
    getAppointmentById,
    updateAppointment,
} from "@/services/appointmentsService";
import { getActiveServices } from "@/services/servicesService";
import { getActiveAdditionals } from "@/services/additionalsService";
import { getActiveEmployees } from "@/services/employeesService";

export function AppointmentEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [appointment, setAppointment] =
        useState(null);
    const [clients, setClients] = useState([]);
    const [services, setServices] = useState([]);
    const [employees, setEmployees] =
        useState([]);
    const [additionals, setAdditionals] =
        useState([]);
    const [loading, setLoading] =
        useState(true);
    const [error, setError] = useState("");

    /*
    Carga la cita y los datos del formulario
    */

    useEffect(() => {
        async function loadEditData() {
            try {
                setLoading(true);

                const appointmentResponse =
                    await getAppointmentById(id);

                const appointmentData =
                    appointmentResponse.data ||
                    appointmentResponse;

                if (
                    !appointmentData.estadoCita
                        .permiteEdicion
                ) {
                    setError(
                        "El estado de la cita no permite editarla."
                    );
                    return;
                }

                const [
                    clientsData,
                    servicesData,
                    additionalsData,
                    employeesData,
                ] = await Promise.all([
                    getActiveClients(),
                    getActiveServices(),
                    getActiveAdditionals(),
                    getActiveEmployees(
                        appointmentData.servicioId
                    ),
                ]);

                const clientList =
                    clientsData.data || clientsData;

                setAppointment(appointmentData);

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

                setEmployees(
                    employeesData.data ||
                    employeesData
                );
            } catch (requestError) {
                setError(requestError.message);
            } finally {
                setLoading(false);
            }
        }

        loadEditData();
    }, [id]);

    /*
    Carga empleados al cambiar el servicio
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

            setEmployees(
                response.data || response
            );
        } catch (requestError) {
            setError(requestError.message);
        }
    }

    /*
    Comprueba disponibilidad y actualiza la cita.
    */

    async function handleUpdateAppointment(
        formData
    ) {
        try {
            setError("");

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
                    citaIdExcluir: Number(id),
                });

            const availability =
                availabilityResponse.data ||
                availabilityResponse;

            if (!availability.disponible) {
                throw new Error(
                    availability.motivo
                );
            }

            await updateAppointment(
                id,
                formData
            );

            navigate(`/citas/${id}`);
        } catch (requestError) {
            setError(requestError.message);
        }
    }

    if (loading) {
        return (
            <p className="text-muted-foreground">
                Cargando datos de la cita...
            </p>
        );
    }

    if (error && !appointment) {
        return (
            <Alert variant="destructive">
                <AlertDescription>
                    {error}
                </AlertDescription>
            </Alert>
        );
    }

const employeeCannotEdit =
    user?.rol?.nombre === "Empleado" &&
    user?.empleado?.id !==
        appointment.empleadoId;

if (employeeCannotEdit) {
    return (
        <Navigate
            to="/unauthorized"
            replace
        />
    );
}

    return (
        <section className="space-y-6">
            <PageHeader
                title="Editar cita"
                description="Modifique la información de la cita"
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
                    handleUpdateAppointment
                }
                onServiceChange={
                    handleServiceChange
                }
                clients={clients}
                services={services}
                employees={employees}
                additionals={additionals}
                initialData={appointment}
                submitText="Actualizar cita"
            />
        </section>
    );
}