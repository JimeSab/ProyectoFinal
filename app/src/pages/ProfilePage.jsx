import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserRound, Mail, Phone, BadgeCheck, LogOut } from "lucide-react";

import { useAuth } from "@/auth/useAuth";
import { getProfile } from "@/services/authService";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";

export function ProfilePage() {
    const navigate = useNavigate();
    const { token, logout, user: sessionUser } = useAuth();

    const [profile, setProfile] = useState(sessionUser);
    const [loading, setLoading] = useState(!sessionUser);
    const [error, setError] = useState("");

    useEffect(() => {
        // Carga la información real del usuario autenticado desde el API.
        async function loadProfile() {
            try {
                // Utiliza los datos del contexto para evitar una consulta innecesaria.
                if (sessionUser) {
                    setProfile(sessionUser);
                    return;
                }

                if (!token) {
                    setError("No hay una sesión activa.");
                    return;
                }

                setLoading(true);
                // Si el contexto no tiene el perfil, lo consulta usando el token guardado.
                const response = await getProfile(token);
                setProfile(response.data ?? response);
            } catch {
                setError("No se pudo cargar el perfil del usuario.");
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
    }, [token, sessionUser]);

    // Cierra la sesión y devuelve al usuario a la página principal.
    function handleLogout() {
        logout();
        navigate("/", { replace: true });
    }

    if (loading) {
        return <p className="text-muted-foreground">Cargando perfil...</p>;
    }

    if (error) {
        return <Alert variant="destructive">{error}</Alert>;
    }

    if (!profile) {
        return <Alert variant="destructive">No se encontró el perfil.</Alert>;
    }

    return (
        <section className="mx-auto max-w-2xl py-8">
            <Card className="shadow-lg">
                <CardHeader className="space-y-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <UserRound className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">
                        Mi perfil
                    </CardTitle>
                    <CardDescription>
                        Información del usuario autenticado.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="rounded-lg border p-4">
                        <p className="flex items-center gap-2 font-medium">
                            <UserRound className="h-4 w-4 text-primary" />
                            {profile.nombre} {profile.primerApellido}{" "}
                            {profile.segundoApellido || ""}
                        </p>
                    </div>

                    <div className="rounded-lg border p-4">
                        <p className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-primary" />
                            {profile.correo}
                        </p>
                    </div>

                    <div className="rounded-lg border p-4">
                        <p className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-primary" />
                            {profile.telefono || "Sin teléfono"}
                        </p>
                    </div>

                    <div className="rounded-lg border p-4">
                        <p className="flex items-center gap-2">
                            <BadgeCheck className="h-4 w-4 text-primary" />
                            Rol: {profile.rol?.nombre || "Sin rol"}
                        </p>
                    </div>

                    <Button
                        type="button"
                        variant="destructive"
                        className="w-full"
                        onClick={handleLogout}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Cerrar sesión
                    </Button>
                </CardContent>
            </Card>
        </section>
    );
}