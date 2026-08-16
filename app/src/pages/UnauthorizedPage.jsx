import { Link } from "react-router-dom";

export function UnauthorizedPage() {
    return (
        <section className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Acceso denegado</h1>
            <p>No tiene permisos para entrar a esta página.</p>
            <Link to="/" className="text-[#D97777] underline">
                Volver al inicio
            </Link>
        </section>
    );
}