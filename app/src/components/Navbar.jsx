import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export function Navbar() {
    return (
        <header className="w-full bg-[#F5AFAF] py-0.75">
            <nav className="flex min-h-22.5 items-center justify-between px-8">
                <img src={logo} alt="Rose Glow" className="w-45 h-auto"/>

                <div className="flex items-center gap-8">
                    <Link to="/" className="text-black hover:text-white transition-colors">
                        Inicio
                    </Link>
                    <Link to="/servicios" className="text-black hover:text-white transition-colors">
                        Servicios
                    </Link>
                    <Link to="/login" className="text-black hover:text-white transition-colors">
                        Ingresar
                    </Link>
                </div>
            </nav>
        </header>
    );
}