import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { employeeSchema } from "@/schemas/employeeSchema";

export function EmployeeForm({
    onSubmit,
    users,
    specialties,
    services,
    initialData = null,
    submitText = "Crear empleado",
}) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(employeeSchema),
        defaultValues: {
            usuarioId: initialData?.usuarioId ? String(initialData.usuarioId) : "",
            especialidadId: initialData?.especialidadId ? String(initialData.especialidadId) : "",
            codigoEmpleado: initialData?.codigoEmpleado || "",
            descripcion: initialData?.descripcion || "",
            servicioIds: initialData?.servicios?.map((service) => String(service.id)) || [],
        },
    });

    // Observa los servicios seleccionados para mantener sincronizadas las casillas.
    const selectedServiceIds = watch("servicioIds");

    // Agrega o quita un servicio de la lista que se enviará al API.
    function toggleService(id) {
        const current = selectedServiceIds || [];
        const exists = current.includes(String(id));

        const next = exists
            ? current.filter((serviceId) => serviceId !== String(id))
            : [...current, String(id)];

        setValue("servicioIds", next, { shouldValidate: true });
    }

    // Convierte los identificadores a números y prepara la información del empleado.
    async function handleValidSubmit(formData) {
        await onSubmit({
            usuarioId: Number(formData.usuarioId),
            especialidadId: Number(formData.especialidadId),
            codigoEmpleado: formData.codigoEmpleado.trim(),
            descripcion: formData.descripcion?.trim() || null,
            servicioIds: formData.servicioIds.map(Number),
        });
    }

    return (
        <Card className="mx-auto max-w-4xl">
            <CardHeader>
                <CardTitle className="text-2xl">Datos del empleado</CardTitle>
            </CardHeader>

            <form onSubmit={handleSubmit(handleValidSubmit)} noValidate>
                <CardContent className="grid gap-5">
                    <div>
                        <label htmlFor="usuarioId" className="mb-2 block text-sm font-medium">
                            Usuario *
                        </label>

                        <select
                            id="usuarioId"
                            className={`w-full rounded-md border px-3 py-2 ${errors.usuarioId ? "border-red-500" : ""}`}
                            {...register("usuarioId")}
                        >
                            <option value="">Seleccione un usuario</option>
                            {users.map((user) => (
                                <option key={user.id} value={String(user.id)}>
                                    {user.nombre} {user.primerApellido}
                                </option>
                            ))}
                        </select>

                        {errors.usuarioId && (
                            <p className="mt-1 text-sm text-red-600">{errors.usuarioId.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Correo del usuario
                        </label>

                        <Input
                            value={
                                users.find((user) => String(user.id) === watch("usuarioId"))?.correo || ""
                            }
                            readOnly
                        />
                    </div>

                    <div>
                        <label htmlFor="especialidadId" className="mb-2 block text-sm font-medium">
                            Especialidad *
                        </label>
                        <select
                            id="especialidadId"
                            className={`w-full rounded-md border px-3 py-2 ${errors.especialidadId ? "border-red-500" : ""}`}
                            {...register("especialidadId")}
                        >
                            <option value="">Seleccione una especialidad</option>
                            {specialties.map((specialty) => (
                                <option key={specialty.id} value={String(specialty.id)}>
                                    {specialty.nombre}
                                </option>
                            ))}
                        </select>
                        {errors.especialidadId && (
                            <p className="mt-1 text-sm text-red-600">{errors.especialidadId.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="codigoEmpleado" className="mb-2 block text-sm font-medium">
                            Código del empleado *
                        </label>
                        <Input
                            id="codigoEmpleado"
                            placeholder="Ej: EMP-001"
                            {...register("codigoEmpleado")}
                        />
                        {errors.codigoEmpleado && (
                            <p className="mt-1 text-sm text-red-600">{errors.codigoEmpleado.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="descripcion" className="mb-2 block text-sm font-medium">
                            Descripción
                        </label>
                        <Textarea
                            id="descripcion"
                            rows={4}
                            placeholder="Descripción opcional del empleado"
                            {...register("descripcion")}
                        />
                    </div>

                    <div>
                        <p className="mb-3 text-sm font-medium">Servicios asignados *</p>

                        <input
                            type="hidden"
                            {...register("servicioIds")}
                        />
                        <div className="grid gap-3 md:grid-cols-2">
                            {services.map((service) => (
                                <label key={service.id} className="flex items-start gap-3 rounded-md border p-3">
                                    <Checkbox
                                        checked={selectedServiceIds?.includes(String(service.id))}
                                        onCheckedChange={() => toggleService(service.id)}
                                    />
                                    <span className="text-sm">
                                        {service.nombre}
                                    </span>
                                </label>
                            ))}
                        </div>

                        {errors.servicioIds && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.servicioIds.message}
                            </p>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="flex justify-end gap-3">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Guardando..." : submitText}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}

EmployeeForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    users: PropTypes.array.isRequired,
    specialties: PropTypes.array.isRequired,
    services: PropTypes.array.isRequired,
    initialData: PropTypes.object,
    submitText: PropTypes.string,
};
