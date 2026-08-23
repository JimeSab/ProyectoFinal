import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "@/auth/useAuth";
import { AppointmentList } from "@/components/AppointmentList";
import { PageHeader } from "@/components/PageHeader";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";

import {
    getAppointments,
    getAppointmentsByClient,
    getAppointmentsByEmployee,
} from "@/services/appointmentsService";

export function AppointmentsPage() {
    const { user } = useAuth();

    const [appointments, setAppointments] =
        useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] =
        useState(true);
    const [error, setError] = useState("");

    const role = user?.rol?.nombre;

    /*
    Carga las citas según el rol del usuario.
    */
    
    useEffect(() => {
        async function fetchAppointments() {
            try {
                setLoading(true);
                setError("");

                let response;

                if (role === "Cliente") {
                    response =
                        await getAppointmentsByClient(
                            user.id
                        );
                } else if (role === "Empleado") {
                    response =
                        await getAppointmentsByEmployee(
                            user.empleado.id
                        );
                } else {
                    response =
                        await getAppointments();
                }

                setAppointments(
                    response.data || response
                );
            } catch (requestError) {
                console.error(requestError);
                setError(
                    "No se pudieron cargar las citas."
                );
            } finally {
                setLoading(false);
            }
        }

        if (user) {
            fetchAppointments();
        }
    }, [user, role]);

    /*
    Filtra las citas por servicio, cliente o empleado.
    */

    const filteredAppointments =
        appointments.filter((appointment) => {
            const value = search.toLowerCase();

            return (
                appointment.servicio.nombre
                    .toLowerCase()
                    .includes(value) ||
                appointment.cliente.nombre
                    .toLowerCase()
                    .includes(value) ||
                appointment.empleado.usuario.nombre
                    .toLowerCase()
                    .includes(value)
            );
        });

    if (loading) {
        return (
            <p className="text-center text-gray-500">
                Cargando citas...
            </p>
        );
    }

    if (error) {
        return (
            <p className="text-center text-red-500">
                {error}
            </p>
        );
    }

    return (
        <section>
            <PageHeader
                title="Citas"
                description={
                    filteredAppointments.length
                }
                isBadge={true}
            />

            {(role === "Administrador" ||
                role === "Empleado") && (
                <div className="mb-6">
                    <Button asChild>
                        <Link to="/citas/nueva">
                            Crear cita
                        </Link>
                    </Button>
                </div>
            )}

            <SearchBar
                value={search}
                onChange={setSearch}
            />

            {filteredAppointments.length === 0 ? (
                <p className="text-center text-gray-400">
                    No hay citas registradas.
                </p>
            ) : (
                <AppointmentList
                    appointments={
                        filteredAppointments
                    }
                />
            )}
        </section>
    );
}