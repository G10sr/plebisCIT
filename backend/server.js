import express from "express";
import cors from "cors";
import postgres from "postgres";
import "dotenv/config";

const sql = postgres(process.env.DATABASE_URL);
const app = express();

app.use(cors());
app.use(express.json());

/* =============================================
   ENDPOINT: OBTENER VOTACIONES POR CÉDULA
   ============================================= */
app.get("/api/votings/:cedula", async (req, res) => {
  const { cedula } = req.params;

  try {
    // 1. Obtener todas las votaciones activas y no ocultas
    // Usamos comillas dobles en el SELECT si los nombres en la DB tienen mayúsculas
    const votingsConfig = await sql`
      SELECT * FROM "Votings_Config"
      WHERE "Oculto" = false AND "Vigente" = true
    `;

    const votings = [];

    // Usamos un bucle for...of para manejar las consultas asíncronas secuencialmente
    for (const voting of votingsConfig) {
      // Postgres a veces devuelve las llaves en minúsculas si no se definieron con ""
      // Normalizamos el ID para el frontend
      const currentConfigId = voting.Config_ID || voting.config_id;
      const currentName = voting.Name || voting.name;

      const dataTableName = `Vote_${currentName}_Data`;
      const optionsTableName = `Vote_${currentName}_Options`;

      // 2. Verificar si el usuario ya votó
      let hasVoted = false;
      try {
        const userData = await sql`
          SELECT hasvoted FROM ${sql(dataTableName)}
          WHERE "ced" = ${cedula}
        `;
        if (userData.length > 0) {
          // Algunos drivers devuelven booleanos o 1/0, nos aseguramos de que sea booleano
          hasVoted = !!userData[0].hasvoted;
        }
      } catch (err) {
        console.error(`Error consultando tabla de datos ${dataTableName}:`, err.message);
      }

      // 3. Obtener opciones de la votación
      let options = ["Opción A", "Opción B", "Opción C", "Opción D"];
      try {
        const optionsData = await sql`
          SELECT "Name" FROM ${sql(optionsTableName)}
          ORDER BY "ID" ASC
        `;
        if (optionsData.length > 0) {
          options = optionsData.map(o => o.Name || o.name);
        }
      } catch (err) {
        console.warn(`Usando opciones por defecto para: ${currentName}`);
      }

      // 4. Construir el objeto final con el nombre exacto de las llaves para el Frontend
      votings.push({
        Config_ID: currentConfigId, // Crucial para evitar el error de "todos seleccionados"
        Name: currentName,
        options: options,
        hasVoted: hasVoted,
        Oculto: voting.Oculto || voting.oculto,
        Vigente: voting.Vigente || voting.vigente
      });
    }

    // Enviamos la respuesta al cliente
    res.json(votings);

  } catch (err) {
    console.error("Error crítico en el backend:", err);
    res.status(500).json({ 
      error: "Error interno del servidor al procesar votaciones",
      message: err.message 
    });
  }
});

/* =============================================
   INICIO DEL SERVIDOR
   ============================================= */
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor funcionando en http://localhost:${PORT}`);
});