import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PartidoCard from "../components/PartidoCard";
import PartidoModal from "../components/PartidoModal";
import img from '../assets/img/CRvotos.png';
import GlobalLoader from "../components/GlobalLoader";

/**
 * PÁGINA DE VOTACIÓN
 * 
 * Componente principal que permite a los usuarios:
 * 1. Ver todas las opciones disponibles para una votación
 * 2. Seleccionar una opción
 * 3. Confirmar su voto con una casilla de verificación
 * 4. Registrar el voto en la base de datos
 */
function Vote() {
    // Estado del partido seleccionado por el usuario
    const [partidoSeleccionado, setPartidoSeleccionado] = useState(null);

    // Estado del partido en el que se abrió el modal
    const [partidoActivo, setPartidoActivo] = useState(null);

    // Estado de confirmación del voto (checkbox)
    const [confirmado, setConfirmado] = useState(false);

    // Detectar si es pantalla móvil (< 768px)
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // Lista de opciones de votación transformadas
    const [partidos, setPartidos] = useState([]);

    // Estados de carga
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);

    // ID del voto nulo (obtenido de la BD)
    const [votoNuloId, setVotoNuloId] = useState(null);

    // Separar voto nulo del resto
    const votoNulo = partidos.find(p => p.id === 0);
    const partidosNormales = partidos.filter(p => p.id !== 0);

    // Estado para controlar el envío del voto
    const [enviandoVoto, setEnviandoVoto] = useState(false);

    // Router hooks
    const navigate = useNavigate();
    const location = useLocation();
    const voting = location.state?.voting;
    const cedula = location.state?.cedula;

    /**
     * Effect: Detectar cambios de tamaño de pantalla
     * Ajusta el layout entre móvil y desktop
     */
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    /**
     * Effect: Cargar opciones de votación desde la API
     * 
     * Proceso:
     * 1. Obtener todas las opciones de la votación
     * 2. Buscar el ID del "Voto Nulo" en la base de datos
     * 3. Filtrar opciones para ocultar "Voto Nulo" y "Not Defined"
     * 4. Transformar datos al formato esperado por PartidoCard
     * 5. Agregar la opción visual del voto nulo al final (id: 0)
     */
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

                // Buscar el ID real del voto nulo en la base de datos
                const votoNulo = data.find(opt => opt.name === "Voto Nulo");
                if (votoNulo) {
                    setVotoNuloId(votoNulo.id);
                }

                // Filtrar opciones del sistema y transformar al formato esperado
                const transformedPartidos = data
                    .filter(opt => opt.name !== "Voto Nulo" && opt.name !== "Not Defined")
                    .map((opt, idx) => ({
                        id: opt.id,
                        nombre: opt.name,
                        descripcionCorta: opt.description || opt.name,
                        descripcionLarga: opt.description || opt.name,
                        imagenes: opt.images || [],
                        color: opt.color || "#9ecbff",
                    }));

                // Agregar opción visual del voto nulo al final
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

    // Mostrar estado de carga
    if (isLoading) {
        return <GlobalLoader show text="Cargando opciones..." />;
    }

    // Mostrar mensaje de error
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
            }}
        >
            {/* Grid de opciones de votación */}
            <div style={styles.overlay}>
                <div style={styles.containerOpciones}>

                    {/* Fila horizontal de partidos */}
                    <div className="filaPartidos" style={styles.filaPartidos}>
                        {partidosNormales.map((p) => (
                            <div key={p.id} style={styles.cardWrapper}>
                                <PartidoCard
                                    partido={p}
                                    seleccionado={partidoSeleccionado === p.id}
                                    onClick={() => {
                                        setPartidoActivo(p.id);
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

                    {/* Tarjeta de Voto Nulo */}
                    {votoNulo && (
                        <div style={styles.nuloContainer}>
                            <PartidoCard
                                partido={votoNulo}
                                seleccionado={partidoSeleccionado === 0}
                                onClick={() => {
                                    setPartidoSeleccionado(0);
                                    setPartidoActivo(null);
                                    setConfirmado(false);
                                }}
                            />
                        </div>
                    )}

                </div>
            </div>

            {/* Panel de confirmación y envío de voto */}
            {partidoSeleccionado !== null && (
                <div style={styles.confirmWrapper}>
                    <div style={{
                        ...styles.confirmModal,
                        flexDirection: isMobile ? "column" : "row",
                        gap: isMobile ? "12px" : "0",
                        width: isMobile ? "90%" : "900px",
                        alignItems: isMobile ? "flex-start" : "center"
                    }}>
                        {/* Sección de confirmación con checkbox */}
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

                        {/* Botón de envío de voto */}
                        <button
                            style={{
                                ...styles.boton,
                                backgroundColor: confirmado ? "#d32f2f" : "#ccc",
                                cursor: confirmado ? "pointer" : "not-allowed",
                                width: isMobile ? "100%" : "auto"
                            }}
                            disabled={!confirmado || enviandoVoto}
                            onClick={async () => {
                                // Obtener el ID final del voto
                                const idFinal = partidoSeleccionado === 0
                                    ? votoNuloId
                                    : partidoSeleccionado;

                                setEnviandoVoto(true);

                                try {
                                    // Enviar voto al servidor
                                    const response = await fetch('/api/vote', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            cedula: cedula,
                                            votingName: voting.Name,
                                            optionId: idFinal
                                        })
                                    });

                                    if (!response.ok) {
                                        const error = await response.json();
                                        alert(`Error: ${error.error || 'Error al registrar el voto'}`);
                                        setEnviandoVoto(false);
                                        return;
                                    }

                                    alert('¡Voto registrado correctamente!');
                                    navigate("/voteConfirm", { replace: true });
                                } catch (err) {
                                    console.error("Error enviando voto:", err);
                                    alert("Error al enviar el voto. Intenta nuevamente.");
                                    setEnviandoVoto(false);
                                }
                            }}
                        >
                            {enviandoVoto ? "Enviando..." : "Enviar Voto"}
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}

// Estilos inline para la página de votación
const styles = {
    overlay: {
        paddingTop: "40px",
        display: "flex",
        justifyContent: "center",
    },

    containerOpciones: {
        width: "95%",
        maxWidth: "1400px",
        display: "flex",
        flexDirection: "column",
        gap: "25px",
    },

    filaPartidos: {
    display: "flex",
    gap: "20px",
    overflowX: "auto",
    overflowY: "hidden",
    paddingBottom: "6px",
    scrollBehavior: "smooth",

    /* Firefox */
    scrollbarWidth: "thin",
    scrollbarColor: "#3658FA transparent",
},

    cardWrapper: {
        flex: "0 0 300px",
    },

    nuloContainer: {
        width: "100%",
        maxWidth: "900px",
        margin: "0 auto",
        transform: "scale(0.85)",
        transformOrigin: "center",
    },

    confirmWrapper: {
    marginTop: "20px",
    marginBottom: "0px",
    display: "flex",
    justifyContent: "center",
    paddingBottom: "0px",
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