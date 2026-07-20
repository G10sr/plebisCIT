import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Footer from "./components/Footer";
import MenuVoting from "./pages/MenuVoting";
import MenuVotingAdmin from "./pages/MenuVotingAdmin";
import Voting from "./pages/Voting";
import VoteComplete from "./pages/Confirm";
import Results from "./pages/Results";
import AdminSettings from "./pages/AdminSettings";
import "./App.css";

// El formato de ventanas es el siguiente:
// import Nombre from "./pages/Nombre"; (Ingresar ubicación del archivo en su respectivo folder)
// <Route path="/nombre" element={<Nombre />} />

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">

        <Header />

        <div className="app-main">
          <Routes>

            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />

            <Route path="/menuvoting" element={<MenuVoting />} />
            <Route path="/vote" element={<Voting />} />
            <Route path="/voteConfirm" element={<VoteComplete />} />

            <Route path="/menuvotingAdmin" element={<MenuVotingAdmin />} />
            <Route path="/adminsettings/:id" element={<AdminSettings />} />
            <Route path="/resultsvoting/:configId" element={<Results />} />

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