import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import React from "react";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Footer from "./components/Footer"; 

function App(){
  return(
    <BrowserRouter>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        
        <Header />

        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home/>}/> 
            <Route path="/admin" element={<Admin/>}/> 
          </Routes>
        </div>

        <Footer />

      </div>
    </BrowserRouter>
  );
}

export default App;