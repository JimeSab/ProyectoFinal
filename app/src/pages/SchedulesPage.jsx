import { useEffect, useState } from "react";

import { PageHeader } from "@/components/PageHeader";
import { ScheduleCard } from "@/components/ScheduleCard";
import {
    Alert,
    AlertDescription,
} from "@/components/ui/alert";

import { getSchedules } from "@/services/schedulesService";

export function SchedulesPage() {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Consulta directamente al API el horario general del establecimiento.
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
                    <AlertDescription>
                        {error}
                    </AlertDescription>
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
                        <ScheduleCard
                            key={schedule.id}
                            schedule={schedule}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
