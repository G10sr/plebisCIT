import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import React from "react";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Admin from "./pages/Admin"

function App(){
  return(
    <BrowserRouter>
    <Header></Header>
      <Routes>
          <Route path="/" element={<Home/>}/> 
          <Route path="/admin" element={<Admin/>}/> 
      </Routes>
    <Footer></Footer>
    </BrowserRouter>
  );
}

export default App;