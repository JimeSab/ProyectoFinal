import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function AdditionalForm({
    onSubmit,
    initialData = null,
    submitText = "Crear adicional",
}) {
    /*
    Administra el formulario usando useForm de React Hook Form
    para registrar los campos, validar la información, mostrar errores
    y controlar cuándo se están enviando los datos.
    */
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        /*
        Carga los valores usando defaultValues para que los campos estén
        vacíos al crear o muestren la información existente al editar.
        */
        defaultValues: {
            nombre: initialData?.nombre || "",
            descripcion: initialData?.descripcion || "",
            precio: initialData?.precio || "",
        },
    });

    /*
    Prepara la información usando trim para eliminar espacios innecesarios
    y Number para convertir el precio antes de enviarlo al API.
    */
    async function handleValidSubmit(formData) {
        await onSubmit({
            nombre: formData.nombre.trim(),
            descripcion: formData.descripcion.trim(),
            precio: Number(formData.precio),
        });
    }

    return (
        /*
        Organiza visualmente el formulario usando Card de shadcn
        para mantener el mismo diseño utilizado en el proyecto.
        */
        <Card className="mx-auto max-w-3xl border-border/70 shadow-sm">
            <CardHeader>
                <CardTitle className="text-2xl">
                    Datos del servicio adicional
                </CardTitle>

                <CardDescription>
                    Complete los campos obligatorios para guardar el servicio
                    adicional.
                </CardDescription>
            </CardHeader>

            {/*
            Procesa el formulario usando handleSubmit para comprobar
            las validaciones antes de ejecutar handleValidSubmit.
            */}
            <form onSubmit={handleSubmit(handleValidSubmit)} noValidate>
                <CardContent className="grid gap-5">

                    <div>
                        <label
                            htmlFor="nombre"
                            className="mb-2 block text-sm font-medium"
                        >
                            Nombre *
                        </label>

                        {/*
                        Registra el campo usando register para guardar su valor
                        y comprobar que tenga entre 3 y 120 caracteres.
                        */}
                        <Input
                            id="nombre"
                            placeholder="Ej: Decoración con piedras"
                            aria-invalid={Boolean(errors.nombre)}
                            {...register("nombre", {
                                required: "El nombre es obligatorio.",
                                minLength: {
                                    value: 3,
                                    message:
                                        "El nombre debe contener al menos 3 caracteres.",
                                },
                                maxLength: {
                                    value: 120,
                                    message:
                                        "El nombre no puede superar 120 caracteres.",
                                },
                            })}
                        />

                        {/*
                        Consulta errors.nombre para mostrar el mensaje
                        cuando el nombre no cumple alguna validación.
                        */}
                        {errors.nombre && (
                            <p className="mt-1 text-sm text-destructive">
                                {errors.nombre.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="descripcion"
                            className="mb-2 block text-sm font-medium"
                        >
                            Descripción *
                        </label>

                        {/*
                        Registra la descripción usando register para comprobar
                        que sea obligatoria y tenga entre 10 y 500 caracteres.
                        */}
                        <Textarea
                            id="descripcion"
                            rows={5}
                            placeholder="Describa el servicio adicional"
                            aria-invalid={Boolean(errors.descripcion)}
                            {...register("descripcion", {
                                required: "La descripción es obligatoria.",
                                minLength: {
                                    value: 10,
                                    message:
                                        "La descripción debe contener al menos 10 caracteres.",
                                },
                                maxLength: {
                                    value: 500,
                                    message:
                                        "La descripción no puede superar 500 caracteres.",
                                },
                            })}
                        />

                        {/*
                        Consulta errors.descripcion para mostrar el mensaje
                        cuando la descripción no cumple alguna validación.
                        */}
                        {errors.descripcion && (
                            <p className="mt-1 text-sm text-destructive">
                                {errors.descripcion.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="precio"
                            className="mb-2 block text-sm font-medium"
                        >
                            Precio adicional (₡) *
                        </label>

                        {/*
                        Registra el precio usando register y valueAsNumber
                        para convertirlo a número y comprobar que esté
                        dentro del rango permitido por el API.
                        */}
                        <Input
                            id="precio"
                            type="number"
                            min="0"
                            max="99999999.99"
                            step="0.01"
                            placeholder="Ej: 2500"
                            aria-invalid={Boolean(errors.precio)}
                            {...register("precio", {
                                required: "El precio es obligatorio.",
                                valueAsNumber: true,
                                min: {
                                    value: 0,
                                    message:
                                        "El precio debe ser mayor o igual a cero.",
                                },
                                max: {
                                    value: 99999999.99,
                                    message:
                                        "El precio no puede superar ₡99.999.999,99.",
                                },
                            })}
                        />

                        {/*
                        Consulta errors.precio para mostrar el mensaje
                        cuando el precio no cumple alguna validación.
                        */}
                        {errors.precio && (
                            <p className="mt-1 text-sm text-destructive">
                                {errors.precio.message}
                            </p>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                    {/*
                    Utiliza Link para regresar al listado de adicionales
                    sin enviar ni guardar la información del formulario.
                    */}
                    <Button asChild variant="outline">
                        <Link to="/adicionales">Cancelar</Link>
                    </Button>

                    {/*
                    Utiliza isSubmitting para deshabilitar el botón mientras
                    se guardan los datos y así impedir múltiples envíos.
                    */}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#F5AFAF] text-black hover:bg-[#f29c9c]"
                    >
                        {isSubmitting ? "Guardando..." : submitText}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}

/*
Valida las propiedades usando PropTypes para comprobar que el formulario
reciba una función onSubmit y datos con los tipos correctos.
*/
AdditionalForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    initialData: PropTypes.shape({
        nombre: PropTypes.string,
        descripcion: PropTypes.string,
        precio: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
    }),
    submitText: PropTypes.string,
};