import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PartidoCard from "../components/PartidoCard";
import PartidoModal from "../components/PartidoModal";
import placehold from "../assets/img/PlaceHolder.png";
import img from '../assets/img/CRvotos.png';

function Vote() {
    const [partidoSeleccionado, setPartidoSeleccionado] = useState(null);
    const [partidoActivo, setPartidoActivo] = useState(null);
    const [confirmado, setConfirmado] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const navigate = useNavigate();

    // 👇 detectar resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

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
        <section
            className="fondo-container"
            style={{
                position: "relative",
                minHeight: "100vh",
                backgroundImage: `linear-gradient(rgba(2, 0, 126, 0.07), rgba(0, 0, 0, 0)), url(${img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                paddingBottom: "60px",
            }}
        >
            <div style={styles.overlay}>
                <div style={{
                    ...styles.grid,
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                    width: isMobile ? "90%" : "900px"
                }}>
                    {partidos.map((p) => (
                        <div key={p.id}>
                            <PartidoCard
                                partido={p}
                                seleccionado={partidoSeleccionado === p.id}
                                onClick={() => {
                                    if (p.id === 0) {
                                        setPartidoSeleccionado(0);
                                        setPartidoActivo(null);
                                        setConfirmado(false);
                                    } else {
                                        setPartidoActivo(p.id);
                                    }
                                }}
                            />

                            {partidoActivo === p.id && (
                                <PartidoModal
                                    partido={p}
                                    onClose={() => setPartidoActivo(null)}
                                    onSelect={() => {
                                        setPartidoSeleccionado(p.id);
                                        setPartidoActivo(null);
                                        setConfirmado(false);
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* 👇 Confirmación */}
            {partidoSeleccionado !== null && (
                <div style={styles.confirmWrapper}>
                    <div style={{
                        ...styles.confirmModal,
                        flexDirection: isMobile ? "column" : "row",
                        gap: isMobile ? "12px" : "0",
                        width: isMobile ? "90%" : "900px",
                        alignItems: isMobile ? "flex-start" : "center"
                    }}>
                        <div style={styles.leftSection}>
                            <label style={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    style={{ margin: 0 }}
                                    checked={confirmado}
                                    onChange={(e) => setConfirmado(e.target.checked)}
                                />
                                
                            </label>
                            Estoy consciente de la elección que estoy tomando en mi voto.
                        </div>

                        <button
                            style={{
                                ...styles.boton,
                                backgroundColor: confirmado ? "#d32f2f" : "#ccc",
                                cursor: confirmado ? "pointer" : "not-allowed",
                                width: isMobile ? "100%" : "auto"
                            }}
                            disabled={!confirmado}
                            onClick={() => {
                                alert(`¡Voto enviado! ID = ${partidoSeleccionado}`);
                                navigate("/voteConfirm", {replace:true});
                            }}
                        >
                            Enviar Voto
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}

const styles = {
    overlay: {
        paddingTop: "40px",
        display: "flex",
        justifyContent: "center",
    },

    grid: {
        display: "grid",
        gap: 24,
    },

    confirmWrapper: {
        marginTop: "30px",
        display: "flex",
        justifyContent: "center",
    },

    confirmModal: {
        background: "white",
        padding: "20px 24px",
        border: "2px solid rgb(180, 180, 180)",
        borderRadius: "12px",
        display: "flex",
        justifyContent: "center",
        gap: "20px",
    },

    leftSection: {
        width: "45%",
        display: "flex",
        alignItems: "center",
    },

    checkboxLabel: {
        display: "flex",
        alignItems: "center",
        fontSize: "16px",
        width: "20px",
        margin: "10px",
    },

    boton: {
        padding: "10px 20px",
        border: "none",
        borderRadius: "8px",
        color: "white",
        fontWeight: "bold",
        transition: "0.3s",
    },
};

export default Vote;