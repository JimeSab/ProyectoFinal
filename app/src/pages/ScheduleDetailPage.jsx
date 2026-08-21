import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { PageHeader } from "@/components/PageHeader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { getScheduleById } from "@/services/schedulesService";

function formatTime(value) {
    if (!value) {
        return "No disponible";
    }

    return String(value).slice(0, 5);
}

export function ScheduleDetailPage() {
    const { id } = useParams();

    const [schedule, setSchedule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadSchedule() {
            try {
                setLoading(true);
                setError("");

                const response = await getScheduleById(id);
                setSchedule(response.data);
            } catch (requestError) {
                setError(requestError.message);
            } finally {
                setLoading(false);
            }
        }

        loadSchedule();
    }, [id]);

    if (loading) {
        return (
            <p className="text-muted-foreground">
                Cargando detalle del horario...
            </p>
        );
    }

    if (error || !schedule) {
        return (
            <section className="space-y-4">
                <Alert variant="destructive">
                    <AlertDescription>
                        {error || "El horario no existe."}
                    </AlertDescription>
                </Alert>

                <Button asChild variant="outline">
                    <Link to="/horarios">
                        Volver a horarios
                    </Link>
                </Button>
            </section>
        );
    }

    return (
        <section className="space-y-6">
            <Button asChild variant="outline">
                <Link to="/horarios">
                    Volver a horarios
                </Link>
            </Button>

            <PageHeader
                title="Detalle del horario"
                description="Información del horario general del establecimiento"
            />

            <Card>
                <CardHeader>
                    <CardTitle>
                        {schedule.diaSemana?.nombre ||
                            "Día no disponible"}
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                    {schedule.activo ? (
                        <>
                            <p>
                                <strong>Hora de inicio:</strong>{" "}
                                {formatTime(schedule.horaInicio)}
                            </p>

                            <p>
                                <strong>Hora de fin:</strong>{" "}
                                {formatTime(schedule.horaFin)}
                            </p>
                        </>
                    ) : (
                        <p className="font-semibold text-red-600">
                            Cerrado
                        </p>
                    )}

                    <p>
                        <strong>Estado:</strong>{" "}
                        {schedule.activo ? "Activo" : "Cerrado"}
                    </p>
                </CardContent>
            </Card>
        </section>
    );
}