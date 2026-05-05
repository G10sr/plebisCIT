import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PartidoCard from "../components/PartidoCard";
import PartidoModal from "../components/PartidoModal";
import img from '../assets/img/CRvotos.png';

function Vote() {
    const [partidoSeleccionado, setPartidoSeleccionado] = useState(null);
    const [partidoActivo, setPartidoActivo] = useState(null);
    const [confirmado, setConfirmado] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [partidos, setPartidos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);
    const [votoNuloId, setVotoNuloId] = useState(null);
    
    const navigate = useNavigate();
    const location = useLocation();
    const voting = location.state?.voting;

    // 👇 Detectar resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // 👇 Cargar opciones de votación desde la BD
    useEffect(() => {
        if (!voting?.Name) {
            setLoadError("No se especificó la votación");
            setIsLoading(false);
            return;
        }

        const fetchOptions = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(`/api/voting-options/${voting.Name}`);
                if (!res.ok) throw new Error("Error cargando opciones");

                const data = await res.json();

                // 👇 encontrar voto nulo en la BD
                const votoNulo = data.find(opt => opt.Name === "Voto Nulo");

                if (votoNulo) {
                    setVotoNuloId(votoNulo.id);
                }

                // 👇 transformar normal (NO quitar nulo si no quieres)
                const transformedPartidos = data
                    .filter(opt => opt.Name !== "Voto Nulo") // 👈 elimina el nulo de BD
                    .map((opt, idx) => ({
                        id: opt.id || idx,
                        nombre: opt.Name,
                        descripcionCorta: opt.Des || opt.Name,
                        descripcionLarga: opt.Des || opt.Name,
                        imagenes: [opt.Img1, opt.Img2, opt.Img3, opt.Img4, opt.Img5].filter(Boolean),
                        color: opt.Color || "#9ecbff",
                    }));

                // 👇 tu opción visual sigue siendo 0
                transformedPartidos.push({ id: 0 });

                setPartidos(transformedPartidos);
            } catch (err) {
                console.error("Error cargando opciones:", err);
                setLoadError("No se pudieron cargar las opciones de votación");
                setPartidos([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOptions();
    }, [voting?.Name]);

    if (isLoading) {
        return <p style={{ textAlign: "center", paddingTop: "100px" }}>Cargando opciones...</p>;
    }

    if (loadError) {
        return <p style={{ textAlign: "center", paddingTop: "100px", color: "red" }}>{loadError}</p>;
    }

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
                            const idFinal = partidoSeleccionado === 0
                                ? votoNuloId
                                : partidoSeleccionado;

                            alert(`¡Voto enviado! ID = ${idFinal}`);

                            // 👇 aquí deberías enviar idFinal al backend
                            // await fetch('/api/vote', { method: 'POST', body: JSON.stringify({ id: idFinal }) })

                            navigate("/voteConfirm", { replace: true });
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