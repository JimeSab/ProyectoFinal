import { Link, useLocation, useNavigate } from "react-router-dom"
import { LogIn, Mail, LockKeyhole } from "lucide-react"
import toast from "react-hot-toast"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema } from "@/schemas/loginSchema";

import { useAuth } from "@/auth/useAuth"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export function LoginPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const { login, isAuthenticated } = useAuth()

    // Configura el formulario y conecta sus campos con el schema de Zod.
    const {
        register,
        handleSubmit: handleFormSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            correo: "",
            password: "",
        },
    });

    // Envía las credenciales al contexto de autenticación
    // y muestra el resultado del inicio de sesión.
    async function onSubmit(formData) {
        try {
            const user = await login({
                correo: formData.correo.trim(),
                password: formData.password,
            });

            toast.success(`Bienvenido, ${user.nombre || user.correo}.`);

            // Devuelve al usuario a la página que intentó visitar antes de iniciar sesión.
            const previousRoute = location.state?.from?.pathname;
            navigate(previousRoute || "/", { replace: true });
        // Informa mediante toast si el API rechaza las credenciales.
        } catch (error) {
            toast.error(error.message);
        }
    }

    if (isAuthenticated) {
        return (
            <section className="mx-auto max-w-md">
                <Card>
                    <CardHeader>
                        <CardTitle>Sesión activa</CardTitle>
                        <CardDescription>
                            Ya existe un usuario autenticado en la aplicación.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            type="button"
                            className="w-full"
                            onClick={() => navigate("/")}
                        >
                            Ir al inicio
                        </Button>
                    </CardContent>
                </Card>
            </section>
        );
    }

    return (
        <section className="mx-auto max-w-md py-8">
            <Card className="shadow-lg">
                <CardHeader className="space-y-2 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <LogIn className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">
                        Iniciar sesión
                    </CardTitle>
                    <CardDescription>
                        Ingrese sus credenciales para acceder al sistema.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-5" noValidate>
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
                                    autoComplete="email"
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
                            <label htmlFor="password" className="text-sm font-medium">
                                Contraseña
                            </label>
                            <div className="relative">
                                <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Ingrese su contraseña"
                                    autoComplete="current-password"
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
                            <LogIn className="mr-2 h-4 w-4" />
                            {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
                        </Button>

                        <p className="text-center text-sm text-muted-foreground">
                            ¿No tiene una cuenta?{" "}
                            <Link
                                to="/registro"
                                className="font-medium text-primary hover:underline"
                            >
                                Registrarse
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </section>
    );
}