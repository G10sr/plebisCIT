import React from "react";
import { useNavigate } from "react-router-dom";
import GlobalLoader from "../components/GlobalLoader";
import "../assets/css/MenuVoting.css";
import "../assets/css/MenuVotingAdmin.css";
import VoteListAdmin from "../components/VoteListAdmin";

const CSV_GROUPS = [
    { label: "Externos", aliases: ["externos", "11°", "11", "11o"] },
    { label: "Profesores", aliases: ["profesores", "12°", "12", "12o"] },
    { label: "7°", aliases: ["7°", "7", "7o", "septimo", "septima"] },
    { label: "8°", aliases: ["8°", "8", "8o", "octavo", "octava"] },
    { label: "9°", aliases: ["9°", "9", "9o", "noveno", "novena"] },
    { label: "10°", aliases: ["10°", "10", "10o", "decimo", "decima"] },
];

const SECTION_ORDER = ["Externos", "Profesores", "7°", "8°", "9°", "10°", "Sin sección"];

const normalizeSectionValue = (value = "") =>
    value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim();

const getCsvSection = (fileName) => {
    const baseName = fileName.replace(/\.csv$/i, "");
    const normalizedBase = normalizeSectionValue(baseName);

    for (const group of CSV_GROUPS) {
        const matched = group.aliases.some((alias) => {
            const normalizedAlias = normalizeSectionValue(alias);
            return normalizedBase.includes(normalizedAlias) || normalizedAlias.includes(normalizedBase);
        });

        if (matched) {
            return group.label;
        }
    }

    return "Sin sección";
};

const buildCsvGroups = (files = []) => {
    const grouped = files.reduce((acc, file) => {
        const section = getCsvSection(file.name);
        if (!acc[section]) {
            acc[section] = [];
        }
        acc[section].push({
            id: file.name,
            name: file.name,
            status: "subido",
        });
        return acc;
    }, {});

    return Object.entries(grouped)
        .map(([section, items]) => ({
            section,
            items: items.sort((a, b) => a.name.localeCompare(b.name)),
        }))
        .sort((a, b) => {
            const indexA = SECTION_ORDER.indexOf(a.section);
            const indexB = SECTION_ORDER.indexOf(b.section);
            return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
        });
};

/**
 * PÁGINA: MENÚ DE VOTACIONES - ADMINISTRADOR
 */

function MenuVotingAdmin() {
    const CorrectValue = "1234";
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState(true);
    const [isCsvModalOpen, setIsCsvModalOpen] = React.useState(false);
    const [csvGroups, setCsvGroups] = React.useState([]);
    const [password, setPassword] = React.useState("");
    const [isPasswordCorrect, setIsPasswordCorrect] = React.useState(false);

    React.useEffect(() => {
        const loadCsvFiles = async () => {
            try {
                const response = await fetch("/subir");
                const data = await response.json().catch(() => ({}));

                if (!response.ok) {
                    throw new Error(data.error || "No se pudieron cargar los CSV");
                }

                setCsvGroups(buildCsvGroups(data.files || []));
            } catch (error) {
                console.error(error);
            }
        };

        if (isCsvModalOpen) {
            loadCsvFiles();
        }
    }, [isCsvModalOpen]);

    const uploadCSV = async (file) => {
        if (!file) {
            return;
        }

        const formData = new FormData();
        formData.append("archivo_csv", file);

        try {
            const response = await fetch("/subir", {
                method: "POST",
                body: formData,
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.error || "No se pudo subir el CSV");
            }

            const responseList = await fetch("/subir");
            const dataList = await responseList.json().catch(() => ({}));

            if (responseList.ok) {
                setCsvGroups(buildCsvGroups(dataList.files || []));
            }
        } catch (error) {
            console.error(error);
            alert("Error subiendo CSV: " + error.message);
        }
    };


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
                            Selecciona uno o varios archivos CSV; se subirán automáticamente a la carpeta uploads del servidor.
                        </p>

                        <label className="menu-voting-admin__upload-label">
                            Seleccionar archivos CSV

                            <input
                                type="file"
                                accept=".csv"
                                multiple
                                onChange={(e) => {
                                    const selectedFiles = Array.from(e.target.files || []);
                                    selectedFiles.forEach((file) => uploadCSV(file));
                                    e.target.value = "";
                                }}
                            />
                        </label>

                        {csvGroups.length > 0 && (
                            <div className="menu-voting-admin__file-list">
                                {csvGroups.map((group) => (
                                    <div key={group.section} className="menu-voting-admin__group-section">
                                        <div className="menu-voting-admin__group-title">{group.section}</div>
                                        {group.items.map((item) => (
                                            <div
                                                key={item.id}
                                                className="menu-voting-admin__file-item"
                                            >
                                                <span className="menu-voting-admin__file-name">
                                                    {item.name}
                                                </span>
                                                <span className="menu-voting-admin__file-name" style={{ color: "#2e7d32" }}>
                                                    Subido
                                                </span>
                                                <button
                                                    type="button"
                                                    className="menu-voting-admin__csv-delete-button"
                                                    onClick={async () => {
                                                        try {
                                                            const response = await fetch(`/subir/${encodeURIComponent(item.name)}`, {
                                                                method: "DELETE"
                                                            });

                                                            if (!response.ok) {
                                                                const data = await response.json().catch(() => ({}));
                                                                throw new Error(data.error || "No se pudo eliminar el archivo");
                                                            }

                                                            setCsvGroups((prev) =>
                                                                prev
                                                                    .map((sectionGroup) => ({
                                                                        ...sectionGroup,
                                                                        items: sectionGroup.items.filter((csv) => csv.id !== item.id),
                                                                    }))
                                                                    .filter((sectionGroup) => sectionGroup.items.length > 0)
                                                            );
                                                        } catch (error) {
                                                            console.error(error);
                                                            alert("Error eliminando CSV: " + error.message);
                                                        }
                                                    }}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        ))}
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