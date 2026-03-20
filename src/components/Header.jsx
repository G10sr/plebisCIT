import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../assets/css/header.css";
import Logo from "../assets/img/logo.png";

function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const [text, setText] = useState({ 
        alt: "PlebisCIT logo", 
        option1: "Administrador >", 
        option2: "< Volver" });

    const isAdmin = location.pathname === "/admin";

    return (
        <header>
            <img src={Logo} alt="PlebisCIT logo" />

            {isAdmin ? (
                <button
                    className="btn active"
                    onClick={() => navigate(-1)}
                >
                    {text.option2}
                </button>
            ) : (
                <Link to="/admin">
                    <button className="btn">
                        {text.option1}
                    </button>
                </Link>
            )}
        </header>
    );
}

export default Header;