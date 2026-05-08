import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/MenuVoting.css";
import VoteListAdmin from "../components/VoteListAdmin";

/**
 * PÁGINA: MENÚ DE VOTACIONES - ADMINISTRADOR
 */
function MenuVotingAdmin() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState(true); // si lo necesitas

    React.useEffect(() => {
        // simula carga o inicialización
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 300); // puedes bajarlo o quitarlo

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <p style={{ textAlign: "center", paddingTop: "100px" }}>
                Cargando opciones...
            </p>
        );
    }

    return (
        <section>
            <hr />

            {/* Header de acciones del admin */}
            <div style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: 12,
                marginRight:"10vw"
            }}>
                <button
                    onClick={() => navigate("/adminsettings/new")}
                    style={{
                        background: "transparent",
                        border: "1px solid #ddd",
                        padding: "6px 12px",
                        borderRadius: 8,
                        fontSize: 12.5,
                        color: "#7a776e",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#6c5ce7";
                        e.currentTarget.style.color = "#6c5ce7";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#ddd";
                        e.currentTarget.style.color = "#7a776e";
                    }}
                >
                    + Crear votación
                </button>
            </div>

            <div className="VotingList">
                <VoteListAdmin />
            </div>
        </section>
    );
}

export default MenuVotingAdmin;