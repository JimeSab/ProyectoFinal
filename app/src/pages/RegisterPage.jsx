import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Mail, LockKeyhole, User, Phone } from "lucide-react";
import toast from "react-hot-toast";

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

    const [formData, setFormData] = useState({
        nombre: "",
        primerApellido: "",
        segundoApellido: "",
        correo: "",
        telefono: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (
            !formData.nombre.trim() ||
            !formData.primerApellido.trim() ||
            !formData.correo.trim() ||
            !formData.password.trim()
        ) {
            toast.error("Debe completar los campos obligatorios.");
            return;
        }

        try {
            setLoading(true);

            await registerUser({
                nombre: formData.nombre.trim(),
                primerApellido: formData.primerApellido.trim(),
                segundoApellido: formData.segundoApellido.trim() || null,
                correo: formData.correo.trim(),
                telefono: formData.telefono.trim() || null,
                password: formData.password,
            });

            toast.success("Cliente registrado correctamente.");
            navigate("/login");
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
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
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="nombre" className="text-sm font-medium">
                                Nombre
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="nombre"
                                    name="nombre"
                                    type="text"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    placeholder="María"
                                    className="pl-9"
                                    disabled={loading}
                                    required
                                />
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
                                    name="primerApellido"
                                    type="text"
                                    value={formData.primerApellido}
                                    onChange={handleChange}
                                    placeholder="López"
                                    className="pl-9"
                                    disabled={loading}
                                    required
                                />
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
                                    name="segundoApellido"
                                    type="text"
                                    value={formData.segundoApellido}
                                    onChange={handleChange}
                                    placeholder="Mora"
                                    className="pl-9"
                                    disabled={loading}
                                />
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
                                    name="correo"
                                    type="email"
                                    value={formData.correo}
                                    onChange={handleChange}
                                    placeholder="usuario@email.com"
                                    className="pl-9"
                                    disabled={loading}
                                    required
                                />
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
                                    name="telefono"
                                    type="text"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    placeholder="8888-8888"
                                    className="pl-9"
                                    disabled={loading}
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
                                    placeholder="Cliente123"
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
                            <UserPlus className="mr-2 h-4 w-4" />
                            {loading ? "Registrando..." : "Registrarse"}
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