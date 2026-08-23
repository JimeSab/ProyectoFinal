import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

// Muestra la hora sin la fecha que puede acompañar a un valor DateTime.
function formatTime(value) {
    if (!value) {
        return "No disponible";
    }

    return String(value).slice(0, 5);
}

// Presenta un día del horario y permite consultar su detalle.
export function ScheduleCard({ schedule }) {
    return (
        <Card>
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
                    className="w-full group/btn bg-[#F9DFDF] text-black hover:bg-[#F9DFDF] hover:text-black transition-all duration-300"
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
    );
}

ScheduleCard.propTypes = {
    schedule: PropTypes.shape({
        id: PropTypes.number.isRequired,
        horaInicio: PropTypes.string,
        horaFin: PropTypes.string,
        activo: PropTypes.bool.isRequired,
        diaSemana: PropTypes.shape({
            nombre: PropTypes.string,
        }),
    }).isRequired,
};
