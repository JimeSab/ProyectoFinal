import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { PageHeader } from "@/components/PageHeader";
import { Alert } from "@/components/ui/alert";
import { ServiceForm } from "@/components/ServiceForm";

import {
    getServiceById,
    updateService,
} from "@/services/servicesService";
import { getSpecialties } from "@/services/specialtiesService";

export function ServicesEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [service, setService] = useState(null);
    const [specialties, setSpecialties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Carga el servicio seleccionado y las especialidades disponibles para editarlo.
    useEffect(() => {
        async function loadEditData() {
            try {
                setLoading(true);

                const [serviceData, specialtiesData] = await Promise.all([
                    getServiceById(id),
                    getSpecialties(),
                ]);

                if (!serviceData) {
                    setError("El servicio solicitado no existe.");
                    return;
                }

                setService(serviceData.data);
                setSpecialties(specialtiesData.data);
            } catch {
                setError("No se pudieron cargar los datos para editar el servicio.");
            } finally {
                setLoading(false);
            }
        }

        loadEditData();
    }, [id]);

    // Actualiza el servicio y conserva el identificador utilizado en la ruta.
    async function handleUpdateService(formData) {
        try {
            const updatedService = await updateService(id, formData);
            navigate("/servicios");
            console.log("Servicio actualizado:", updatedService);
        } catch (error) {
            console.error("Error al actualizar el servicio", error);
            setError(error.message);
        }
    }

    if (loading) {
        return <p className="text-muted-foreground">Cargando datos del servicio...</p>;
    }

    if (error) {
        return <Alert variant="destructive">{error}</Alert>;
    }

    return (
        <section className="space-y-6">
            <PageHeader
                title="Editar servicio"
                description="Modifique la información del servicio seleccionado."
            />

            <ServiceForm
                onSubmit={handleUpdateService}
                specialties={specialties}
                initialData={service}
                submitText="Actualizar servicio"
            />
        </section>
    );
}
