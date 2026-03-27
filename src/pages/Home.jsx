import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import img from '../assets/img/CRvotos.png';
import "../assets/css/Home.css"

function Home() {
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
                        ¡Bienvenido a{" "}
                        <span style={{ color: "#3658FA" }}>Pl</span>
                        <span style={{ color: "#b9b9b9" }}>eb</span>
                        <span style={{ color: "#ff0000" }}>i</span>
                        <span style={{ color: "#b9b9b9" }}>sC</span>
                        <span style={{ color: "#3658FA" }}>IT</span>!
                    </h2>
                    <div id="idSpace">
                        <p>Ingresa tu identificación:</p>
                        <input
                            type="text"
                            name="idUser"
                            placeholder="Ej: #-####-#### (Número de cédula)"
                            maxLength={12}
                        />
                    </div>
                    <p>Recuerda votar por tu cuenta.<br></br>¡Tu desición SÍ importa!
                    </p>
                    <button name="startVote">Iniciar Voto</button>
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
        width: "100%",
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

export default Home;