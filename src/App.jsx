import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Footer from "./components/Footer";
import MenuVoting from "./pages/MenuVoting";
import MenuVotingAdmin from "./pages/MenuVotingAdmin";
import Voting from "./pages/Voting";
import VoteComplete from "./pages/Confirm";
import ResultsVotings from "./pages/Results";
import AdminSettings from "./pages/AdminSettings";

/**
 * COMPONENTE RAÍZ: APP
 * 
 * Estructura principal de la aplicación con enrutamiento.
 * 
 * Rutas públicas (Usuario):
 * - / : Página de inicio con entrada de cédula
 * - /menuvoting : Lista de votaciones disponibles
 * - /vote : Página de votación
 * - /voteConfirm : Confirmación de voto registrado
 * 
 * Rutas administrativas:
 * - /admin : Panel de administración
 * - /menuvotingAdmin : Lista de votaciones para administrador
 * - /adminsettings/:id : Configuración de votación
 * - /resultsvoting/:id : Resultados de votación
 */
function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>

        <Header />

        <div style={{ flex: 1 }}>
          <Routes>

            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />

            <Route path="/menuvoting" element={<MenuVoting />} />
            <Route path="/vote" element={<Voting />} />
            <Route path="/voteConfirm" element={<VoteComplete />} />

            <Route path="/menuvotingAdmin" element={<MenuVotingAdmin />} />
            <Route path="/adminsettings/:id" element={<AdminSettings />} />
            <Route path="/resultsvoting/:id" element={<ResultsVotings />} />

            {/* Redirecciones */}
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/finishvoting" element={<Navigate to="/" replace />} />

            {/* fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </div>

        <Footer />

      </div>
    </BrowserRouter>
  );
}

export default App;