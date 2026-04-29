import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/Confirm.css";
import img from '../assets/img/CRvotos.png';

function Confirm() {
    const [count, setCount] = useState(5);
    const navigate = useNavigate();

    useEffect(() => {
        // Si llega a 0, redirige
        if (count === 0) {
            navigate("/", {replace: true});
            return;
        }

        // Cuenta regresiva cada segundo
        const timer = setTimeout(() => {
            setCount((prev) => prev - 1);
        }, 1000);

        // Limpieza del temporizador
        return () => clearTimeout(timer);
    }, [count, navigate]);

    return (
        <section //Creacion del fondo
                className="fondo-container"
                style={{ backgroundImage: `linear-gradient(rgba(2, 0, 126, 0.07), rgba(0, 0, 0, 0)),url(${img})` }}
            >
        <div className="confirm-container">
            
                <h1>Gracias por votar</h1>
                <p>
                    Serás redireccionado al menú en <strong>{count}</strong>
                </p>
            
        </div>
        </section>
    );
}

export default Confirm;