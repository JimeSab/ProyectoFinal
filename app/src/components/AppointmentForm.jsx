import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { appointmentSchema } from "../schemas/appointmentSchema";
import {
    calculateEndTime,
    getLocalToday,
} from "../lib/appointmentUtils";
import { FormError } from "./FormError";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card";

export function AppointmentForm({
    onSubmit,
    onServiceChange,
    clients,
    services,
    employees,
    additionals,
    initialData = null,
    submitText = "Guardar cita",
}) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm({
        resolver: zodResolver(appointmentSchema),
        defaultValues: {
            clienteId: initialData?.clienteId
                ? String(initialData.clienteId)
                : "",
            servicioId: initialData?.servicioId
                ? String(initialData.servicioId)
                : "",
            empleadoId: initialData?.empleadoId
                ? String(initialData.empleadoId)
                : "",
            fecha: initialData?.fecha
                ? initialData.fecha.slice(0, 10)
                : getLocalToday(),
            horaInicio: initialData?.horaInicio
                ? initialData.horaInicio.slice(0, 5)
                : "",
            observaciones:
                initialData?.observaciones || "",
            adicionalIds: initialData?.adicionales
                ? initialData.adicionales.map(
                    (additional) =>
                        String(additional.id)
                )
                : [],
        },
    });

    const serviceId = watch("servicioId");
    const startTime = watch("horaInicio");
    const additionalIds =
        watch("adicionalIds") || [];

    /*
    Busca el servicio seleccionado para obtener
    su duración y precio.
    */

    const selectedService = services.find(
        (service) =>
            String(service.id) === serviceId
    );

    const durationMinutes =
        Number(
            selectedService?.duracionMinutos || 0
        );

    const servicePrice =
        Number(selectedService?.precioBase || 0);

    /*
    Calcula la hora final usando la duración
    del servicio principal.
    */

    const endTime = calculateEndTime(
        startTime,
        durationMinutes
    );

    /*
    Busca los adicionales seleccionados
    y suma sus precios.
    */

    const selectedAdditionals =
        additionals.filter((additional) =>
            additionalIds.includes(
                String(additional.id)
            )
        );

    const additionalCost =
        selectedAdditionals.reduce(
            (total, additional) =>
                total + Number(additional.precio),
            0
        );

    const totalCost =
        servicePrice + additionalCost;

    /*
    Prepara los datos que utilizará la página
    para enviar la cita al API.
    */

    async function handleValidSubmit(formData) {
        const dataToSend = {
            ...formData,
            clienteId: Number(formData.clienteId),
            servicioId: Number(formData.servicioId),
            empleadoId: Number(formData.empleadoId),
            horaFin: endTime,
            duracionMinutos: durationMinutes,
            precioServicio: servicePrice,
            costoAdicionales: additionalCost,
            costoTotal: totalCost,
            adicionalIds:
                formData.adicionalIds.map(Number),
        };

        await onSubmit(dataToSend);
    }

    return (
        <Card className="mx-auto max-w-4xl">
            <CardHeader>
                <CardTitle>Datos de la cita</CardTitle>
                <CardDescription>
                    Complete los datos para guardar la cita.
                </CardDescription>
            </CardHeader>

            <form
                onSubmit={handleSubmit(
                    handleValidSubmit
                )}
            >
                <CardContent className="grid gap-5">
                    <div className="grid gap-5 md:grid-cols-2">
                        {/* Selecciona el cliente. */}
                        <div>
                            <label
                                htmlFor="clienteId"
                                className="mb-2 block text-sm font-medium"
                            >
                                Cliente
                            </label>

                            <select
                                id="clienteId"
                                className="flex h-10 w-full rounded-md border px-3"
                                {...register("clienteId")}
                            >
                                <option value="">
                                    Seleccione un cliente
                                </option>

                                {clients.map((client) => (
                                    <option
                                        key={client.id}
                                        value={client.id}
                                    >
                                        {client.nombre}{" "}
                                        {client.primerApellido}
                                    </option>
                                ))}
                            </select>

                            <FormError
                                message={
                                    errors.clienteId?.message
                                }
                            />
                        </div>

                        {/* Selecciona el servicio principal. */}
                        
                        <div>
                            <label
                                htmlFor="servicioId"
                                className="mb-2 block text-sm font-medium"
                            >
                                Servicio
                            </label>

                            <select
                                id="servicioId"
                                className="flex h-10 w-full rounded-md border px-3"
                                {...register("servicioId", {
                                    onChange: (event) => {
                                        setValue(
                                            "empleadoId",
                                            ""
                                        );

                                        onServiceChange(
                                            event.target.value
                                        );
                                    },
                                })}
                            >
                                <option value="">
                                    Seleccione un servicio
                                </option>

                                {services.map((service) => (
                                    <option
                                        key={service.id}
                                        value={service.id}
                                    >
                                        {service.nombre}
                                    </option>
                                ))}
                            </select>

                            <FormError
                                message={
                                    errors.servicioId?.message
                                }
                            />
                        </div>

                        {/* Selecciona un empleado disponible. */}

                        <div>
                            <label
                                htmlFor="empleadoId"
                                className="mb-2 block text-sm font-medium"
                            >
                                Empleado
                            </label>

                            <select
                                id="empleadoId"
                                className="flex h-10 w-full rounded-md border px-3"
                                disabled={!serviceId}
                                {...register("empleadoId")}
                            >
                                <option value="">
                                    Seleccione un empleado
                                </option>

                                {employees.map((employee) => (
                                    <option
                                        key={employee.id}
                                        value={employee.id}
                                    >
                                        {
                                            employee.usuario
                                                .nombre
                                        }
                                    </option>
                                ))}
                            </select>

                            <FormError
                                message={
                                    errors.empleadoId?.message
                                }
                            />
                        </div>

                        {/* Selecciona la fecha. */}

                        <div>
                            <label
                                htmlFor="fecha"
                                className="mb-2 block text-sm font-medium"
                            >
                                Fecha
                            </label>

                            <Input
                                id="fecha"
                                type="date"
                                min={getLocalToday()}
                                className={
                                    errors.fecha
                                        ? "border-destructive"
                                        : ""
                                }
                                {...register("fecha")}
                            />

                            <FormError
                                message={
                                    errors.fecha?.message
                                }
                            />
                        </div>

                        {/* Selecciona la hora inicial. */}


                        <div>
                            <label
                                htmlFor="horaInicio"
                                className="mb-2 block text-sm font-medium"
                            >
                                Hora de inicio
                            </label>

                            <Input
                                id="horaInicio"
                                type="time"
                                className={
                                    errors.horaInicio
                                        ? "border-destructive"
                                        : ""
                                }
                                {...register("horaInicio")}
                            />

                            <FormError
                                message={
                                    errors.horaInicio?.message
                                }
                            />
                        </div>

                        {/* Muestra la hora calculada. */}

                        <div>
                            <label
                                htmlFor="horaFin"
                                className="mb-2 block text-sm font-medium"
                            >
                                Hora final
                            </label>

                            <Input
                                id="horaFin"
                                value={endTime}
                                placeholder="Se calcula automáticamente"
                                readOnly
                            />
                        </div>

                        {/* Selecciona los adicionales. */}

                        <div className="md:col-span-2">
                            <p className="mb-2 text-sm font-medium">
                                Servicios adicionales
                            </p>

                            <div className="grid gap-2 rounded-md border p-4">
                                {additionals.map(
                                    (additional) => (
                                        <label
                                            key={additional.id}
                                            className="flex items-center gap-2"
                                        >
                                            <input
                                                type="checkbox"
                                                value={additional.id}
                                                {...register(
                                                    "adicionalIds"
                                                )}
                                            />

                                            <span>
                                                {
                                                    additional.nombre
                                                }{" "}
                                                - ₡
                                                {Number(
                                                    additional.precio
                                                ).toLocaleString(
                                                    "es-CR"
                                                )}
                                            </span>
                                        </label>
                                    )
                                )}

                                {additionals.length === 0 && (
                                    <p className="text-sm text-muted-foreground">
                                        No hay adicionales disponibles.
                                    </p>
                                )}
                            </div>

                            <FormError
                                message={
                                    errors.adicionalIds
                                        ?.message
                                }
                            />
                        </div>

                        {/* Escribe observaciones opcionales. */}

                        <div className="md:col-span-2">
                            <label
                                htmlFor="observaciones"
                                className="mb-2 block text-sm font-medium"
                            >
                                Observaciones
                            </label>

                            <Textarea
                                id="observaciones"
                                rows={3}
                                placeholder="Observaciones de la cita"
                                className={
                                    errors.observaciones
                                        ? "border-destructive"
                                        : ""
                                }
                                {...register(
                                    "observaciones"
                                )}
                            />

                            <FormError
                                message={
                                    errors.observaciones
                                        ?.message
                                }
                            />
                        </div>

                        {/* Muestra duración y costos calculados. */}
                        
                        <div className="grid gap-2 rounded-md border p-4 md:col-span-2">
                            <p>
                                Duración:{" "}
                                {durationMinutes} minutos
                            </p>

                            <p>
                                Precio del servicio: ₡
                                {servicePrice.toLocaleString(
                                    "es-CR"
                                )}
                            </p>

                            <p>
                                Costo de adicionales: ₡
                                {additionalCost.toLocaleString(
                                    "es-CR"
                                )}
                            </p>

                            <p className="font-semibold">
                                Total: ₡
                                {totalCost.toLocaleString(
                                    "es-CR"
                                )}
                            </p>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="flex justify-end gap-3 border-t pt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => reset()}
                    >
                        Limpiar
                    </Button>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? "Guardando..."
                            : submitText}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}

AppointmentForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onServiceChange: PropTypes.func.isRequired,
    clients: PropTypes.array.isRequired,
    services: PropTypes.array.isRequired,
    employees: PropTypes.array.isRequired,
    additionals: PropTypes.array.isRequired,
    initialData: PropTypes.object,
    submitText: PropTypes.string,
};