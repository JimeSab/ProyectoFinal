import { Routes, Route } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./pages/HomePage";
import { ServicesPage } from "./pages/ServicesPage";
import { ServiceDetailPage } from "./pages/ServiceDetailPage";
import { ServicesCreatePage } from "./pages/ServicesCreatePage";
import { ServicesEditPage } from "./pages/ServicesEditPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ProfilePage } from "./pages/ProfilePage";

function NotFoundPage() {
    return (
        <section>
            <h1 className="text-3xl font-bold">404</h1>
            <p>Página no encontrada</p>
        </section>
    );
}

export default function App() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Navbar />
            <main className="flex-1 max-w-5xl mx-auto p-4 w-full">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/registro" element={<RegisterPage />} />
                    <Route path="/perfil" element={<ProfilePage />} />
                    <Route path="/servicios" element={<ServicesPage />} />
                    <Route path="/servicios/nuevo" element={<ServicesCreatePage />} />
                    <Route path="/servicios/:id" element={<ServiceDetailPage />} />
                    <Route path="/servicios/:id/editar" element={<ServicesEditPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}