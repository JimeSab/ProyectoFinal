import { useEffect, useMemo, useState } from "react";

import { PageHeader } from "@/components/PageHeader";
import { RestrictionCard } from "@/components/RestrictionCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getRestrictions } from "@/services/restrictionsService";

export function RestrictionsPage() {
    /*
    Guarda las restricciones obtenidas desde el API usando useState
    para poder mostrarlas posteriormente en el listado.
    */
    const [restrictions, setRestrictions] = useState([]);

    /*
    Controla con useState si la solicitud todavía está cargando
    para mostrar un mensaje mientras el API responde.
    */
    const [loading, setLoading] = useState(true);

    /*
    Guarda un mensaje de error para mostrarlo en la interfaz
    si las restricciones no se pueden consultar.
    */
    const [error, setError] = useState("");

    /*
    Guarda el orden seleccionado por el usuario para presentar
    primero las restricciones recientes o las antiguas.
    */
    const [sortOrder, setSortOrder] = useState("desc");

    /*
    Utiliza useEffect para ejecutar loadRestrictions una sola vez
    cuando la página se muestra por primera vez.
    */
    useEffect(() => {
        async function loadRestrictions() {
            try {
                // Activa el indicador de carga y elimina errores anteriores.
                setLoading(true);
                setError("");

                /*
                Consulta el API mediante getRestrictions y guarda
                el arreglo recibido dentro del estado restrictions.
                */
                const response = await getRestrictions();
                setRestrictions(response.data || []);
            } catch (requestError) {
                /*
                Guarda el mensaje producido por el servicio para que
                el usuario conozca el problema ocurrido.
                */
                setError(requestError.message);
            } finally {
                /*
                Desactiva loading cuando la solicitud termina,
                sin importar si fue correcta o produjo un error.
                */
                setLoading(false);
            }
        }

        loadRestrictions();
    }, []);

    /*
    Utiliza useMemo para ordenar una copia de las restricciones sin
    modificar directamente el arreglo original guardado en el estado.
    */
    const sortedRestrictions = useMemo(() => {
        return [...restrictions].sort((first, second) => {
            const comparison = first.fecha.localeCompare(second.fecha);

            return sortOrder === "asc"
                ? comparison
                : -comparison;
        });
    }, [restrictions, sortOrder]);

    return (
        <section className="space-y-6">
            {/*
            Utiliza PageHeader para mantener un encabezado consistente
            con las demás páginas del proyecto.
            */}
            <PageHeader
                title="Restricciones de horario"
                description="Consulte los horarios bloqueados del establecimiento y sus empleados"
            />

            {/*
            Utiliza Select de shadcn para cambiar el orden de las
            restricciones según su fecha.
            */}
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
                            Más recientes primero
                        </SelectItem>

                        <SelectItem value="asc">
                            Más antiguas primero
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/*
            Muestra este texto mientras loading sea verdadero
            para informar que la consulta todavía se está realizando.
            */}
            {loading && (
                <p className="text-muted-foreground">
                    Cargando restricciones...
                </p>
            )}

            {/*
            Utiliza Alert para presentar claramente cualquier
            mensaje de error recibido durante la consulta.
            */}
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/*
            Muestra un mensaje vacío solamente cuando terminó la carga,
            no ocurrió un error y el API no devolvió restricciones.
            */}
            {!loading &&
                !error &&
                sortedRestrictions.length === 0 && (
                    <p className="text-muted-foreground">
                        No hay restricciones de horario registradas.
                    </p>
                )}

            {/*
            Utiliza map para recorrer las restricciones ordenadas
            y crear una RestrictionCard reutilizable por cada registro.
            */}
            {!loading &&
                !error &&
                sortedRestrictions.length > 0 && (
                    <div className="grid gap-4 md:grid-cols-2">
                        {sortedRestrictions.map((restriction) => (
                            <RestrictionCard
                                key={restriction.id}
                                restriction={restriction}
                            />
                        ))}
                    </div>
                )}
        </section>
    );
}