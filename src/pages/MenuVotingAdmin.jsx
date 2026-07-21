import React from "react";
import { useNavigate } from "react-router-dom";
import GlobalLoader from "../components/GlobalLoader";
import "../assets/css/MenuVoting.css";
import "../assets/css/MenuVotingAdmin.css";
import VoteListAdmin from "../components/VoteListAdmin";

/**
 * PÁGINA: MENÚ DE VOTACIONES - ADMINISTRADOR
 */
function MenuVotingAdmin() {
    const CorrectValue = "1234"; 
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState(true);
    const [isCsvModalOpen, setIsCsvModalOpen] = React.useState(false);
    const [csvFiles, setCsvFiles] = React.useState([]);
    const [password, setPassword] = React.useState("");
    const [isPasswordCorrect, setIsPasswordCorrect] = React.useState(false);

    React.useEffect(() => {
        const adminUUID = localStorage.getItem("adminUUID");
        if (!adminUUID) {
            navigate("/admin", { replace: true });
            return;
        }

        // simula carga o inicialización
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 300); // puedes bajarlo o quitarlo

        return () => clearTimeout(timer);
    }, [navigate]);

    if (isLoading) {
        return <GlobalLoader show text="Cargando opciones..." />;
    }

    return (
        <section>
            <hr />

            {/* Header de acciones del admin */}
            <div className="menu-voting-admin__header">
                <button
                    className="menu-voting-admin__button"
                    onClick={() => navigate("/adminsettings/new")}
                >
                    + Crear votación
                </button>
            </div>

            <div className="VotingList">
                <VoteListAdmin />
            </div>
                <div>

                </div>
                <div className="menu-voting-admin__csv-controls">
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => {
                            const value = e.target.value;
                            setPassword(value);
                            setIsPasswordCorrect(value === CorrectValue);
                        }}
                        className="menu-voting-admin__password-input"
                    />
                    <button
                        onClick={() => {
                            if (password === CorrectValue) {
                                setIsCsvModalOpen(true);
                            }
                        }}
                        disabled={!isPasswordCorrect}
                        className={`menu-voting-admin__csv-button${isPasswordCorrect ? "" : " menu-voting-admin__csv-button--disabled"}`}
                    >
                        Admin CSV
                    </button>
                </div>

            {isCsvModalOpen && (
                <div
                    id="admin-CSV"
                    className="menu-voting-admin__modal-overlay"
                    onClick={() => setIsCsvModalOpen(false)}
                >
                    <div
                        className="menu-voting-admin__modal-panel"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="menu-voting-admin__close-button"
                            onClick={() => setIsCsvModalOpen(false)}
                            aria-label="Cerrar popup"
                        >
                            ×
                        </button>

                        <h3 className="menu-voting-admin__title">Importar CSV</h3>
                        <p className="menu-voting-admin__description">
                            Sube varios archivos CSV y elimínalos si lo necesitas antes de guardarlos. Asegurate que los archivos tengan exactamente los campos Número de Identificación, Seccion, Nombre, Primer Apellido, Segundo Apellido.
                        </p>

                        <label className="menu-voting-admin__upload-label">
                            Seleccionar archivos CSV
                            <input
                                type="file"
                                accept=".csv"
                                multiple
                                onChange={(e) => {
                                    const files = Array.from(e.target.files || []);
                                    setCsvFiles((prev) => [...prev, ...files.map((file) => ({ id: `${file.name}-${file.lastModified}`, file }))]);
                                    e.target.value = "";
                                }}
                            />
                        </label>

                        {csvFiles.length > 0 && (
                            <div className="menu-voting-admin__file-list">
                                {csvFiles.map((item) => (
                                    <div key={item.id} className="menu-voting-admin__file-item">
                                        <span className="menu-voting-admin__file-name">{item.file.name}</span>
                                        <button
                                            className="menu-voting-admin__csv-delete-button"
                                            onClick={() => setCsvFiles((prev) => prev.filter((csv) => csv.id !== item.id))}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}

export default MenuVotingAdmin;