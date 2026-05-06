import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import "../assets/css/VoteList.css";
import "../assets/css/VoteListSelected.css";

function VoteObject() {
  const [selectedVoting, setSelectedVoting] = useState(null);
  const [votings, setVotings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const navigate = useNavigate();
  const { state } = useLocation();
  const cedula = state?.cedula;

  useEffect(() => {
    if (!cedula || cedula === "undefined") {
      setVotings([]);
      setIsLoading(false);
      return;
    }

    const fetchVotings = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);

        const res = await fetch(`/api/votings/${cedula}`);

        if (!res.ok) {
          setVotings([]);
          return;
        }

        const data = await res.json();
        setVotings(data);

      } catch (err) {
        console.error(err);
        setLoadError("No se pudieron cargar las votaciones.");
        setVotings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVotings();
  }, [cedula]);

  // 🔥 misma lógica pero más compacta
  const processedVotings = useMemo(() => {
    const now = new Date();

    return votings.map((v) => {
      const start = v.Start_time ? new Date(v.Start_time) : null;
      const end = v.End_time ? new Date(v.End_time) : null;

      const isVigente = [true, "true", 1, "1"].includes(v.Vigente);

      const isDisabled =
        v.hasVoted ||
        (start && now < start) ||
        (end && now > end) ||
        !isVigente;

      let statusLabel = null;
      if (v.hasVoted) statusLabel = "Ya votaste";
      else if (start && now < start) statusLabel = `Comienza ${start.toLocaleString()}`;
      else if (!isVigente) statusLabel = "No vigente";
      else if (end && now > end) statusLabel = "Votación finalizada";

      return {
        ...v,
        isDisabled,
        statusLabel,
        admin:
          v.usrAdmin ||
          v.Admin ||
          v.admin ||
          v.Encargado ||
          v.encargado ||
          "No disponible",
      };
    });
  }, [votings]);

  const handleContinue = () => {
    if (!selectedVoting) return;
    navigate("/vote", { state: { voting: selectedVoting, cedula: cedula }, replace: true });
  };

  if (isLoading) {
    return <p className="noVotings">Cargando...</p>;
  }

  if (!processedVotings.length) {
    return (
      <p className="noVotings">
        {loadError || "No hay votaciones disponibles."}
      </p>
    );
  }

  return (
    <div className="voteListContainer">
      {processedVotings.map((voting) => {
        const isSelected =
          selectedVoting?.Config_ID?.toString() ===
          voting.Config_ID?.toString();

        return (
          <div
            key={voting.Config_ID}
            className={`voteObject ${isSelected ? "selected" : ""} ${
              voting.isDisabled ? "disabled" : ""
            }`}
            onClick={() =>
              !voting.isDisabled && setSelectedVoting(voting)
            }
          >
            <div className="divObj">
              <div className="voteName">{voting.Name}</div>

              <div className="voteAdmin">
                Encargado: {voting.admin}
              </div>

              {voting.statusLabel && (
                <span className="votedBadge">
                  {voting.statusLabel}
                </span>
              )}
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