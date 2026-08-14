import { Routes, Route } from "react-router-dom";

import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { RoleRoute } from "./auth/RoleRoute";

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

import { RestrictionsPage } from "./pages/RestrictionsPage";
import { RestrictionDetailPage } from "./pages/RestrictionDetailPage";

import { EmployeesPage } from "./pages/EmployeesPage";
import { EmployeeCreatePage } from "./pages/EmployeeCreatePage";
import { EmployeeEditPage } from "./pages/EmployeeEditPage";
import { EmployeeDetailPage } from "./pages/EmployeeDetailPage";

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
                    {/* Páginas generales */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/registro" element={<RegisterPage />} />

                    <Route
                        path="/perfil"
                        element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/unauthorized"
                        element={<UnauthorizedPage />}
                    />

                    {/* Servicios */}
                    <Route
                        path="/servicios"
                        element={<ServicesPage />}
                    />

                    <Route
                        path="/servicios/nuevo"
                        element={
                            <ProtectedRoute>
                                <RoleRoute allowedRoles={["Administrador"]}>
                                    <ServicesCreatePage />
                                </RoleRoute>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/servicios/:id"
                        element={<ServiceDetailPage />}
                    />

                    <Route
                        path="/servicios/:id/editar"
                        element={
                            <ProtectedRoute>
                                <RoleRoute allowedRoles={["Administrador"]}>
                                    <ServicesEditPage />
                                </RoleRoute>
                            </ProtectedRoute>
                        }
                    />

                    {/* Adicionales */}
                    <Route
                        path="/adicionales"
                        element={<AdditionalsPage />}
                    />

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

                    <Route
                        path="/adicionales/:id"
                        element={<AdditionalDetailPage />}
                    />

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

                    {/* Restricciones de horario */}
                    <Route
                        path="/restricciones"
                        element={<RestrictionsPage />}
                    />

                    <Route
                        path="/restricciones/:id"
                        element={<RestrictionDetailPage />}
                    />

                    {/* Empleados */}
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