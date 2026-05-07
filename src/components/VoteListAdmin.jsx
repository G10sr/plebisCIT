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
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../assets/css/VoteList.css";

/**
 * Componente principal de lista de votaciones administrativas
 */
function VoteObjectAdmin() {
  // NOTA: Datos hardcodeados temporalmente
  // TODO: Obtener del servidor mediante API
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  // Dividir items en dos columnas para layout
  const half = Math.ceil(items.length / 2);
  const leftColumn = items.slice(0, half);
  const rightColumn = items.slice(half);


  useEffect(() => {
  const fetchVotings = async () => {
    try {
        const adminUUID = localStorage.getItem("adminUUID");

        if (!adminUUID) {
          navigate("/admin");
          return;
        }

        const response = await fetch(`/api/admin-votings/${adminUUID}`);

        const data = await response.json();

        if (!response.ok) {
          console.error(data.error);
          return;
        }

        setItems(data);

      } catch (err) {
        console.error(err);
      }
    };

    fetchVotings();
  }, []);

  return (
    
    <div className="voteListContainer">

      {/* Columna izquierda */}
      <div className="column">
        {leftColumn.map((product) => (
          <div key={product.Config_ID} className="voteObject">
            <div className="divObj">

              {product.Name}

              <div className="botonDiv">

                <button
                  className="buttonEdit"
                  onClick={() =>
                    navigate(`/adminsettings/${encodeURIComponent(product.Name)}`)
                  }
                >
                  <FontAwesomeIcon icon={faGear} />
                </button>

                <button
                  className="buttonResult"
                  onClick={() =>
                    navigate(`/resultsvoting/${product.Config_ID}`)
                  }
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
          <div key={product.Config_ID} className="voteObject">
            <div className="divObj">

              {product.Name}

              <div className="botonDiv">

                <button
                  className="buttonEdit"
                  onClick={() =>
                    navigate(`/adminsettings/${encodeURIComponent(product.Name)}`)
                  }
                >
                  <FontAwesomeIcon icon={faGear} />
                </button>

                <button
                  className="buttonResult"
                  onClick={() =>
                    navigate(`/resultsvoting/${product.Config_ID}`)
                  }
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