/**
 * PÁGINA: MENÚ DE VOTACIONES - ADMINISTRADOR
 * 
 * Panel administrativo que muestra:
 * - Lista de votaciones gestionadas por el administrador
 * - Opciones para editar configuración
 * - Opciones para ver resultados de votaciones
 * 
 * Diferencias con MenuVoting (usuario):
 * - Usa VoteListAdmin en lugar de VoteList
 * - VoteListAdmin proporciona botones de administración (editar, ver resultados)
 * - Acceso completo a todas las votaciones (no solo las del usuario)
 */

import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../assets/css/MenuVoting.css"
import VoteListAdmin from "../components/VoteListAdmin";

function MenuVotingAdmin() {
    return (
        <section>
            <hr />
            <div className="VotingList">
                <VoteListAdmin />
            </div>
        </section>
    );
}


export default MenuVotingAdmin;