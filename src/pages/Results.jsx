/**
 * PÁGINA: RESULTADOS DE VOTACIÓN
 */

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../assets/css/Results.css"

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function Results() {

  const { configId } = useParams();

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {

    async function loadResults() {
      try {
        const res = await fetch(
          `http://localhost:3001/api/voting-results/${configId}`
        );

        const data = await res.json();

        setCandidates(data.candidates || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    // carga inicial inmediata
    loadResults();

    // actualizar cada 6 segundos
    const interval = setInterval(() => {
      loadResults();
    }, 6000);

    // cleanup cuando el componente se desmonta
    return () => clearInterval(interval);

  }, [configId]);

  if (loading) {
    return <h1>Cargando...</h1>;
  }
  // ORDENAR: voto nulo y abstinencia al final
  const sortedCandidates = [...candidates].sort((a, b) => {

    const special = ["voto nulo", "abstencionismo"];

    const aSpecial =
      special.includes(a.name.toLowerCase());

    const bSpecial =
      special.includes(b.name.toLowerCase());

    // ambos especiales
    if (aSpecial && bSpecial) return 0;

    // a especial => va después
    if (aSpecial) return 1;

    // b especial => va después
    if (bSpecial) return -1;

    return 0;
  });
  // DATOS DEL PIE CHART
  const chartData = {
    labels: sortedCandidates.map(c => c.name),

    datasets: [
      {
        id: 1,
        label: "Votos",
        data: sortedCandidates.map(c => c.totalVotes),
        backgroundColor: sortedCandidates.map(
          c => c.color || "#8884d8"
        ),
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const barData = {
    labels: sortedCandidates.map(c => c.name),

    datasets: [
      {
        label: "Votos",
        data: sortedCandidates.map(c => c.totalVotes),
        backgroundColor: sortedCandidates.map(
          c => c.color || "#8884d8"
        ),
        borderColor: "#ffffff",
        borderWidth: 1,
      },
    ],
  };
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };
  return (
    <div style={styles.container}>

      <h1 style={{ color: "black" }}>Resultados</h1>

      {/* GRID */}
      <div style={styles.grid}>

        {sortedCandidates.map(candidate => (

          <div
            key={candidate.id}
            style={{
              ...styles.card,
              backgroundColor: candidate.color || "#1e1e1e"
            }}
            onClick={() => setSelectedCandidate(candidate)}
          >

            <h2>{candidate.name}</h2>

            <p style={styles.cardVotes}>
              {candidate.totalVotes}{" "}
              {candidate.isNegligence ? "personas" : "votos"}
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

            <h3>
              Total de {selectedCandidate.isNegligence ? "personas" : "votos"}
            </h3>

            <p style={styles.voteCount}>
              {selectedCandidate.totalVotes}
            </p>

          </div>

        </div>

      )}
      <section id="chartsJS">
        {/* PIE CHART */}
        <div style={styles.chartContainer}>
          <Pie data={chartData} />
        </div>
        {/* BAR CHART */}
        <div style={styles.chartContainer}>
          <Bar data={barData} options={barOptions} />
        </div>
      </section>
      <button style={styles.button} onClick={() => window.print()} className="btn">
        Crear PDF
      </button>
    </div>
  );
}

const styles = {

  container: {
    padding: "40px",
    textAlign: "center",
    minHeight: "100vh",
    color: "white",
  },
  chartContainer: {
    width: "400px",
    margin: "0 auto 40px auto",
    background: "white",
    padding: "20px",
    borderRadius: "20px",
    marginTop: "10vh"
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
  button: {
    background: "var(--C-blue)",
    border: "none",
    cursor: "pointer",
    color: "white",
    minWidth: "120px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    borderRadius: "10px",
    justifyContent: "center",
  }
};

export default Results;