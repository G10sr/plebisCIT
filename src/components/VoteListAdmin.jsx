/**
 * COMPONENTE: LISTA DE VOTACIONES - ADMINISTRADOR
 * 
 * Muestra todas las votaciones con botones de administración.
 * 
 * Funcionalidades:
 * - Listar votaciones en formato de grid 2 columnas
 * - Botón de configuración: Editar parámetros de la votación
 * - Botón de resultados: Ver gráficos y estadísticas de votación
 * 
 * Iconos utilizados:
 * - Engranaje (faGear): Acceso a configuración
 * - Gráfico horizontal (faSquarePollHorizontal): Acceso a resultados
 */

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faChartSimple, faSquarePollHorizontal } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/VoteList.css";

/**
 * Componente principal de lista de votaciones administrativas
 */
function VoteObjectAdmin() {
  // NOTA: Datos hardcodeados temporalmente
  // TODO: Obtener del servidor mediante API
  const [items] = useState([
    { id: 1, name: "Option A" },
    { id: 2, name: "Option B" },
    { id: 3, name: "Option C" },
    { id: 4, name: "Option D" }
  ]);
  const navigate = useNavigate();

  // Dividir items en dos columnas para layout
  const half = Math.ceil(items.length / 2);
  const leftColumn = items.slice(0, half);
  const rightColumn = items.slice(half);

  return (
    <div className="voteListContainer">

      {/* Columna izquierda */}
      <div className="column">
        {leftColumn.map((product) => (
          <div key={product.id} className="voteObject">
            <div className="divObj">
              {product.name}
              <div className="botonDiv">
                {/* SETTINGS */}
                <button
                  className="buttonEdit"
                  onClick={() => navigate(`/adminsettings/${product.id}`)}
                  title="Configuración"
                >
                  <FontAwesomeIcon icon={faGear} />
                </button>

                {/* RESULTS */}
                <button
                  className="buttonResult"
                  onClick={() => navigate(`/resultsvoting/${product.id}`)}
                  title="Resultados"
                >
                  <FontAwesomeIcon icon={faSquarePollHorizontal} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Columna derecha */}
      <div className="column">
        {rightColumn.map((product) => (
          <div key={product.id} className="voteObject">
            <div className="divObj">
              {product.name}
              <div className="botonDiv">
                {/* SETTINGS */}
                <button
                  className="buttonEdit"
                  onClick={() => navigate(`/adminsettings/${product.id}`, { replace: true })}
                  title="Configuración"
                >
                  <FontAwesomeIcon icon={faGear} />
                </button>

                {/* RESULTS */}
                <button
                  className="buttonResult"
                  onClick={() => navigate(`/resultsvoting/${product.id}`, { replace: true })}
                  title="Resultados"
                >
                  <FontAwesomeIcon icon={faSquarePollHorizontal} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default VoteObjectAdmin;