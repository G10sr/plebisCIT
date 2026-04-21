import React, { useState } from "react";
import PartidoCard from "../components/PartidoCard";
import PartidoModal from "../components/PartidoModal";
import placehold from "../assets/img/PlaceHolder.png";

function Vote() {
    const [partidoSeleccionado, setPartidoSeleccionado] = useState(null);
    const [partidoActivo, setPartidoActivo] = useState(null);

    const partidos = [
        {
            id: 1,
            nombre: "Partido 1",
            descripcionCorta: "Descripción corta del partido y motivos.",
            descripcionLarga: "Descripción larga del partidoaaaaaaaaaaaaaaaaaaaaaaaaaa",
            imagenes: [placehold, placehold],
            color: "#9ecbff",
        },
        {
            id: 2,
            nombre: "Partido 2",
            descripcionCorta: "Descripción corta del partido y motivos.",
            descripcionLarga: "Descripción larga del partido...",
            imagenes: [placehold],
            color: "#9cffc0",

        },
        {
            id: 3,
            nombre: "Partido 3",
            descripcionCorta: "Descripción corta del partido y motivos.",
            descripcionLarga: "Descripción larga del partido...",
            imagenes: [placehold],
            color: "#9cffc0",

        },
        {
            id: 0,
        },
    ];

    return (
        //Configuracion de los partidos
        <section className="fondo-container">
            <div style={styles.overlay}>
                <div style={styles.grid}>
                    {partidos.map((p) => (
                        <PartidoCard
                            key={p.id}
                            partido={p}
                            seleccionado={partidoSeleccionado === p.id}
                            onClick={() => {
                                if (p.id === 0) {
                                    // Directly set null vote
                                    setPartidoSeleccionado(0);
                                    setPartidoActivo(null); // just in case
                                } else {
                                    setPartidoActivo(p);
                                }
                            }}
                        />
                    ))}
                </div>
            </div>
            {partidoActivo && (
                <PartidoModal
                    partido={partidoActivo}
                    onClose={() => setPartidoActivo(null)}
                    onSelect={() => {
                        setPartidoSeleccionado(partidoActivo.id);
                        setPartidoActivo(null);
                    }}
                />
            )}
        </section>
    );
}

const styles = {
    overlay: {
        position: "fixed",
        inset: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

    },
    grid: {
        width: "900px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 24,
    },
};

export default Vote;