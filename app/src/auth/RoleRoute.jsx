import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";

// Verifica que el usuario tenga uno de los roles permitidos para la página.
export function RoleRoute({ children, allowedRoles }) {
    const { loading, user, isAuthenticated } = useAuth();

    if (loading) {
        return (
            <p className="text-center text-muted-foreground">
                Verificando permisos...
            </p>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Obtiene el nombre del rol enviado por el API.
    const userRole = user?.rol?.nombre;

    // Impide el acceso cuando el rol no tiene permiso para esta funcionalidad.
    if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}

RoleRoute.propTypes = {
    children: PropTypes.node.isRequired,
    allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};