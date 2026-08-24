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

import { SchedulesPage } from "./pages/SchedulesPage";
import { ScheduleDetailPage } from "./pages/ScheduleDetailPage";

import { AppointmentsPage } from "./pages/AppointmentsPage";
import { AppointmentCreatePage } from "./pages/AppointmentCreatePage";
import { AppointmentDetailPage } from "./pages/AppointmentDetailPage";
import { AppointmentEditPage } from "./pages/AppoinmentEditPage";
import { AppointmentStatusPage } from "./pages/AppointmentStatusPage";
import { AgendaEmployeePage } from "./pages/AgendaEmployeePage";
import { AgendaDailyPage } from "./pages/AgendaDailyPage";

/*Muestra la página 404 cuando el usuario intenta entrar
en una dirección que no está registrada en Routes*/
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
                        element={
                            <ProtectedRoute>
                                <RoleRoute allowedRoles={["Administrador", "Empleado"]}>
                                    <RestrictionsPage />
                                </RoleRoute>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/restricciones/:id"
                        element={
                            <ProtectedRoute>
                                <RoleRoute allowedRoles={["Administrador", "Empleado"]}>
                                    <RestrictionDetailPage />
                                </RoleRoute>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/horarios"
                        element={<SchedulesPage />}
                    />

                    <Route
                        path="/horarios/:id"
                        element={<ScheduleDetailPage />}
                    />

                    {/* Empleados */}
                    <Route
                        path="/empleados"
                        element={
                            <ProtectedRoute>
                                <RoleRoute allowedRoles={["Administrador", "Empleado"]}>
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
                                <RoleRoute allowedRoles={["Administrador", "Empleado"]}>
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

{/* Citas */}
<Route
    path="/citas"
    element={
        <ProtectedRoute>
            <RoleRoute
                allowedRoles={[
                    "Administrador",
                    "Empleado",
                    "Cliente",
                ]}
            >
                <AppointmentsPage />
            </RoleRoute>
        </ProtectedRoute>
    }
/>

<Route
    path="/citas/nueva"
    element={
        <ProtectedRoute>
            <RoleRoute
                allowedRoles={[
                    "Administrador",
                    "Empleado",
                ]}
            >
                <AppointmentCreatePage />
            </RoleRoute>
        </ProtectedRoute>
    }
/>

<Route
    path="/citas/:id"
    element={
        <ProtectedRoute>
            <RoleRoute
                allowedRoles={[
                    "Administrador",
                    "Empleado",
                    "Cliente",
                ]}
            >
                <AppointmentDetailPage />
            </RoleRoute>
        </ProtectedRoute>
    }
/>

<Route
    path="/citas/:id/editar"
    element={
        <ProtectedRoute>
            <RoleRoute
                allowedRoles={[
                    "Administrador",
                    "Empleado",
                ]}
            >
                <AppointmentEditPage />
            </RoleRoute>
        </ProtectedRoute>
    }
/>

<Route
    path="/citas/:id/estado"
    element={
        <ProtectedRoute>
            <RoleRoute
                allowedRoles={[
                    "Administrador",
                    "Empleado",
                ]}
            >
                <AppointmentStatusPage />
            </RoleRoute>
        </ProtectedRoute>
    }
/>

<Route
    path="/mi-agenda"
    element={
        <ProtectedRoute>
            <RoleRoute
                allowedRoles={["Empleado"]}
            >
                <AgendaEmployeePage />
            </RoleRoute>
        </ProtectedRoute>
    }
/>

<Route
    path="/agenda-diaria"
    element={
        <ProtectedRoute>
            <RoleRoute
                allowedRoles={[
                    "Administrador",
                ]}
            >
                <AgendaDailyPage />
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