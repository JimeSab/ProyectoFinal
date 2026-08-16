import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, UserRound } from "lucide-react";

import { useAuth } from "@/auth/useAuth";
import { Button } from "@/components/ui/button";
import logo from "../assets/logo.png";

export function Navbar() {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();

    const isAdmin = user?.rol?.nombre === "Administrador";

    function handleLogout() {
        logout();
        navigate("/", { replace: true });
    }

    return (
        <header className="w-full bg-[#F5AFAF] py-0.75">
            <nav className="flex min-h-22.5 items-center justify-between px-8">
                <img src={logo} alt="Rose Glow" className="w-45 h-auto" />

                <div className="flex items-center gap-8">
                    <Link to="/" className="text-black hover:text-white transition-colors">
                        Inicio
                    </Link>

                    <Link to="/servicios" className="text-black hover:text-white transition-colors">
                        Servicios
                    </Link>

                    <Link to="/adicionales" className="text-black hover:text-white transition-colors">
                        Adicionales
                    </Link>

                    {isAuthenticated && isAdmin && (
                        <Link to="/empleados" className="text-black hover:text-white transition-colors">
                            Empleados
                        </Link>
                    )}

                    {!isAuthenticated ? (
                        <Link to="/login" className="text-black hover:text-white transition-colors">
                            Ingresar
                        </Link>
                    ) : (
                        <>
                            <NavLink to="/perfil" className="text-black hover:text-white transition-colors flex items-center gap-1">
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