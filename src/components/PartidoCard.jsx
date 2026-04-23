import React from "react";

function PartidoCard({ partido, onClick, seleccionado }) {
  const esNulo = partido.id === 0;

  return (
    <div
      onClick={onClick}
      style={{
        ...styles.card,

        border: seleccionado
          ? "3px solid #2f80ed"
          : esNulo
          ? "3px dashed #4d4d4d"
          : "2px solid rgb(180, 180, 180)",

        backgroundColor: esNulo ? "#adadad" : "#fff",

        ...(esNulo && styles.nullCard),
      }}
    >
      {esNulo ? (
        <h2 style={styles.nullText}>Voto nulo</h2>
      ) : (
        <div style={styles.content}>
          <div style={styles.textContainer}>
            <h3 style={styles.title}>{partido.nombre}</h3>
            <p style={styles.description}>{partido.descripcionCorta}</p>
          </div>

          <div style={styles.imageContainer}>
            <img
              src={partido.imagenes?.[0]}
              alt={partido.nombre}
              style={styles.image}
            />
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    width: "100%",
    height: 240, // ⬅️ más grande
    cursor: "pointer",
    border: "2px solid #b4b4b4",
    transition: "all 0.2s ease", // ⬅️ animación suave
  },

  nullCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  nullText: {
    fontSize: 30, // ⬅️ más grande
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
  },

  content: {
    display: "flex",
    height: "100%",
  },

  textContainer: {
    flex: 1.5,
    padding: 20, // ⬅️ más espacio interno
  },

  title: {
    fontSize: 20,
    marginBottom: 8,
  },

  description: {
    fontSize: 16,
    lineHeight: 1.4,
  },

  imageContainer: {
    flex: 1.5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
};

export default PartidoCard;