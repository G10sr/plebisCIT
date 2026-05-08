import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "../assets/css/Admin.css";
import img from '../assets/img/CRvotos.png';

/**
 * PÁGINA: PANEL DE ADMINISTRACIÓN
 * 
 * Pantalla de login para administradores.
 * 
 * Campos:
 * - Correo electrónico
 * - Contraseña
 * 
 * Acciones:
 * - Validar credenciales del administrador
 * - Navegar al menú de administración si es válido
 * 
 * NOTA: La validación actual es estática. Implementar validación en backend.
 */
function Admin() {
    // Estado del modal (actualmente no utilizado)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isOpen, setIsOpen] = useState(true);
    
    // Estado del ID de usuario ingresado
    const [idUser, setIdUser] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem("adminUUID");
        localStorage.removeItem("adminName");
    }, []);

    /**
     * Iniciar sesión de administrador
     * IMPORTANTE: Agregar validación de credenciales en backend
     */
    const handleStart = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3001/api/admin-login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
            });

            const data = await response.json();

            if (!response.ok) {
            alert(data.error);
            return;
            }

            // Guardar UUID del admin
            localStorage.setItem("adminUUID", data.admin.id);
            localStorage.setItem("adminName", data.admin.name);

            navigate("/menuvotingAdmin", {
            replace: true,
            });

        } catch (err) {
            console.error(err);
            alert("Error conectando con el servidor");
        }
        };

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
                    <form onSubmit={handleStart} style={{ width: "100%" }}>
                        <div id="idSpace">
                            <p>Ingresa el correo:</p>
                            <input
                                type="text"
                                name="idAdmin"
                                placeholder="Ej: example@ex.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <p>Contraseña:</p>
                            <input
                                type="password"
                                name="idAdminPass"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <p>Si no tienes cuenta, contacta soporte.</p>
                        <button type="submit" name="enterAdmin">Entrar Modo Administrador</button>
                    </form>
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
        width: "23vw",
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