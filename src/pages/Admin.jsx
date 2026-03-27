import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import "../assets/css/Admin.css";
import img from '../assets/img/CRvotos.png';


function Admin() {
    const [isOpen, setIsOpen] = useState(true); // 👈 ahora inicia abierto
    const [idUser, setIdUser] = useState("");


    return (    
        <section
            className="fondo-container"
            style={{ backgroundImage: `linear-gradient(rgba(2, 0, 126, 0.07), rgba(0, 0, 0, 0)),url(${img})` }}
        >

            {/* Modal - */}
            <div style={styles.overlay}>
                <div
                    style={styles.modal}
                >

                    <h2>
                        Modo {" "}
                        <span style={{ color: "#3658FA" }}>Adm</span>
                        <span style={{ color: "#b9b9b9" }}>ini</span>
                        <span style={{ color: "#ff0000" }}>st</span>
                        <span style={{ color: "#b9b9b9" }}>rat</span>
                        <span style={{ color: "#3658FA" }}>ivo</span>
                    </h2>
                    <div id="idSpace">
                        <p>Ingresa el correo:</p>
                        <input
                            type="text"
                            name="idAdmin"
                            placeholder="Ej: example@ex.com (Correo)"
                        />
                        <p>Contraseña:</p>
                        <input
                            type="text"
                            name="idAdminPass"
                            placeholder="Contraseña"
                        />
                    </div>
                    <p>Si no tienes cuenta, contacta soporte.</p>
                    <button name="enterAdmin">Entrar Modo Administrador</button>
                </div>
            </div>

        </section>
    );

}

const styles = {
    overlay: {
        position: "relative",
        top: 0,
        left: 0,
        width: "100dvw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    modal: {
        background: "#fff",
        padding: "20px",
        borderRadius: "20px",
        minWidth: "350px",
        position: "relative",
        border: "2px solid #b4b4b4",
        display: "flex",              // 👈 importante
        flexDirection: "column",      // vertical
        justifyContent: "center",     // centra verticalmente
        alignItems: "center",         // centra horizontalmente
        textAlign: "center",           // centra el texto
        zIndex: "10"
    }
};
export default Admin;