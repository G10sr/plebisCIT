import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import img from '../assets/img/CRvotos.png';
import "../assets/css/Home.css"

/**
 * PÁGINA: HOME
 * 
 * Página de inicio de la aplicación.
 * Permite al usuario:
 * - Ingresar su número de cédula
 * - Acceder al flujo de votación
 * 
 * Validación:
 * - Requiere que se ingrese una cédula
 * - Navega a /menuvoting pasando la cédula en el estado
 */
function Home() {
    // Estado del ID ingresado por el usuario
    const [idUser, setIdUser] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem("adminUUID");
        localStorage.removeItem("adminName");
    }, []);

    /**
     * Iniciar flujo de votación
     * Valida que haya cédula y navega a la lista de votaciones
     */
    const handleStart = async (e) => {
        e.preventDefault();

        if (!idUser) {
            alert("Por favor ingresa tu cédula");
            return;
        }

        try {

            const res = await fetch(
                `http://localhost:3001/api/votings/${idUser}`
            );

            const data = await res.json();

            // 🔥 Si no está en ninguna votación visible
            if (!Array.isArray(data) || data.length === 0) {

                alert(
                    "No estás registrado en ninguna votación.\n\nRevisa si tu cédula está correcta."
                );

                navigate("/home", { replace: true });
                return;
            }

            // ✅ Sí pertenece a una votación
            navigate("/menuvoting", {
                replace: true,
                state: { cedula: idUser }
            });

        } catch (err) {

            console.error(err);

            alert("Error verificando votaciones");

        }
    };

    return (
        <section //Creacion del fondo
            className="fondo-container"
            style={{ backgroundImage: `linear-gradient(rgba(2, 0, 126, 0.07), rgba(0, 0, 0, 0)),url(${img})` }}
        >

            {/* Modal - */}
            <div className="home-overlay">
                <div className="home-modal">

                    <h2>
                        ¡Bienvenido a{" "}
                        <span className="brand-blue">Pl</span>
                        <span className="brand-gray">eb</span>
                        <span className="brand-red">i</span>
                        <span className="brand-gray">sC</span>
                        <span className="brand-blue">IT</span>!
                    </h2>
                    <form onSubmit={handleStart}>
                        <div id="idSpace">
                            <p>Ingresa tu identificación:</p>
                            <input
                                type="text"
                                name="idUser"
                                placeholder="Ej: #-####-#### (Número de cédula)"
                                maxLength={12}
                                value={idUser}
                                onChange={(e) => setIdUser(e.target.value)}
                            />
                        </div>
                        <p>Recuerda votar por tu cuenta.<br></br>¡Tu desición SÍ importa!
                        </p>
                        <button
                            type="submit"
                            name="startVote"
                            disabled={idUser.trim().length < 9}
                            style={{
                                opacity: idUser.length < 9 ? 0.5 : 1,
                                cursor: idUser.length < 9 ? "not-allowed" : "pointer"
                            }}
                        >
                            Iniciar Voto
                        </button>
                    </form>
                </div>
            </div>

        </section>
    );

}

export default Home;