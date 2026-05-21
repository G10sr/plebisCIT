/**
 * PÁGINA: RESULTADOS DE VOTACIÓN
 */

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Results() {

  const { configId } = useParams();

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {

    async function loadResults() {

      try {

        // NUEVO ENDPOINT
        const res = await fetch(
          `http://localhost:3001/api/voting-results/${configId}`
        );

        const data = await res.json();

        console.log(data);

        setCandidates(data.candidates || []);

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);

      }
    }

    loadResults();

  }, [configId]);

  if (loading) {
    return <h1>Cargando...</h1>;
  }

  return (
    <div style={styles.container}>

      <h1>Resultados</h1>

      {/* GRID */}
      <div style={styles.grid}>

        {candidates.map(candidate => (

          <div
            key={candidate.id}
            style={{
              ...styles.card,
              background: candidate.color || "#1e1e1e"
            }}
            onClick={() => setSelectedCandidate(candidate)}
          >

            <h2>{candidate.name}</h2>

            <p style={styles.cardVotes}>
              {candidate.totalVotes} votos
            </p>

          </div>

        ))}

      </div>

      {/* MODAL */}
      {selectedCandidate && (

        <div
          style={styles.overlay}
          onClick={() => setSelectedCandidate(null)}
        >

          <div
            style={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >

            <button
              style={styles.closeButton}
              onClick={() => setSelectedCandidate(null)}
            >
              X
            </button>

            <h2>{selectedCandidate.name}</h2>

            <p>{selectedCandidate.description}</p>

            <h3>Total de votos</h3>

            <p style={styles.voteCount}>
              {selectedCandidate.totalVotes}
            </p>

          </div>

        </div>

      )}

    </div>
  );
}

const styles = {

  container: {
    padding: "40px",
    textAlign: "center",
    minHeight: "100vh",
    background: "#121212",
    color: "white",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginTop: "30px",
  },

  card: {
    padding: "30px",
    borderRadius: "15px",
    cursor: "pointer",
    transition: "0.3s",
    color: "white",
    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
  },

  cardVotes: {
    marginTop: "10px",
    fontSize: "20px",
    fontWeight: "bold",
  },

  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  modal: {
    background: "white",
    color: "black",
    padding: "30px",
    borderRadius: "20px",
    width: "80%",
    maxWidth: "600px",
    position: "relative",
  },

  closeButton: {
    position: "absolute",
    top: "15px",
    right: "15px",
    border: "none",
    background: "red",
    color: "white",
    borderRadius: "50%",
    width: "35px",
    height: "35px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  voteCount: {
    fontSize: "50px",
    fontWeight: "bold",
    marginTop: "20px",
  },

};

export default Results;