import { useEffect, useMemo, useState } from "react";

import { PageHeader } from "@/components/PageHeader";
import { RestrictionCard } from "@/components/RestrictionCard";
import {
    Alert,
    AlertDescription,
} from "@/components/ui/alert";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    getRestrictions,
} from "@/services/restrictionsService";

export function RestrictionsPage() {
    // Guarda las restricciones obtenidas del API.
    const [restrictions, setRestrictions] = useState([]);

    // Controla la carga y los errores.
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // desc muestra recientes y asc muestra antiguas.
    const [sortOrder, setSortOrder] = useState("desc");

    // Consulta las restricciones cuando carga la página.
    useEffect(() => {
        async function loadRestrictions() {
            try {
                setLoading(true);
                setError("");

                const response = await getRestrictions();

                setRestrictions(
                    response.data || response || []
                );
            } catch (requestError) {
                setError(requestError.message);
            } finally {
                setLoading(false);
            }
        }

        loadRestrictions();
    }, []);

   // Ordena las restricciones según la fecha seleccionada.
const sortedRestrictions = useMemo(() => {
    return [...restrictions].sort((first, second) => {
        const firstDate = new Date(first.fecha).getTime();
        const secondDate = new Date(second.fecha).getTime();

        if (sortOrder === "asc") {
            return firstDate - secondDate;
        }

        return secondDate - firstDate;
    });
}, [restrictions, sortOrder]); 
    return (
        <section className="space-y-6">
            <PageHeader
                title="Restricciones de horario"
                description="Consulte los horarios bloqueados del establecimiento y sus empleados"
            />

            {/* Permite escoger el orden de las fechas. */}
            <div className="max-w-xs space-y-2">
                <label className="text-sm font-medium">
                    Ordenar por fecha
                </label>

                <Select
                    value={sortOrder}
                    onValueChange={setSortOrder}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="desc">
                            Más antiguas primero
                        </SelectItem>

                        <SelectItem value="asc">
                            Más recientes primero
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Muestra el estado de carga. */}
            {loading && (
                <p className="text-muted-foreground">
                    Cargando restricciones...
                </p>
            )}

            {/* Muestra el error recibido. */}
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>
                        {error}
                    </AlertDescription>
                </Alert>
            )}

            {/* Se muestra cuando no existen restricciones. */}
            {!loading &&
                !error &&
                sortedRestrictions.length === 0 && (
                    <p className="text-muted-foreground">
                        No hay restricciones de horario registradas.
                    </p>
                )}

            {/* Crea una tarjeta por cada restricción. */}
            {!loading &&
                !error &&
                sortedRestrictions.length > 0 && (
                    <div className="grid gap-4 md:grid-cols-2">
                        {sortedRestrictions.map(
                            (restriction) => (
                                <RestrictionCard
                                    key={restriction.id}
                                    restriction={restriction}
                                />
                            )
                        )}
                    </div>
                )}
        </section>
    );
}