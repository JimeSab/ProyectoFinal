import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { PageHeader } from "@/components/PageHeader";
import { Alert } from "@/components/ui/alert";
import { ServiceForm } from "@/components/ServiceForm";

import { createService } from "@/services/servicesService";
import { getSpecialties } from "@/services/specialtiesService";

export function ServicesCreatePage() {
    const navigate = useNavigate();
    const [specialties, setSpecialties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Consulta las especialidades activas que se pueden asociar al nuevo servicio.
    useEffect(() => {
        async function loadFormData() {
            try {
                setLoading(true);
                const specialtiesData = await getSpecialties();
                setSpecialties(specialtiesData.data);
            } catch {
                setError("No se pudieron cargar las especialidades.");
            } finally {
                setLoading(false);
            }
        }

        loadFormData();
    }, []);

    // Envía el nuevo servicio al API y vuelve al listado después de guardarlo.
    async function handleCreateService(formData) {
        try {
            const newService = await createService(formData);
            navigate("/servicios");
            console.log("Servicio creado:", newService);
        } catch (error) {
            console.error("Error al crear el servicio", error);
            setError(error.message);
        }
    }

    if (loading) {
        return <p className="text-muted-foreground">Cargando datos del formulario...</p>;
    }

    return (
        <section className="space-y-6">
            <PageHeader
                title="Crear servicio"
                description="Complete la información del servicio y guárdela en la API."
            />

            {error && <Alert variant="destructive">{error}</Alert>}

            <ServiceForm
                onSubmit={handleCreateService}
                specialties={specialties}
            />
        </section>
    );
}
