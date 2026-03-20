import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import React from "react";
import Home from "./pages/Home";
<<<<<<< HEAD
import Footer from "./components/Footer"; 
=======
import Footer from "./components/Footer";
import Admin from "./pages/Admin"
>>>>>>> 862d103ea35a2bc40d1a47d7be36e17c515cf42f

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