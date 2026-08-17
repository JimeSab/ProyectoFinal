import { Routes, Route } from "react-router-dom";

import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { ProtectedRoute } from "./auth/ProtectedRoute";

import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ProfilePage } from "./pages/ProfilePage";
import { UnauthorizedPage } from "./pages/UnauthorizedPage";

import { ServicesPage } from "./pages/ServicesPage";
import { ServiceDetailPage } from "./pages/ServiceDetailPage";
import { ServicesCreatePage } from "./pages/ServicesCreatePage";
import { ServicesEditPage } from "./pages/ServicesEditPage";

import { AdditionalsPage } from "./pages/AdditionalsPage";
import { AdditionalCreatePage } from "./pages/AdditionalCreatePage";
import { AdditionalDetailPage } from "./pages/AdditionalDetailPage";
import { AdditionalEditPage } from "./pages/AdditionalEditPage";

import { EmployeesPage } from "./pages/EmployeesPage";
import { EmployeeCreatePage } from "./pages/EmployeeCreatePage";
import { EmployeeEditPage } from "./pages/EmployeeEditPage";
import { EmployeeDetailPage } from "./pages/EmployeeDetailPage";

import { RoleRoute } from "./auth/RoleRoute";

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
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/registro" element={<RegisterPage />} />
                    <Route path="/perfil" element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    } />
                    <Route path="/servicios/nuevo" element={
                        <ProtectedRoute>
                            <ServicesCreatePage />
                        </ProtectedRoute>
                    } />
                    <Route path="/servicios/:id/editar" element={
                        <ProtectedRoute>
                            <ServicesEditPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/adicionales/nuevo" element={
                        <ProtectedRoute>
                            <AdditionalCreatePage />
                        </ProtectedRoute>
                    } />
                    <Route path="/adicionales/:id/editar" element={
                        <ProtectedRoute>
                            <AdditionalEditPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/unauthorized" element={<UnauthorizedPage />} />

                    <Route path="/servicios" element={<ServicesPage />} />
                    <Route path="/servicios/nuevo" element={
                        <ProtectedRoute>
                            <RoleRoute allowedRoles={["Administrador"]}>
                                <ServicesCreatePage />
                            </RoleRoute>
                        </ProtectedRoute>} />
                    <Route path="/servicios/:id" element={<ServiceDetailPage />} />
                    <Route path="/servicios/:id/editar" element={
                        <ProtectedRoute>
                            <RoleRoute allowedRoles={["Administrador"]}>
                                <ServicesEditPage />
                            </RoleRoute>
                        </ProtectedRoute>} />

                    <Route path="/adicionales" element={<AdditionalsPage />} />
                    <Route
                        path="/adicionales/nuevo"
                        element={
                            <ProtectedRoute>
                                <RoleRoute allowedRoles={["Administrador"]}>
                                    <AdditionalCreatePage />
                                </RoleRoute>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/adicionales/:id" element={<AdditionalDetailPage />} />
                    <Route
                        path="/adicionales/:id/editar"
                        element={
                            <ProtectedRoute>
                                <RoleRoute allowedRoles={["Administrador"]}>
                                    <AdditionalEditPage />
                                </RoleRoute>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/empleados"
                        element={
                            <ProtectedRoute>
                                <RoleRoute allowedRoles={["Administrador"]}>
                                    <EmployeesPage />
                                </RoleRoute>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/empleados/nuevo"
                        element={
                            <ProtectedRoute>
                                <RoleRoute allowedRoles={["Administrador"]}>
                                    <EmployeeCreatePage />
                                </RoleRoute>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/empleados/:id"
                        element={
                            <ProtectedRoute>
                                <RoleRoute allowedRoles={["Administrador"]}>
                                    <EmployeeDetailPage />
                                </RoleRoute>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/empleados/:id/editar"
                        element={
                            <ProtectedRoute>
                                <RoleRoute allowedRoles={["Administrador"]}>
                                    <EmployeeEditPage />
                                </RoleRoute>
                            </ProtectedRoute>
                        }
                    />

                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}