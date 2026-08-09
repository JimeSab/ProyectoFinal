import { Link } from "react-router-dom";

export function NotFoundPage() {
    return (
        <section className="text-center space-y-4">
            <h1 className="text-4xl font-bold">404</h1>
            <p>Página no encontrada</p>
            <Link to="/" className="text-[#D97777] underline">
                Volver al inicio
            </Link>
        </section>
    );
}