/**
 * PÁGINA: RESULTADOS DE VOTACIÓN
 * 
 * Muestra los resultados finales de una votación específica.
 * Acceso exclusivo para administradores.
 * 
 * ESTADO: En desarrollo
 * - Componente vacío
 * - Requiere: Obtener datos de votación desde parámetro :id
 * - Requiere: Graficar resultados (gráficos, porcentajes, etc.)
 * - Requiere: Mostrar estadísticas de participación
 */

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Results() {
   const navigate = useNavigate();

   useEffect(() => {
      if (!localStorage.getItem("adminUUID")) {
         navigate("/admin", { replace: true });
      }
   }, [navigate]);

   return (
      <section>

      </section>
   )
}
export default Results;