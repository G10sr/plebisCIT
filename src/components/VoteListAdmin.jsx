import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faChartSimple, faSquarePollHorizontal } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/VoteList.css";

function VoteObjectAdmin() {
  const [items] = useState([
    { id: 1, name: "Option A" },
    { id: 2, name: "Option B" },
    { id: 3, name: "Option C" },
    { id: 4, name: "Option D" }
  ]);
  const navigate = useNavigate();

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
                    onClick={() => navigate(`/adminsettings/${product.id}`, {replace: true})}
                    title="Configuración"
                  >
                    <FontAwesomeIcon icon={faGear} />
                  </button>

                  {/* RESULTS */}
                  <button
                    className="buttonResult"
                    onClick={() => navigate(`/resultsvoting/${product.id}`, {replace: true})}
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