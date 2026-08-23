import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { PageHeader } from "@/components/PageHeader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EmployeeForm } from "@/components/EmployeeForm";

import { createEmployee, getServices, getSpecialties, getUsers } from "@/services/employeesService";

export function EmployeeCreatePage() {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Carga usuarios, especialidades y servicios que pueden asociarse al empleado.
    useEffect(() => {
        async function loadFormData() {
            try {
                setLoading(true);
                const [usersData, specialtiesData, servicesData] = await Promise.all([
                    getUsers("Empleado"),
                    getSpecialties(),
                    getServices(),
                ]);

                setUsers(
                    usersData.data.filter(
                        (item) =>
                            item.activo &&
                            item.rol?.nombre === "Empleado" &&
                            !item.empleado
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

        loadFormData();
    }, []);

    // Crea el empleado y vuelve al listado cuando la operación termina correctamente.
    async function handleCreateEmployee(formData) {
        try {
            const response = await createEmployee(formData);
            navigate("/empleados", {
                state: { success: response.message },
            });
        } catch (requestError) {
            setError(requestError.message);
        }
    }

    if (loading) {
        return <p className="text-muted-foreground">Cargando datos del formulario...</p>;
    }

    return (
        <section className="space-y-6">
            <Button asChild variant="outline">
                <Link to="/empleados">Volver</Link>
            </Button>

            <PageHeader
                title="Crear empleado"
                description="Complete la información del empleado"
            />

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <EmployeeForm
                onSubmit={handleCreateEmployee}
                users={users}
                specialties={specialties}
                services={services}
            />
        </section>
    );
}
