import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import "../assets/css/VoteList.css";
import "../assets/css/VoteListSelected.css";

/**
 * COMPONENTE: LISTA DE VOTACIONES
 * 
 * Muestra todas las votaciones disponibles para un usuario específico.
 * Permite:
 * - Ver todas las votaciones registradas para la cédula
 * - Seleccionar una votación
 * - Navegar a la página de votación con los datos necesarios
 * 
 * Estados de votación:
 * - "Ya votaste": El usuario ya participó en esta votación
 * - "Comienza [fecha]": La votación aún no ha comenzado
 * - "No vigente": La votación ha sido desactivada
 * - "Votación finalizada": El período de votación ha terminado
 */
function VoteObject() {
  // Estado de la votación seleccionada
  const [selectedVoting, setSelectedVoting] = useState(null);
  
  // Lista de votaciones obtenidas del servidor
  const [votings, setVotings] = useState([]);
  
  // Estados de carga y errores
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Router hooks
  const navigate = useNavigate();
  const { state } = useLocation();
  const cedula = state?.cedula;

  /**
   * Effect: Cargar votaciones disponibles para el usuario
   * 
   * Se ejecuta cuando:
   * - Cédula cambia
   * - Componente se monta
   * 
   * Valida:
   * - Que la cédula esté presente y sea válida
   * - Realiza fetch a /api/votings/:cedula
   */
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

  /**
   * Memo: Procesar votaciones con lógica de estado
   * 
   * Determina:
   * - Si la votación está habilitada o deshabilitada
   * - Estado actual (ya votó, no ha comenzado, finalizada, etc.)
   * - Mensaje a mostrar al usuario
   * 
   * Una votación está deshabilitada si:
   * - El usuario ya votó
   * - Aún no ha comenzado
   * - Ya finalizó el período
   * - No está vigente
   */
  const processedVotings = useMemo(() => {
    const now = new Date();

    return votings.map((v) => {
      // Convertir timestamps a objetos Date
      const start = v.Start_time ? new Date(v.Start_time) : null;
      const end = v.End_time ? new Date(v.End_time) : null;

      // Validar si la votación sigue activa
      const isVigente = [true, "true", 1, "1"].includes(v.Vigente);

      // Determinar si la votación está deshabilitada para este usuario
      const isDisabled =
        v.hasVoted ||
        (start && now < start) ||
        (end && now > end) ||
        !isVigente;

      // Generar mensaje de estado para mostrar al usuario
      let statusLabel = null;
      if (v.hasVoted) statusLabel = "Ya votaste";
      else if (start && now < start) statusLabel = `Comienza ${start.toLocaleString()}`;
      else if (!isVigente) statusLabel = "No vigente";
      else if (end && now > end) statusLabel = "Votación finalizada";

      return {
        ...v,
        isDisabled,
        statusLabel,
        // Obtener nombre del administrador con fallbacks
        admin:
          v.adminName ||
          v.usrAdmin ||
          v.Admin ||
          v.admin ||
          v.Encargado ||
          v.encargado ||
          "No disponible",
      };
    });
  }, [votings]);

  /**
   * Navegar a la página de votación
   * Pasa:
   * - voting: Objeto completo de la votación seleccionada
   * - cedula: Número de cédula del usuario
   */
  const handleContinue = () => {
    if (!selectedVoting) return;
    navigate("/vote", { state: { voting: selectedVoting, cedula: cedula }, replace: true });
  };

  // Mostrar estado de carga
  if (isLoading) {
    return <p className="noVotings">Cargando...</p>;
  }

  // Mostrar mensaje si no hay votaciones disponibles
  if (!processedVotings.length) {
    return (
      <p className="noVotings">
        {loadError || "No hay votaciones disponibles."}
      </p>
    );
  }

  return (
    <div className="voteListContainer">
      {/* Renderizar cada votación disponible */}
      {processedVotings.map((voting) => {
        const isSelected =
          selectedVoting?.Config_ID?.toString() ===
          voting.Config_ID?.toString();

        return (
          <div
            key={voting.Config_ID}
            className={`voteObject ${isSelected ? "selected" : ""} ${voting.isDisabled ? "disabled" : ""
              }`}
            onClick={() =>
              !voting.isDisabled && setSelectedVoting(voting)
            }
          >
            {/* Contenido de la tarjeta de votación */}
            <div className="divObj">
              {/* Nombre de la votación */}
              <div className="voteName">{voting.Name}</div>

              {/* Nombre del administrador encargado */}
              <div className="voteAdmin">
                Encargado: {voting.admin}
              </div>

              {/* Mostrar badge de estado si aplica */}
              {voting.statusLabel && (
                <span className="votedBadge">
                  {voting.statusLabel}
                </span>
              )}
            </div>
          </div>
        );
      })}

      {/* Botón fijo para continuar a votación */}
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