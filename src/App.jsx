import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import React, { useEffect } from "react";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Footer from "./components/Footer"; 
import MenuVoting from "./pages/MenuVoting";
import MenuVotingAdmin from "./pages/MenuVotingAdmin";
import Voting from "./pages/Voting";
import AdminSettings from "./pages/AdminSettings";

const CleanHistoryWrapper = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    window.history.replaceState(null, "", window.location.pathname);
  }, [location]);

  return children;
};

function App(){
  return(
    <BrowserRouter>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        
        <Header />

        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={
              <CleanHistoryWrapper>
                <Home />
              </CleanHistoryWrapper>
              }/> 
            <Route path="/admin" element={<Admin/>}/> 
            
            {/* Aplicamos la Opción 2 aquí */}
            <Route 
              path="/menuvoting" 
              element={
                <CleanHistoryWrapper>
                  <MenuVoting />
                </CleanHistoryWrapper>
              }
            /> 
            <Route 
              path="/vote" 
              element={
                <CleanHistoryWrapper>
                  <Voting/>
                </CleanHistoryWrapper>
              }
            /> 
            <Route path="/menuvotingAdmin" element={<MenuVotingAdmin/>}/> 
            <Route path="/adminsettings" element={<AdminSettings/>}/>
            
            {/* Redirección opcional para limpiar el rastro de /home si alguien lo escribe */}
            <Route path="/home" element={<Navigate to="/" replace />} />

            <Route 
              path="/finishvoting" 
              element={
                <CleanHistoryWrapper>
                  <Home />
                </CleanHistoryWrapper>
              }
            /> 
          </Routes>
        </div>

        <Footer />

      </div>
    </BrowserRouter>
  );
}

export default App;