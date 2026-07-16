import React, { useState } from "react";
import "../assets/css/PartidoCard.css";

/**
 * COMPONENTE: TARJETA DE OPCIÓN
 */
function PartidoCard({ partido, onClick, seleccionado }) {

  const esNulo = partido.id === 0;

  const [imagenFallida, setImagenFallida] = useState(false);

  const tieneImagen = partido.imagenes?.length > 0;


  return (
    <div
      onClick={onClick}
      className={`partido-card${esNulo ? " partido-card--nulo" : ""}`}
      style={{
        border: seleccionado
          ? `7px solid ${partido.color || "#2f80ed"}`
          : esNulo
            ? "3px dashed #4d4d4d"
            : "2px solid rgb(180, 180, 180)",
      }}
    >

      {esNulo ? (

        <h2 className="partido-card__null-text">
          Voto nulo
        </h2>

      ) : (

        <div className="partido-card__content">

          <div className="partido-card__text-container">
            <h3 className="partido-card__title">
              {partido.nombre}
            </h3>

            <p className="partido-card__description">
              {partido.descripcionCorta}
            </p>
          </div>


          <div
            className="partido-card__image-container"
            style={{
              backgroundColor:
                !tieneImagen || imagenFallida
                  ? partido.color || "#9ecbff"
                  : "transparent",
            }}
          >

            {tieneImagen && !imagenFallida && (

              <img
                src={partido.imagenes[0]}
                alt={partido.nombre}
                className="partido-card__image"
                onError={() => setImagenFallida(true)}
              />

            )}

          </div>

        </div>

      )}

    </div>
  );
}

export default PartidoCard;