import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { PageHeader } from "@/components/PageHeader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { getEmployees, updateEmployeeStatus } from "@/services/employeesService";
import { useAuth } from "@/auth/useAuth";

export function EmployeesPage() {
    const { isAuthenticated, user } = useAuth();
    const isAdmin = user?.rol?.nombre === "Administrador";

    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [changingId, setChangingId] = useState(null);

    // Consulta los empleados y actualiza el listado cuando se carga la página.
    useEffect(() => {
        async function loadEmployees() {
            try {
                setLoading(true);
                setError("");
                const response = await getEmployees();
                setEmployees(response.data);
            } catch (requestError) {
                setError(requestError.message);
            } finally {
                setLoading(false);
            }
        }

        loadEmployees();
    }, []);

    // Cambia el estado del empleado respetando las reglas del API sobre citas activas.
    async function handleStatusChange(employee) {
        const confirmed = window.confirm(
            `¿Desea ${employee.activo ? "desactivar" : "activar"} a ${employee.usuario?.nombre || "este empleado"}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setChangingId(employee.id);
            const response = await updateEmployeeStatus(employee.id, !employee.activo);

            setEmployees((current) =>
                current.map((item) => (item.id === employee.id ? response.data : item))
            );
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setChangingId(null);
        }
    }

    if (loading) {
        return <p className="text-muted-foreground">Cargando empleados...</p>;
    }

    return (
        <section className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <PageHeader
                    title="Empleados"
                    description="Listado de empleados del sistema"
                />

                {isAuthenticated && isAdmin && (
                    <Button asChild>
                        <Link to="/empleados/nuevo">Nuevo empleado</Link>
                    </Button>
                )}
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {employees.length === 0 ? (
                <p className="rounded-lg border border-dashed p-8 text-center">
                    No hay empleados para mostrar.
                </p>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {employees.map((employee) => (
                        <Card key={employee.id}>
                            <CardHeader>
                                <CardTitle>{employee.usuario?.nombre} {employee.usuario?.primerApellido}</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    {employee.codigoEmpleado}
                                </p>
                            </CardHeader>

                            <CardContent className="space-y-2 text-sm">
                                <p><strong>Especialidad:</strong> {employee.especialidad?.nombre}</p>
                                <p><strong>Servicios:</strong> {employee.servicios?.length || 0}</p>
                                <p><strong>Estado:</strong> {employee.activo ? "Activo" : "Inactivo"}</p>
                            </CardContent>

                            <CardFooter className="flex flex-wrap gap-2">
                                <Button asChild variant="outline" className="flex-1">
                                    <Link to={`/empleados/${employee.id}`}>Detalle</Link>
                                </Button>

                                {isAuthenticated && isAdmin && (
                                    <>
                                        <Button asChild variant="outline" className="flex-1">
                                            <Link to={`/empleados/${employee.id}/editar`}>Editar</Link>
                                        </Button>

                                        <Button
                                            type="button"
                                            variant={employee.activo ? "destructive" : "secondary"}
                                            className="w-full"
                                            disabled={changingId === employee.id}
                                            onClick={() => handleStatusChange(employee)}
                                        >
                                            {changingId === employee.id
                                                ? "Actualizando..."
                                                : employee.activo
                                                    ? "Desactivar"
                                                    : "Activar"}
                                        </Button>
                                    </>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </section>
    );
}
