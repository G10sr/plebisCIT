import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../assets/css/Header.css";
import Logo from "../assets/img/logo.png";

function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    
    const [text] = useState({
        alt: "PlebisCIT logo",
        option1: "Administrador >",
        option2: "< Volver"
    });

    const currentPath = location.pathname;
    
    // 1. Rutas donde no se muestra ningún botón
    const hideButtonsPaths = ["/menuvoting", "/vote", "/thanksforvoting"];
    const shouldHide = hideButtonsPaths.includes(currentPath);

    const isHome = currentPath === "/" || currentPath === "/home";
    const isAdmin = currentPath === "/admin";
    // 2. Detectamos si estamos en una subpágina de admin
    const isAdminSubPage = currentPath === "/menuvotingAdmin" || currentPath === "/adminsettings";

    const handleNavigation = (target) => {
        if (target === "admin") {
            navigate("/admin", { replace: true });
        } else if (target === "home") {
            navigate("/", { replace: true });
        } else if (target === "toAdminRoot") {
            // 3. Si estamos en una subpágina de admin, volvemos a la raíz de admin
            navigate("/admin", { replace: true });
        } else {
            navigate(-1);
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