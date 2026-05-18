/**
 * PÁGINA: RESULTADOS DE VOTACIÓN
 *
 * Obtiene y muestra:
 * - Total de votantes
 * - Total de votos emitidos
 * - Porcentaje de participación
 * - Resultados por opción
 * - Lista de votantes
 *
 * Requiere una ruta tipo:
 * /results/:configId
 */

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Results() {

  const { id } = useParams();

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function loadCandidates() {

      try {

        // 1. Obtener nombre de votación usando el ID
        const votingRes = await fetch(
          `http://localhost:3001/api/voting-config/${id}`
        );

        const votingData = await votingRes.json();

        // votingData.Name -> "VotacionesRonald"

        // 2. Obtener candidatos
        const candidatesRes = await fetch(
          `http://localhost:3001/api/voting-options/${votingData.Name}`
        );

        const candidatesData = await candidatesRes.json();

        setCandidates(candidatesData);

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);

      }
    }

    loadCandidates();

  }, [id]);

  if (loading) {
    return <h1>Cargando...</h1>;
  }

  return (
    <div>

      <h1>Resultados</h1>

      <div className="modal">

        {candidates.map(candidate => (

          <div key={candidate.id}>

            <h2>{candidate.name}</h2>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Results;