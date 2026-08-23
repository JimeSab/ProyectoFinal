import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { PageHeader } from "@/components/PageHeader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EmployeeForm } from "@/components/EmployeeForm";
import { Button } from "@/components/ui/button";

import {
    getEmployeeById,
    updateEmployee,
    getServices,
    getSpecialties,
    getUsers,
} from "@/services/employeesService";

export function EmployeeEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [employee, setEmployee] = useState(null);
    const [users, setUsers] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Carga el empleado y filtra los usuarios disponibles para evitar duplicar empleados.
    useEffect(() => {
        async function loadEditData() {
            try {
                setLoading(true);

                const [employeeData, usersData, specialtiesData, servicesData] = await Promise.all([
                    getEmployeeById(id),
                    getUsers("Empleado"),
                    getSpecialties(),
                    getServices(),
                ]);

                setEmployee(employeeData.data);
                setUsers(
                    usersData.data.filter(
                        (item) =>
                            item.activo &&
                            item.rol?.nombre === "Empleado" &&
                            (
                                !item.empleado ||
                                item.id === employeeData.data.usuarioId
                            )
                    )
                );
                setSpecialties(specialtiesData.data.filter((item) => item.activo));
                setServices(servicesData.data.filter((item) => item.activo));
            } catch (requestError) {
                setError(requestError.message);
            } finally {
                setLoading(false);
            }
        }

        loadEditData();
    }, [id]);

    // Envía los cambios del empleado y regresa al mantenimiento principal.
    async function handleUpdateEmployee(formData) {
        try {
            const response = await updateEmployee(id, formData);
            navigate("/empleados", {
                state: { success: response.message },
            });
        } catch (requestError) {
            setError(requestError.message);
        }
    }

    if (loading) {
        return <p className="text-muted-foreground">Cargando datos del empleado...</p>;
    }

    if (!employee) {
        return (
            <Alert variant="destructive">
                <AlertDescription>{error || "El empleado no existe."}</AlertDescription>
            </Alert>
        );
    }

    return (
        <section className="space-y-6">
            <Button asChild variant="outline">
                <Link to="/empleados">Volver</Link>
            </Button>

            <PageHeader
                title="Editar empleado"
                description="Modifique la información del empleado seleccionado"
            />

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <EmployeeForm
                onSubmit={handleUpdateEmployee}
                users={users}
                specialties={specialties}
                services={services}
                initialData={employee}
                submitText="Actualizar empleado"
            />
        </section>
    );
}
