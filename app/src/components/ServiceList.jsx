import PropTypes from "prop-types";
import { ServiceCard } from "./ServiceCard";

export function ServiceList({ services, onRequestStatusChange, changingId }) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
                <ServiceCard
                key={service.id}
                service={service}
                onRequestStatusChange={onRequestStatusChange}
                changingStatus={changingId === service.id}
                />
            ))}
        </div>
    );
}

ServiceList.propTypes = {
    services: PropTypes.array.isRequired,
    onRequestStatusChange: PropTypes.func.isRequired,
    changingId: PropTypes.number,
};