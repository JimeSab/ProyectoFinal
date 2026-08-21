import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { PageHeader } from "@/components/PageHeader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { getSchedules } from "@/services/schedulesService";

function formatTime(value) {
    if (!value) {
        return "No disponible";
    }

    return String(value).slice(0, 5);
}

export function SchedulesPage() {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadSchedules() {
            try {
                setLoading(true);
                setError("");

                const response = await getSchedules();
                setSchedules(response.data || []);
            } catch (requestError) {
                setError(requestError.message);
            } finally {
                setLoading(false);
            }
        }

        loadSchedules();
    }, []);

    if (loading) {
        return (
            <p className="text-muted-foreground">
                Cargando horarios...
            </p>
        );
    }

    return (
        <section className="space-y-6">
            <PageHeader
                title="Horarios de atención"
                description="Horario general de atención del establecimiento"
            />

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {!error && schedules.length === 0 && (
                <p className="rounded-lg border border-dashed p-8 text-center">
                    No hay horarios registrados.
                </p>
            )}

            {!error && schedules.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {schedules.map((schedule) => (
                        <Card key={schedule.id}>
                            <CardHeader>
                                <CardTitle>
                                    {schedule.diaSemana?.nombre ||
                                        "Día no disponible"}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-2">
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

                            <CardFooter>
                                <Button
                                    asChild
                                    variant="ghost"
                                    className="w-full group/btn bg-[#F9DFDF] hover:bg-[#F9DFDF] transition-all duration-300"
                                >
                                    <Link
                                        to={`/horarios/${schedule.id}`}
                                        className="flex w-full items-center justify-center gap-2"
                                    >
                                        <span className="font-semibold">
                                            Ver detalles
                                        </span>

                                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </section>
    );
}