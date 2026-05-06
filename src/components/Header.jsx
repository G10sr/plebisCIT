import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../assets/css/Header.css";
import Logo from "../assets/img/logo.png";

/**
 * COMPONENTE: ENCABEZADO
 * 
 * Barra de navegación superior que:
 * - Muestra el logo de la aplicación
 * - Proporciona botones de navegación contextuales
 * - Oculta botones en ciertas rutas (votación en curso)
 * 
 * Comportamiento de navegación:
 * - Home: Muestra botón para ir a Admin
 * - Admin: Muestra botón para volver a Home
 * - Subpáginas de Admin: Muestra botón para volver a Admin
 * - Durante votación: Oculta todos los botones
 */
function Header() {
    const location = useLocation();
    const navigate = useNavigate();

    // Textos para los botones
    const [text] = useState({
        alt: "PlebisCIT logo",
        option1: "Administrador >",
        option2: "< Volver"
    });

    const currentPath = location.pathname;

    // Rutas donde la navegación no debe ser visible (Durante votación activa)
    const hideButtonsPaths = ["/menuvoting", "/vote", "/voteConfirm"];
    const shouldHide = hideButtonsPaths.includes(currentPath);

    // Detectar página actual
    const isHome = currentPath === "/" || currentPath === "/home";
    const isAdmin = currentPath === "/admin";
    const isAdminSubPage = currentPath === "/menuvotingAdmin" || currentPath === "/adminsettings";

    /**
     * Manejar navegación entre secciones
     * @param {string} target - Destino: 'admin', 'home', 'toAdminRoot', 'back'
     */
    const handleNavigation = (target) => {
        if (target === "admin") {
            navigate("/admin", { replace: true });
        } else if (target === "home") {
            navigate("/", { replace: true });
        } else if (target === "toAdminRoot") {
            // Desde subpáginas de admin volver a la raíz
            navigate("/admin", { replace: true });
        } else {
            // Volver a la página anterior
            navigate(-1, { replace: true });
        }
    };

    return (
        <header>
            <img src={Logo} alt={text.alt} />

            {!shouldHide && (
                <div className="header-buttons">
                    {isAdmin ? (
                        /* De Admin Root a Home */
                        <button className="btn active" onClick={() => handleNavigation("home")}>
                            {text.option2}
                        </button>
                    ) : isHome ? (
                        /* De Home a Admin Root */
                        <button className="btn" onClick={() => handleNavigation("admin")}>
                            {text.option1}
                        </button>
                    ) : isAdminSubPage ? (
                        /* 4. De subpáginas de Admin (como /menuvotingAdmin) volvemos a /admin */
                        <button className="btn active" onClick={() => handleNavigation("toAdminRoot")}>
                            {text.option2}
                        </button>
                    ) : (
                        /* Cualquier otra ruta no administrativa */
                        <button className="btn active" onClick={() => handleNavigation("back")}>
                            {text.option2}
                        </button>
                    )}
                </div>
            )}
        </header>
    );
}

export default Header;