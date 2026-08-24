import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, UserRound } from "lucide-react";

import { useAuth } from "@/auth/useAuth";
import { Button } from "@/components/ui/button";
import logo from "../assets/logo.png";

export function Navbar() {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();

    const isAdmin = user?.rol?.nombre === "Administrador";

    const isEmployee = user?.rol?.nombre === "Empleado";

    // Cambia el estilo del enlace según la página que está activa.
    const linkClass = ({ isActive }) =>
        isActive
            ? "rounded-full bg-[#D98989] px-3 py-1.5 text-sm font-semibold text-white transition-colors"
            : "rounded-full px-3 py-1.5 text-sm text-black transition-colors hover:bg-[#D98989] hover:text-white";

    // Cierra la sesión y regresa al inicio para evitar volver a una vista protegida.
    function handleLogout() {
        logout();
        navigate("/", { replace: true });
    }

    return (
        <header className="sticky top-0 z-50 w-full bg-[#F5AFAF] py-0.75 shadow-sm">
            <nav className="flex min-h-20 items-center justify-between px-4">
                <Link to="/">
                    <img
                        src={logo}
                        alt="Rose Glow"
                        className="w-36 h-auto"
                    />
                </Link>

                <div className="flex items-center gap-3">
                    <NavLink to="/" className={linkClass}>
                        Inicio
                    </NavLink>

                    <NavLink to="/servicios" className={linkClass}>
                        Servicios
                    </NavLink>

                    <NavLink to="/adicionales" className={linkClass}>
                        Adicionales
                    </NavLink>

                    <NavLink to="/horarios" className={linkClass}>
                        Horarios
                    </NavLink>

                    {isAuthenticated && (
                        <NavLink
                            to="/citas"
                            className={linkClass}
                        >
                            {user?.rol?.nombre === "Cliente"
                                ? "Mis citas"
                                : "Citas"}
                        </NavLink>
                    )}

                    {isAuthenticated && (isAdmin || isEmployee) && (
                        <NavLink
                            to="/restricciones"
                            className={linkClass}
                        >
                            Restricciones
                        </NavLink>
                    )}

                    {isAuthenticated && (isAdmin || isEmployee) && (
                        <NavLink to="/empleados" className={linkClass}>
                            Empleados
                        </NavLink>
                    )}

                    {isAuthenticated && isAdmin && (
                        <NavLink
                            to="/agenda-diaria"
                            className={linkClass}
                        >
                            Agenda diaria
                        </NavLink>
                    )}

                    {isAuthenticated && isEmployee && user?.empleado?.id && (
                        <NavLink
                            to="/mi-agenda"
                            className={linkClass}
                        >
                            Mi agenda
                        </NavLink>
                    )}

                    {!isAuthenticated ? (
                        <NavLink to="/login" className={linkClass}>
                            Ingresar
                        </NavLink>
                    ) : (
                        <>
                            <NavLink to="/perfil" className={linkClass}>
                                <UserRound className="h-4 w-4" />
                                {user?.nombre || "Perfil"}
                            </NavLink>

                            <Button
                                type="button"
                                variant="ghost"
                                onClick={handleLogout}
                                className="text-black hover:text-white hover:bg-transparent p-0"
                            >
                                <LogOut className="mr-1 h-4 w-4" />
                                Salir
                            </Button>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}
