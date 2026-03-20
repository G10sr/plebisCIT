import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../assets/css/header.css";

function Header() {

    const location = useLocation();
    const [text, setText] = useState({
        alt: "PlebisCIT logo",
        option1: "Home",
        option2: "Productos",
    });

    return (
        <header>
            <div id="button-Div">
                <Link to="/">
                    <button className={`btn ${location.pathname === "/" ? "active" : ""}`}>{text.option1}</button>
                </Link>
                <Link to="/productos">
                    <button className={`btn ${location.pathname === "/productos" ? "active" : ""}`}>{text.option2}</button>
                </Link>
            </div>
        </header>
    );
}
export default Header;

//contador del carrito en el header
{}