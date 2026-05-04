import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "../assets/css/VoteList.css";
import "../assets/css/VoteListSelected.css";

function VoteObject() {
  const [selectedVoting, setSelectedVoting] = useState(null);
  const [votings, setVotings] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const cedula = location.state?.cedula;

  useEffect(() => {
    const fetchVotings = async () => {
      if (!cedula) return;
      try {
        const res = await fetch(`/api/votings/${cedula}`);
        const data = await res.json();
        console.log("Datos recibidos del backend:", data); // Revisa esto en la consola del navegador
        setVotings(data);
      } catch (err) {
        console.error("Error cargando votaciones:", err);
        setVotings([]);
      }
    };
    fetchVotings();
  }, [cedula]);

  const handleSelect = (voting) => {
    if (voting.hasVoted) return; 
    setSelectedVoting(voting);
  };

  const handleContinue = () => {
    if (!selectedVoting) return;
    navigate("/vote", {
      state: { voting: selectedVoting }
    }, { replace: true });
  };

  if (!votings.length) {
    return <p className="noVotings">No tienes votaciones disponibles.</p>;
  }

  return (
    <div className="voteListContainer">
      {votings.map((voting) => {
        // Forzamos que ambos sean string para evitar que "1" !== 1
        const isSelected = selectedVoting?.Config_ID?.toString() === voting.Config_ID?.toString();
        
        return (
          <div
            key={voting.Config_ID}
            className={`voteObject ${isSelected ? "selected" : ""} ${voting.hasVoted ? "disabled" : ""}`}
            onClick={() => handleSelect(voting)}
          >
            <div className="divObj">
              {voting.Name}
              {voting.hasVoted && <span className="votedBadge"> (Ya votaste)</span>}
            </div>
          </div>
        );
      })}

      <button
        className="enterVoteBtn"
        disabled={!selectedVoting}
        onClick={handleContinue}
      >
        VOTAR AHORA
      </button>
    </div>
  );
}

export default VoteObject;