import hero from "../assets/unas-hero.jpg";

export function HomePage() {
    return (
        <main className="bg-[#FFF9F9]">
            <section className="bg-[#FDECEC] p-10">
                <div className="mx-auto flex max-w-5xl items-center gap-10">
                    <div className="w-1/2">
                        <p className="text-[#D98F8F]">
                            Bienvenida a Rose Glow
                        </p>
                        <h1 className="mb-6 text-5xl font-bold leading-tight text-[#3D3030] md:text-6xl">
                            Haz florecer
                            <span className="block text-[#D98F8F]">
                                tu estilo
                            </span>
                        </h1>
                        <p className="mx-auto mb-8 max-w-lg text-lg leading-relaxed text-gray-600 md:mx-0">
                            Un espacio creado para que te consientas,
                            te relajes y luzcas unas uñas que reflejen
                            tu personalidad.
                        </p>
                    </div>
                    <div className="w-1/2">
                        <img
                            src={hero} alt="Manicure" className="h-96 w-full rounded-2xl object-cover"
                        />
                    </div>
                </div>
            </section>
            <section className="p-12 text-center">
                <h2 className="text-3xl font-bold text-[#3D3030]">
                    Un momento para ti
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-gray-600">
                    En Rose Glow queremos que cada visita sea una
                    experiencia agradable. Nos enfocamos en el cuidado,
                    la belleza y la atención personalizada.
                </p>
                <div className="mx-auto mt-10 grid max-w-4xl grid-cols-3 gap-6">
                    <div className="rounded-lg bg-[#FFF0F0] p-6">
                        <div className="text-3xl">
                            💗
                        </div>
                        <h3 className="mt-3 font-bold">
                            Atención personalizada
                        </h3>
                        <p className="mt-2 text-sm text-gray-600">
                            Nos enfocamos en tus gustos y necesidades.
                        </p>
                    </div>
                    <div className="rounded-lg bg-[#FFF0F0] p-6">
                        <div className="text-3xl">
                            ✨
                        </div>
                        <h3 className="mt-3 font-bold">
                            Cuidado y calidad
                        </h3>
                        <p className="mt-2 text-sm text-gray-600">
                            Cuidamos cada detalle durante tu visita.
                        </p>
                    </div>
                    <div className="rounded-lg bg-[#FFF0F0] p-6">
                        <div className="text-3xl">
                            🗓️
                        </div>
                        <h3 className="mt-3 font-bold">
                            Reserva fácil
                        </h3>
                        <p className="mt-2 text-sm text-gray-600">
                            Agenda tu cita de manera rápida y sencilla.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}