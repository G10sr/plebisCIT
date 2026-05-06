/**
 * PUNTO DE ENTRADA: MAIN.JSX
 * 
 * Archivo principal de React que monta la aplicación.
 * 
 * Proceso:
 * 1. Importa el componente raíz App
 * 2. Importa los estilos globales (index.css)
 * 3. Monta la aplicación en el elemento DOM con id="root"
 * 4. Usa React.StrictMode para detectar problemas en desarrollo
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Montar la aplicación en el DOM
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);