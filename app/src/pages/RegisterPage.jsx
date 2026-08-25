import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Mail, LockKeyhole, User, Phone } from "lucide-react";
import toast from "react-hot-toast";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { registrationSchema } from "@/schemas/registrationSchema";

import { registerUser } from "@/services/authService";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function RegisterPage() {
    const navigate = useNavigate();

    // Configura el formulario y aplica las validaciones del registro público.
    const {
        register,
        handleSubmit: handleFormSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            nombre: "",
            primerApellido: "",
            segundoApellido: "",
            correo: "",
            telefono: "",
            password: "",
        },
    });

    // Envía los datos del nuevo cliente al endpoint público de registro.
    async function onSubmit(formData) {
        try {
            // Limpia los textos antes de enviarlos y no permite elegir otro rol,
            // porque este formulario solo crea clientes.
            await registerUser({
                nombre: formData.nombre.trim(),
                primerApellido: formData.primerApellido.trim(),
                segundoApellido: formData.segundoApellido?.trim() || null,
                correo: formData.correo.trim(),
                telefono: formData.telefono?.trim() || null,
                password: formData.password,
            });

            toast.success("Cliente registrado correctamente.");
            // Después del registro, dirige al cliente al inicio de sesión.
            navigate("/login", { replace: true });
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <section className="mx-auto max-w-md py-8">
            <Card className="shadow-lg">
                <CardHeader className="space-y-2 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <UserPlus className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">
                        Registro de clientes
                    </CardTitle>
                    <CardDescription>
                        Complete sus datos para crear una cuenta nueva.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="nombre" className="text-sm font-medium">
                                Nombre
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="nombre"
                                    type="text"
                                    placeholder="María"
                                    className="pl-9"
                                    disabled={isSubmitting}
                                    {...register("nombre")}
                                />
                                {errors.nombre && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.nombre.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="primerApellido" className="text-sm font-medium">
                                Primer apellido
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="primerApellido"
                                    type="text"
                                    placeholder="López"
                                    className="pl-9"
                                    disabled={isSubmitting}
                                    {...register("primerApellido")}
                                />
                                {errors.primerApellido && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.primerApellido.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="segundoApellido" className="text-sm font-medium">
                                Segundo apellido
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="segundoApellido"
                                    type="text"
                                    placeholder="Mora"
                                    className="pl-9"
                                    disabled={isSubmitting}
                                    {...register("segundoApellido")}
                                />
                                {errors.segundoApellido && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.segundoApellido.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="correo" className="text-sm font-medium">
                                Correo electrónico
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="correo"
                                    type="email"
                                    placeholder="usuario@email.com"
                                    className="pl-9"
                                    disabled={isSubmitting}
                                    {...register("correo")}
                                />
                                {errors.correo && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.correo.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="telefono" className="text-sm font-medium">
                                Teléfono
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="telefono"
                                    type="tel"
                                    inputMode="numeric"
                                    maxLength={8}
                                    placeholder="88888888"
                                    className="pl-9"
                                    disabled={isSubmitting}
                                    {...register("telefono", {
                                        onChange: (event) => {
                                            event.target.value = event.target.value
                                                .replace(/[^0-9]/g, "")
                                                .slice(0, 8);
                                        },
                                    })}
                                />
                                {errors.telefono && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.telefono.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium">
                                Contraseña
                            </label>
                            <div className="relative">
                                <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Cliente123"
                                    className="pl-9"
                                    disabled={isSubmitting}
                                    {...register("password")}
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            <UserPlus className="mr-2 h-4 w-4" />
                            {isSubmitting ? "Registrando..." : "Registrarse"}
                        </Button>

                        <p className="text-center text-sm text-muted-foreground">
                            ¿Ya tiene cuenta?{" "}
                            <Link
                                to="/login"
                                className="font-medium text-primary hover:underline"
                            >
                                Iniciar sesión
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </section>
    );
}