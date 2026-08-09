const CR_OFFSET = "-06:00";

/**
 * Convierte una hora (string "HH:mm"/"HH:mm:ss" o un Date) a un Date en UTC
 * correcto, asumiendo que la hora representa hora local de Costa Rica.
 */
export function horaCRaUTC(hora: string | Date, fechaBase = "1970-01-01"): Date {
    let horaCompleta: string;

    if (hora instanceof Date) {
        // Se asume que el Date fue parseado como UTC por el validador/DTO
        const horas = String(hora.getUTCHours()).padStart(2, "0");
        const minutos = String(hora.getUTCMinutes()).padStart(2, "0");
        const segundos = String(hora.getUTCSeconds()).padStart(2, "0");
        horaCompleta = `${horas}:${minutos}:${segundos}`;
    } else {
        horaCompleta = hora.length === 5 ? `${hora}:00` : hora;
    }

    const isoConOffset = `${fechaBase}T${horaCompleta}${CR_OFFSET}`;
    return new Date(isoConOffset);
}

export function utcAHoraCR(fecha: Date): string {
    return new Intl.DateTimeFormat("es-CR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "America/Costa_Rica",
    }).format(fecha);
}