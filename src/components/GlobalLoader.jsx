import React from "react";

export default function GlobalLoader({ show, text = "Procesando..." }) {
  if (!show) return null;

/* Formatos generales */
  
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.35)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      backdropFilter: "blur(4px)"
    }}>
      <div style={{
        background: "white",
        padding: "24px 28px",
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
      }}>
        <div className="spinner" />
        <div style={{ fontSize: 14, color: "#333" }}>{text}</div>
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
