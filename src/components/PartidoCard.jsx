import React from "react";


function PartidoCard({ partido, onClick, seleccionado }) {
  return (
    <div
      onClick={onClick}
      style={{
        ...styles.card,
        border: seleccionado ? "3px solid #2f80ed" : "rgb(211, 211, 211)",
      }}
    >
      <div style={styles.content}>
        <div style={styles.textContainer}>
          <h3>{partido.nombre}</h3>
          <p>{partido.descripcionCorta}</p>
        </div>

        <div style={styles.imageContainer}>
          <img src={partido.imagenes[0]} style={styles.image} />
        </div>
      </div>
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
    border: "2px solid #b4b4b4"
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