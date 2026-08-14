import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { PageHeader } from "@/components/PageHeader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { getRestrictionById } from "@/services/restrictionsService";

/*
Convierte la fecha enviada por el API al formato día/mes/año
para que pueda comprenderse fácilmente en la interfaz.
*/
function formatDate(date) {
    const [year, month, day] = date.split("T")[0].split("-");
    return `${day}/${month}/${year}`;
}

/*
Extrae las horas y los minutos para evitar mostrar segundos
y otra información técnica enviada por el API.
*/
function formatTime(time) {
    if (!time) {
        return "";
    }

    const timePart = time.includes("T")
        ? time.split("T")[1]
        : time;

    return timePart.slice(0, 5);
}

/*
Esta función exporta la página para que App.jsx pueda utilizarla
en la ruta /restricciones/:id.
*/
export function RestrictionDetailPage() {
    /*
    Obtiene el ID de la restricción desde la dirección del navegador.
    */
    const { id } = useParams();

    /*
    Guarda la restricción, el estado de carga y los posibles errores.
    */
    const [restriction, setRestriction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /*
    Consulta el detalle mediante el ID y guarda los datos recibidos
    para mostrarlos dentro de la tarjeta.
    */
    useEffect(() => {
        async function loadRestriction() {
            try {
                setLoading(true);
                setError("");

                const response = await getRestrictionById(id);
                setRestriction(response.data);
            } catch (requestError) {
                setError(requestError.message);
            } finally {
                setLoading(false);
            }
        }

        loadRestriction();
    }, [id]);

    if (loading) {
        return <p>Cargando detalle de la restricción...</p>;
    }

    if (error) {
        return (
            <section className="space-y-4">
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>

                <Button asChild variant="outline">
                    <Link to="/restricciones">
                        <ArrowLeft />
                        Volver
                    </Link>
                </Button>
            </section>
        );
    }

    /*
    Construye el nombre completo si la restricción pertenece
    a un empleado; de lo contrario indica que es general.
    */
    const user = restriction.empleado?.usuario;

    const appliesTo = user
        ? [
            user.nombre,
            user.primerApellido,
            user.segundoApellido,
        ]
            .filter(Boolean)
            .join(" ")
        : "Todo el establecimiento";

    /*
    Muestra “Todo el día” o forma el intervalo de horas restringidas.
    */
    const schedule = restriction.todoElDia
        ? "Todo el día"
        : `${formatTime(restriction.horaInicio)} - ${formatTime(
            restriction.horaFin
        )}`;

    return (
        <section className="space-y-6">
            <PageHeader
                title="Detalle de la restricción"
                description="Información completa del horario restringido"
            />

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>
                        {restriction.tipoRestriccion?.nombre}
                    </CardTitle>

                    <Badge variant="outline">
                        {restriction.activo ? "Activa" : "Inactiva"}
                    </Badge>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div>
                        <p className="font-medium">Aplica a</p>
                        <p className="text-muted-foreground">
                            {appliesTo}
                        </p>
                    </div>

                    <div>
                        <p className="font-medium">Fecha</p>
                        <p className="text-muted-foreground">
                            {formatDate(restriction.fecha)}
                        </p>
                    </div>

                    <div>
                        <p className="font-medium">
                            Horario restringido
                        </p>
                        <p className="text-muted-foreground">
                            {schedule}
                        </p>
                    </div>

                    <div>
                        <p className="font-medium">Motivo</p>
                        <p className="text-muted-foreground">
                            {restriction.motivo}
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Button asChild variant="outline">
                <Link to="/restricciones">
                    <ArrowLeft />
                    Volver al listado
                </Link>
            </Button>
        </section>
    );
}