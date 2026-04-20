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
          : "2px solid rgb(180, 180, 180)",
        ...(esNulo && styles.nullCard),
      }}
    >
      {esNulo ? (
        <h2 style={styles.nullText}>Voto nulo</h2>
      ) : (
        <div style={styles.content}>
          <div style={styles.textContainer}>
            <h3>{partido.nombre}</h3>
            <p>{partido.descripcionCorta}</p>
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
    height: 180,
    cursor: "pointer",
    border: "2px solid #b4b4b4",
  },

  // Extra layout for null vote
  nullCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  nullText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#555",
    textAlign: "center",
  },

  content: {
    display: "flex",
    height: "100%",
  },

  textContainer: {
    flex: 2,
    padding: 16,
  },

  imageContainer: {
    flex: 1,
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