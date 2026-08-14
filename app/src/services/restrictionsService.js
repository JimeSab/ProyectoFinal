const API_URL = import.meta.env.VITE_API_URL;

/*
Esta función usa fetch para consultar todas las restricciones
registradas en el API y enviarlas a la página del listado.
*/
export async function getRestrictions() {
    try {
        const response = await fetch(
            `${API_URL}/restricciones-horario`
        );

        /*
        Comprueba que el API haya respondido correctamente
        antes de convertir la respuesta a formato JSON.
        */
        if (!response.ok) {
            throw new Error();
        }

        return await response.json();
    } catch {
        /*
        Envía un mensaje comprensible cuando no se logra
        consultar el listado de restricciones.
        */
        throw new Error(
            "No se pudieron obtener las restricciones de horario."
        );
    }
}

/*
Esta función recibe un ID y lo agrega al endpoint usando fetch
para consultar únicamente la restricción seleccionada.
*/
export async function getRestrictionById(id) {
    try {
        const response = await fetch(
            `${API_URL}/restricciones-horario/${id}`
        );

        /*
        Comprueba si el API encontró la restricción solicitada
        antes de utilizar la información recibida.
        */
        if (!response.ok) {
            throw new Error();
        }

        return await response.json();
    } catch {
        /*
        Envía este mensaje cuando la restricción no existe
        o no puede consultarse desde el API.
        */
        throw new Error(
            "No se pudo cargar el detalle de la restricción."
        );
    }
}
