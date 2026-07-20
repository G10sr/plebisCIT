/**
 * PÁGINA: RESULTADOS DE VOTACIÓN
 */

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../assets/css/Results.css"
import GlobalLoader from "../components/GlobalLoader";

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
    return <GlobalLoader show text="Cargando opciones..." />;
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
    <div className="results-page">

      <h1 className="results-title">Resultados</h1>

      {/* GRID */}
      <div className="results-grid">

        {sortedCandidates.map(candidate => (

          <div
            key={candidate.id}
            className="results-card"
            style={{
              backgroundColor: candidate.color || "#1e1e1e"
            }}
            onClick={() => setSelectedCandidate(candidate)}
          >

            <h2>{candidate.name}</h2>

            <p className="results-card-votes">
              {candidate.totalVotes}{" "}
              {candidate.isNegligence ? "personas" : "votos"}
            </p>

          </div>

        ))}

      </div>

      {/* MODAL */}
      {selectedCandidate && (

        <div
          className="results-overlay"
          onClick={() => setSelectedCandidate(null)}
        >

          <div
            className="results-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="results-close-button"
              onClick={() => setSelectedCandidate(null)}
            >
              X
            </button>

            <h2>{selectedCandidate.name}</h2>

            <p>{selectedCandidate.description}</p>

            <h3>
              Total de {selectedCandidate.isNegligence ? "personas" : "votos"}
            </h3>

            <p className="results-vote-count">
              {selectedCandidate.totalVotes}
            </p>

          </div>

        </div>

      )}
      <section id="chartsJS">
        {/* PIE CHART */}
        <div className="results-chart-container">
          <Pie data={chartData} />
        </div>
        {/* BAR CHART */}
        <div className="results-chart-container">
          <Bar data={barData} options={barOptions} />
        </div>
      </section>
      <button onClick={() => window.print()} className="btn results-print-button">
        Crear PDF
      </button>
    </div>
  );
}

export default Results;