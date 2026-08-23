import { useState } from "react";
import PropTypes from "prop-types";
import { useForm, Controller } from "react-hook-form";
import { uploadServiceImage } from "@/services/servicesService";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceSchema } from "@/schemas/serviceSchema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function ServiceForm({
    onSubmit,
    specialties,
    initialData = null,
    submitText = "Crear servicio",
}) {
    const [imagePreview, setImagePreview] = useState(
        initialData?.imagen
            ? `${import.meta.env.VITE_API_URL}/images/${initialData.imagen}`
            : null
    );

    const {
        register,
        handleSubmit,
        control,
        setError,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
            nombre: initialData?.nombre || "",
            descripcion: initialData?.descripcion || "",
            precioBase: initialData?.precioBase || "",
            duracionMinutos: initialData?.duracionMinutos || "",
            especialidadId: initialData?.especialidadId
                ? String(initialData.especialidadId)
                : "",
            imagen: undefined,
        },
    });

    // Genera una vista previa local de la imagen antes de enviarla al API.
    function handleImageChange(service) {
        const file = service.target.files?.[0]
        if (!file) {
            setImagePreview(null)
            return
        }
        const previewURL = URL.createObjectURL(file)
        setImagePreview(previewURL)
    }

    // Sube la imagen, convierte los valores numéricos y prepara los datos del servicio.
    async function handleValidSubmit(formData) {
        const file = formData.imagen?.[0];

        if(!file && !initialData?.imagen) {
            setError("imagen", {
                type: "manual",
                message: "Debe seleccionar una imagen"
            });
            return;
        }

        let imageName = initialData?.imagen || null;

        if (file) {
            imageName = await uploadServiceImage(
                file,
                initialData?.imagen || null
            );
        }

        const dataToSend = {
            nombre: formData.nombre.trim(),
            descripcion: formData.descripcion.trim(),
            precioBase: Number(formData.precioBase),
            duracionMinutos: Number(formData.duracionMinutos),
            especialidadId: Number(formData.especialidadId),
            imagen: imageName,
        };

        await onSubmit(dataToSend);

        reset();
    }
    return (
        <Card className="mx-auto max-w-4xl border-border/70 shadow-sm">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Datos del servicio</CardTitle>
                <CardDescription>
                    Complete la información principal del servicio.
                </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit(handleValidSubmit)}>
                <CardContent className="grid gap-6">
                    <div className="grid gap-5 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label htmlFor="nombre" className="mb-2 block text-sm font-medium">
                                Nombre del servicio
                            </label>
                            <Input
                                id="nombre"
                                placeholder="Ej: Manicure spa"
                                className={errors.nombre ? "border-destructive" : ""}
                                {...register("nombre", { required: "El nombre es obligatorio" })}
                            />
                            {errors.nombre && (
                                <p className="mt-1 text-sm text-destructive">
                                    {errors.nombre.message}
                                </p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="descripcion" className="mb-2 block text-sm font-medium">
                                Descripción
                            </label>
                            <Textarea
                                id="descripcion"
                                placeholder="Describa el servicio"
                                rows={4}
                                className={errors.descripcion ? "border-destructive" : ""}
                                {...register("descripcion", {
                                    required: "La descripción es obligatoria",
                                })}
                            />
                            {errors.descripcion && (
                                <p className="mt-1 text-sm text-destructive">
                                    {errors.descripcion.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="precioBase" className="mb-2 block text-sm font-medium">
                                Precio base
                            </label>
                            <Input
                                id="precioBase"
                                type="number"
                                min="1"
                                placeholder="Ej: 8000"
                                className={errors.precioBase ? "border-destructive" : ""}
                                {...register("precioBase", {
                                    required: "El precio es obligatorio",
                                })}
                            />
                            {errors.precioBase && (
                                <p className="mt-1 text-sm text-destructive">
                                    {errors.precioBase.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="duracionMinutos" className="mb-2 block text-sm font-medium">
                                Duración en minutos
                            </label>
                            <Input
                                id="duracionMinutos"
                                type="number"
                                min="15"
                                placeholder="Ej: 45"
                                className={errors.duracionMinutos ? "border-destructive" : ""}
                                {...register("duracionMinutos", {
                                    required: "La duración es obligatoria",
                                })}
                            />
                            {errors.duracionMinutos && (
                                <p className="mt-1 text-sm text-destructive">
                                    {errors.duracionMinutos.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="especialidadId" className="mb-2 block text-sm font-medium">
                                Especialidad
                            </label>
                            <Controller
                                name="especialidadId"
                                control={control}
                                rules={{ required: "La especialidad es obligatoria" }}
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className={errors.especialidadId ? "border-destructive" : ""}>
                                            <SelectValue placeholder="Seleccione una especialidad" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {specialties.map((specialty) => (
                                                <SelectItem key={specialty.id} value={String(specialty.id)}>
                                                    {specialty.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.especialidadId && (
                                <p className="mt-1 text-sm text-destructive">
                                    {errors.especialidadId.message}
                                </p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="imagen" className="mb-2 block text-sm font-medium">
                                Imagen del servicio
                            </label>

                            <div className="grid gap-4 rounded-xl border border-dashed bg-muted/30 p-4 md:grid-cols-[220px_1fr]">
                                <div className="flex h-40 items-center justify-center overflow-hidden rounded-lg border bg-background">
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="Vista previa del servicio"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-center text-muted-foreground">
                                            <span className="text-sm font-medium">Vista previa</span>
                                            <p className="text-xs">Sin imagen seleccionada</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col justify-center gap-3">
                                    <Input
                                        id="imagen"
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.webp"
                                        className="hidden"
                                        {...register("imagen", { onChange: handleImageChange })}
                                    />
                                    {errors.imagen && (
                                        <p className="mt-1 text-sm text-destructive">
                                            {errors.imagen.message}
                                        </p>
                                    )}

                                    <label
                                        htmlFor="imagen"
                                        className="inline-flex w-fit cursor-pointer items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                                    >
                                        Seleccionar imagen
                                    </label>

                                    <p className="text-xs text-muted-foreground">
                                        Si no selecciona una imagen, se conservará la anterior o se guardará como vacía al crear.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            reset();
                            setImagePreview(null);
                        }}
                    >
                        Limpiar
                    </Button>

                    <Button type="submit" disabled={isSubmitting}>
                        {submitText}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}

ServiceForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    specialties: PropTypes.array.isRequired,
    initialData: PropTypes.object,
    submitText: PropTypes.string,
};
