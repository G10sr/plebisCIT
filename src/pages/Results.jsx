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

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Results() {
   const navigate = useNavigate();
   const { configId } = useParams();

   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");

   const [resultsData, setResultsData] = useState(null);

   useEffect(() => {
      if (!localStorage.getItem("adminUUID")) {
         navigate("/admin", { replace: true });
      }
   }, [navigate]);

   useEffect(() => {
      async function fetchResults() {
         try {
            setLoading(true);

            const response = await fetch(
               `http://localhost:3001/api/voting-results/${configId}`
            );

            const data = await response.json();

            if (!response.ok) {
               throw new Error(data.error || "Error cargando resultados");
            }

            setResultsData(data);

         } catch (err) {
            console.error(err);
            setError(err.message);
         } finally {
            setLoading(false);
         }
      }

      if (configId) {
         fetchResults();
      }

   }, [configId]);

   /**
    * CONTAR VOTOS POR OPCIÓN
    */
   const voteStats = useMemo(() => {
      if (!resultsData?.results) return [];

      const stats = {};

      resultsData.results.forEach(voter => {

         if (!voter.hasVoted) return;

         const option = voter.selectedOption || "Sin opción";

         if (!stats[option]) {
            stats[option] = {
               name: option,
               votes: 0,
               color: voter.optionColor || "#999"
            };
         }

         stats[option].votes += 1;
      });

      return Object.values(stats).sort((a, b) => b.votes - a.votes);

   }, [resultsData]);

   /**
    * PORCENTAJE DE PARTICIPACIÓN
    */
   const participation = useMemo(() => {
      if (!resultsData) return 0;

      if (resultsData.totalUsers === 0) return 0;

      return (
         (resultsData.totalVotes / resultsData.totalUsers) * 100
      ).toFixed(1);

   }, [resultsData]);

   if (loading) {
      return (
         <section className="results-page">
            <h2>Cargando resultados...</h2>
         </section>
      );
   }

   if (error) {
      return (
         <section className="results-page">
            <h2>Error</h2>
            <p>{error}</p>
         </section>
      );
   }

   return (
      <section className="results-page">

         <h1>
            Resultados: {resultsData?.votingName}
         </h1>

         {/* ─────────────────────────────
            ESTADÍSTICAS GENERALES
         ───────────────────────────── */}

         <div className="results-stats">

            <div className="stat-card">
               <h3>Total usuarios</h3>
               <p>{resultsData?.totalUsers}</p>
            </div>

            <div className="stat-card">
               <h3>Total votos</h3>
               <p>{resultsData?.totalVotes}</p>
            </div>

            <div className="stat-card">
               <h3>Participación</h3>
               <p>{participation}%</p>
            </div>

         </div>

         {/* ─────────────────────────────
            RESULTADOS POR OPCIÓN
         ───────────────────────────── */}

         <div className="results-options">

            <h2>Resultados</h2>

            {voteStats.length === 0 && (
               <p>No hay votos registrados.</p>
            )}

            {voteStats.map(option => {

               const percentage = (
                  (option.votes / resultsData.totalVotes) * 100
               ).toFixed(1);

               return (
                  <div
                     key={option.name}
                     className="result-option"
                  >

                     <div className="result-header">
                        <h3>{option.name}</h3>

                        <span>
                           {option.votes} votos ({percentage}%)
                        </span>
                     </div>

                     <div className="progress-bar">
                        <div
                           className="progress-fill"
                           style={{
                              width: `${percentage}%`,
                              background: option.color
                           }}
                        />
                     </div>

                  </div>
               );
            })}

         </div>

         {/* ─────────────────────────────
            TABLA DE VOTANTES
         ───────────────────────────── */}

         <div className="results-table">

            <h2>Votantes</h2>

            <table>
               <thead>
                  <tr>
                     <th>Cédula</th>
                     <th>Nombre</th>
                     <th>Grado</th>
                     <th>Votó</th>
                     <th>Opción</th>
                  </tr>
               </thead>

               <tbody>

                  {resultsData?.results.map(voter => (
                     <tr key={voter.cedula}>

                        <td>{voter.cedula}</td>

                        <td>{voter.nombre}</td>

                        <td>{voter.grado}</td>

                        <td>
                           {voter.hasVoted
                              ? "Sí"
                              : "No"}
                        </td>

                        <td>
                           {voter.hasVoted
                              ? voter.selectedOption
                              : "-"}
                        </td>

                     </tr>
                  ))}

               </tbody>
            </table>

         </div>

      </section>
   );
}

export default Results;