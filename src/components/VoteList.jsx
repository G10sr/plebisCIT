import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../assets/css/VoteList.css";
import "../assets/css/VoteListSelected.css";


function VoteObject() {
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();
  const [items] = useState([
    { id: 1, name: "Option A" },
    { id: 2, name: "Option B" },
    { id: 3, name: "Option C" },
    { id: 4, name: "Option D" },
    
  ]);
  const handleSelect = (id) => {
    setSelectedId(id);
  };

  const half = Math.ceil(items.length / 2);
  const leftColumn = items.slice(0, half);
  const rightColumn = items.slice(half);

  return (
    <div className="voteListContainer">
      
      {/* Columna izquierda */}
      <div className="column">
        {leftColumn.map((product, index) => (
            <div
              key={`${product.id}-${index}`} // temporal si no corriges IDs
              className={`voteObject ${selectedId === product.id ? "selected" : ""}`}
              onClick={() => handleSelect(product.id)}
            >
              <div className="divObj">
                {product.name}
              </div>
            </div>
          ))}
      </div>

      {/* Columna derecha */}
      <div className="column">
        {rightColumn.map((product, index) => (
          <div
            key={`${product.id}-${index}`} // temporal si no corriges IDs
            className={`voteObject ${selectedId === product.id ? "selected" : ""}`}
            onClick={() => handleSelect(product.id)}
          >
            <div className="divObj">
              {product.name}
            </div>
          </div>
        ))}
      </div>
      <button 
        className="enterVoteBtn"
        disabled={!selectedId}
        onClick={() => navigate("/vote", { replace: true })}
        >
        VOTE NOW
      </button>
    </div>
  );
}

export default VoteObject;