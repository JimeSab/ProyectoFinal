import PropTypes from "prop-types";

import { AppointmentCard } from "./AppointmentCard";

/*
Recorre las citas y muestra una tarjeta por cada una.
*/

export function AppointmentList({ appointments }) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {appointments.map((appointment) => (
                <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                />
            ))}
        </div>
    );
}

AppointmentList.propTypes = {
    appointments: PropTypes.array.isRequired,
};