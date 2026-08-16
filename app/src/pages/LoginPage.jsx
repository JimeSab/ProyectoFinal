import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { LogIn, Mail, LockKeyhole } from "lucide-react"
import toast from "react-hot-toast"

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

    const [formData, setFormData] = useState({
        correo: "",
        password: ""
    })

    const [loading, setLoading] = useState(false)

    function handleChange(service) {
        const { name, value } = service.target
        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }))
    }

    async function handleSubmit(service) {
        service.preventDefault()
        if (!formData.correo.trim() || !formData.password.trim()) {
            toast.error("Debe completar todos los campos.")
            return
        }
        try {
            setLoading(true)

            const user = await login({
                correo: formData.correo.trim(),
                password: formData.password
            })

            toast.success(`Bienvenido, ${user.fullName}.`)

            const previousRoute = location.state?.from?.pathname;
            navigate(previousRoute || "/", { replace: true });
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
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
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="correo" className="text-sm font-medium">
                                Correo electrónico
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="correo"
                                    name="correo"
                                    type="email"
                                    value={formData.correo}
                                    onChange={handleChange}
                                    placeholder="usuario@email.com"
                                    autoComplete="email"
                                    className="pl-9"
                                    disabled={loading}
                                    required
                                />
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
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Ingrese su contraseña"
                                    autoComplete="current-password"
                                    className="pl-9"
                                    disabled={loading}
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            <LogIn className="mr-2 h-4 w-4" />
                            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
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