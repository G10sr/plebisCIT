import React, { useState } from "react";

function PartidoModal({ partido, onClose, onSelect }) {
    const [index, setIndex] = useState(0);
    const hayVariasImagenes = partido.imagenes.length > 1;

    const prev = () => {
        if (!hayVariasImagenes) return;
        setIndex(
            (index - 1 + partido.imagenes.length) % partido.imagenes.length
        );
    };

    const next = () => {
        if (!hayVariasImagenes) return;
        setIndex((index + 1) % partido.imagenes.length);
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>

                {/* BOTÓN CERRAR */}
                <button style={styles.closeButton} onClick={onClose}>
                    ✕
                </button>


                {/* TEXTO */}
                <div style={styles.texto}>
                    <div style={styles.textContent}>
                        <h2>{partido.nombre}</h2>
                        <p>{partido.descripcionLarga}</p>
                    </div>

                    <div style={styles.textFooter}>
                        <button style={styles.selectButton} onClick={onSelect}>
                            Seleccionar voto
                        </button>
                    </div>
                </div>


                {/* CARRUSEL */}
                <div style={styles.carrusel}>
                    <img
                        src={partido.imagenes[index]}
                        style={styles.image}
                        alt="Imagen del partido"
                    />

                    {/* CONTROLES */}
                    <div style={styles.controls}>
                        <button
                            style={{
                                ...styles.controlButton,
                                opacity: hayVariasImagenes ? 1 : 0.4,
                                cursor: hayVariasImagenes ? "pointer" : "not-allowed",
                            }}
                            onClick={prev}
                            disabled={!hayVariasImagenes}
                        >
                            ◀
                        </button>

                        <button
                            style={{
                                ...styles.controlButton,
                                opacity: hayVariasImagenes ? 1 : 0.4,
                                cursor: hayVariasImagenes ? "pointer" : "not-allowed",
                            }}
                            onClick={next}
                            disabled={!hayVariasImagenes}
                        >
                            ▶
                        </button>
                    </div>

                    {/* INDICADORES */}
                    {hayVariasImagenes && (
                        <div style={styles.indicators}>
                            {partido.imagenes.map((_, i) => (
                                <span
                                    key={i}
                                    style={{
                                        ...styles.dot,
                                        backgroundColor: i === index ? "#2f80ed" : "#949494",
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    modal: {
        backgroundColor: "#fff",
        width: "900px",
        height: "500px",
        borderRadius: 16,
        display: "flex",
        position: "relative",
        overflow: "hidden",
    },
    closeButton: {
        position: "absolute",
        top: 12,
        right: -110,
        border: "none",
        background: "transparent",
        fontSize: 24,
        cursor: "pointer",
    },
    texto: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: 24,
    },

    textContent: {
        flex: 1,
        overflowY: "auto",
        paddingRight: 8,
    },

    textFooter: {
        paddingTop: 16,
        borderTop: "1px solid #e0e0e0",
    },

    carrusel: {
        flex: 1,
        backgroundColor: "#9ecbff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    image: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },

    /* CONTROLES */
    controls: {
        position: "absolute",
        bottom: 60,
        display: "flex",
        gap: 12,
    },
    controlButton: {
        width: 40,
        height: 40,
        borderRadius: "50%",
        border: "none",
        backgroundColor: "#2f80ed",
        color: "#fff",
        fontSize: 18,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    /* INDICADORES */
    indicators: {
        position: "absolute",
        bottom: 20,
        display: "flex",
        gap: 8,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: "50%",
    },

    selectButton: {
        marginTop: 20,
        padding: "10px 16px",
        backgroundColor: "#2f80ed",
        color: "#fff",
        borderRadius: 8,
        border: "none",
        cursor: "pointer",
    },
};

export default PartidoModal;