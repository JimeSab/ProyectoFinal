import { Routes, Route } from "react-router-dom";

import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";

import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ProfilePage } from "./pages/ProfilePage";

import { ServicesPage } from "./pages/ServicesPage";
import { ServiceDetailPage } from "./pages/ServiceDetailPage";
import { ServicesCreatePage } from "./pages/ServicesCreatePage";
import { ServicesEditPage } from "./pages/ServicesEditPage";

import { AdditionalsPage } from "./pages/AdditionalsPage";
import { AdditionalCreatePage } from "./pages/AdditionalCreatePage";

import { AdditionalDetailPage } from "./pages/AdditionalDetailPage";
/*
Muestra la página 404 cuando el usuario intenta entrar
en una dirección que no está registrada en Routes.
*/
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
                {/*
                Utiliza Routes y Route de React Router para relacionar
                cada dirección del navegador con su página correspondiente.
                */}
                <Routes>
                    {/* Rutas generales del sistema. */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/registro" element={<RegisterPage />} />
                    <Route path="/perfil" element={<ProfilePage />} />

                    {/* Rutas utilizadas para gestionar los servicios principales. */}
                    <Route
                        path="/servicios"
                        element={<ServicesPage />}
                    />
                    <Route
                        path="/servicios/nuevo"
                        element={<ServicesCreatePage />}
                    />
                    <Route
                        path="/servicios/:id"
                        element={<ServiceDetailPage />}
                    />
                    <Route
                        path="/servicios/:id/editar"
                        element={<ServicesEditPage />}
                    />

                    {/* Muestra el listado de servicios adicionales. */}
                    <Route
                        path="/adicionales"
                        element={<AdditionalsPage />}
                    />

                    {/* Muestra el formulario para crear un servicio adicional. */}
                    <Route
                        path="/adicionales/nuevo"
                        element={<AdditionalCreatePage />}
                    />

                    {/*
                    La ruta con * se coloca al final para mostrar el 404
                    únicamente cuando ninguna ruta anterior coincide.
                    */}
                    <Route path="*" element={<NotFoundPage />} />
{/*Utiliza :id para recibir el identificador del adicional
y mostrar la información del registro seleccionado.
*/}
<Route
    path="/adicionales/:id"
    element={<AdditionalDetailPage />}
/>

                </Routes>
            </main>

            <Footer />
        </div>
    );
}