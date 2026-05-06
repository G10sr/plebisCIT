import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../assets/css/MenuVoting.css"
import VoteList from "../components/VoteList";

/**
 * PÁGINA: MENÚ DE VOTACIONES
 * 
 * Contenedor que muestra la lista de votaciones disponibles para el usuario.
 * Solo renderiza el componente VoteList que maneja toda la lógica.
 * 
 * Flujo:
 * 1. Usuario ingresa cédula en Home
 * 2. Llega a esta página con su cédula en el estado
 * 3. VoteList obtiene sus votaciones disponibles
 * 4. Usuario selecciona una votación
 * 5. Navega a /vote para emitir su voto
 */
function MenuVoting() {
    return (
        <section>
            <hr />
            <div className="VotingList">
                <VoteList />
            </div>
        </section>
    );
}


export default MenuVoting;