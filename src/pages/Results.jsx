/**
 * PÁGINA: RESULTADOS DE VOTACIÓN
 *
 * Obtiene y muestra:
 * - Candidatos
 * - Modal individual por candidato
 */

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Results() {

  const { id } = useParams();

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal seleccionado
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {

    async function loadCandidates() {

      try {

        // Obtener configuración
        const votingRes = await fetch(
          `http://localhost:3001/api/voting-config/${id}`
        );

        const votingData = await votingRes.json();

        // Obtener candidatos
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
    <div style={styles.container}>

      <h1>Resultados</h1>

      {/* LISTA DE CANDIDATOS */}
      <div style={styles.grid}>

        {candidates.map(candidate => (

          <div
            key={candidate.id}
            style={styles.card}
            onClick={() => setSelectedCandidate(candidate)}
          >

            <h2>{candidate.name}</h2>

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

            {/* IMÁGENES */}
            <div style={styles.imagesContainer}>

              {selectedCandidate.images?.map((img, index) => (

                <img
                  key={index}
                  src={img}
                  alt={selectedCandidate.name}
                  style={styles.image}
                />

              ))}

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

/* ESTILOS */

const styles = {

  container: {
    padding: "40px",
    textAlign: "center",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginTop: "30px",
  },

  card: {
    background: "#1e1e1e",
    color: "white",
    padding: "30px",
    borderRadius: "15px",
    cursor: "pointer",
    transition: "0.3s",
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
  },

  imagesContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "10px",
    marginTop: "20px",
  },

  image: {
    width: "150px",
    borderRadius: "10px",
  },

};

export default Results;