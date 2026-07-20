import React from "react";

export default function GlobalLoader({ show, text = "Procesando..." }) {
  if (!show) return null;

/* Formatos generales */
  
  return (
    <div className="global-loader-overlay">
      <div className="global-loader-card">
        <div className="spinner" />
        <div className="global-loader-text">{text}</div>
      </div>

      <style>{`
        .spinner {
          width: 34px;
          height: 34px;
          border: 3px solid #ddd;
          border-top: 3px solid #6c5ce7;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
