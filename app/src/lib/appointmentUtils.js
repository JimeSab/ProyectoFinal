/*
Suma la duración a la hora inicial para obtener la hora final.
*/
export function calculateEndTime(startTime, durationMinutes) {
    if (!startTime || !durationMinutes) {
        return "";
    }

    const [hours, minutes] = startTime.split(":").map(Number);

    const totalMinutes =
        (hours * 60) +
        minutes +
        Number(durationMinutes);

    if (totalMinutes >= 24 * 60) {
        return "";
    }

    const endHours = String(
        Math.floor(totalMinutes / 60)
    ).padStart(2, "0");

    const endMinutes = String(
        totalMinutes % 60
    ).padStart(2, "0");

    return `${endHours}:${endMinutes}`;
}

/*
Obtiene la fecha actual en formato YYYY-MM-DD.
*/
export function getLocalToday() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(
        today.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
        today.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

/*
Convierte la fecha de la cita a un formato fácil de leer.
*/
export function formatAppointmentDate(date) {
    if (!date) {
        return "";
    }

    const dateValue = String(date).slice(0, 10);

    return new Date(
        `${dateValue}T00:00:00`
    ).toLocaleDateString("es-CR");
}

/*Muestra la hora recibida del API utilizando el formato HH:mm. */

export function formatAppointmentTime(time) {
    if (!time) {
        return "No disponible";
    }

    if (time.includes("T")) {
        return time.slice(11, 16);
    }

    return time.slice(0, 5);
}