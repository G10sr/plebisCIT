import express from "express";
import cors from "cors";
import postgres from "postgres";
import "dotenv/config";

/**
 * SISTEMA DE VOTACIÓN - BACKEND
 * 
 * API REST que maneja:
 * - Obtención de votaciones disponibles para un usuario
 * - Carga de opciones de votación
 * - Registro de votos en la base de datos
 */

// Inicializar conexión a PostgreSQL
const sql = postgres(process.env.DATABASE_URL);
const app = express();

// Middleware para CORS y parseo de JSON
app.use(cors());
app.use(express.json());

/**
 * GET /api/votings/:cedula
 * 
 * Obtiene la lista de votaciones disponibles para un usuario específico.
 * Verifica que:
 * - La votación no esté oculta (Oculto = false)
 * - El usuario existe en esa votación (está registrado)
 * 
 * @param {string} cedula - Número de cédula del usuario
 * @returns {Array} Lista de votaciones disponibles con sus detalles
 */
app.get("/api/votings/:cedula", async (req, res) => {
  const { cedula } = req.params;

  try {
    // Obtener todas las configuraciones de votación que no están ocultas
    const votingsConfig = await sql`
      SELECT * FROM "Votings_Config"
      WHERE "Oculto" = false
    `;

    const votings = [];

    // Procesar cada votación disponible
    for (const voting of votingsConfig) {
      const configId = voting.Config_ID || voting.config_id;
      const name = voting.Name || voting.name;
      const adminUuid =
        voting.usrAdmin ||
        voting.usradmin ||
        voting.Admin ||
        voting.admin ||
        null;

      // Buscar el nombre real del administrador en la tabla adminAccount
      let adminName = "No disponible";
      if (adminUuid) {
        try {
          const adminData = await sql`
            SELECT "name_admin" FROM "adminAccount"
            WHERE "ID" = ${adminUuid}
          `;
          if (adminData.length > 0) {
            adminName = adminData[0].name_admin;
          }
        } catch (err) {
          console.warn("Error obteniendo nombre del admin:", err);
        }
      }

      // Nombres dinámicos de tablas según el nombre de votación
      const dataTable = `Vote_${name}_Data`;
      const optionsTable = `Vote_${name}_Options`;

      let userData;

      // Validar que el usuario existe en esta votación específica
      // Si no existe en la tabla de datos, omitir esta votación
      try {
        userData = await sql`
          SELECT hasvoted FROM ${sql(dataTable)}
          WHERE "ced" = ${cedula}
        `;

        if (userData.length === 0) {
          continue; // Usuario no está registrado en esta votación
        }
      } catch (err) {
        console.warn(`Tabla no válida: ${dataTable}`);
        continue;
      }

      // Obtener estado de voto del usuario
      const hasVoted = !!userData[0].hasvoted;

      // Cargar opciones de votación disponibles
      let options = [];
      try {
        const optionsData = await sql`
          SELECT "Name" FROM ${sql(optionsTable)}
          ORDER BY "ID" ASC
        `;
        options = optionsData.map(o => o.Name || o.name);
      } catch {
        options = ["Opción A", "Opción B"]; // Fallback si hay error
      }

      // Agregar votación al resultado final
      votings.push({
        Config_ID: configId,
        Name: name,
        adminName: adminName,
        options,
        hasVoted,
        Start_time: voting.Start_time ?? voting.start_time ?? null,
        End_time: voting.End_time ?? voting.end_time ?? null,
        Vigente: voting.Vigente ?? voting.vigente,
      });
    }

    res.json(votings);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
});

/**
 * GET /api/voting-options/:votingName
 * 
 * Obtiene todas las opciones disponibles para una votación específica.
 * Incluye: nombre, descripción, imágenes y color de cada opción.
 * 
 * @param {string} votingName - Nombre de la votación
 * @returns {Array} Lista de opciones con todos sus detalles
 */


app.get("/api/voting-options/:votingName", async (req, res) => {
  const { votingName } = req.params;

  try {
    const optionsTable = `Vote_${votingName}_Options`;

    // Obtener todas las opciones ordenadas por ID
    const optionsData = await sql`
      SELECT * FROM ${sql(optionsTable)}
      ORDER BY "ID" ASC
    `;

    // Transformar datos con fallbacks para diferentes variantes de nombres de columnas
    const options = optionsData.map((opt) => ({
      id: opt.ID || opt.id,
      Name: opt.Name || opt.name,
      Des: opt.Des || opt.des || "",
      Img1: opt.Img1 || opt.img1 || null,
      Img2: opt.Img2 || opt.img2 || null,
      Img3: opt.Img3 || opt.img3 || null,
      Img4: opt.Img4 || opt.img4 || null,
      Img5: opt.Img5 || opt.img5 || null,
      Color: opt.Color || opt.color || "#9ecbff",
    }));

    res.json(options);
  } catch (err) {
    console.error(`Error obteniendo opciones de ${votingName}:`, err.message);
    res.status(500).json({
      error: `No se pudieron cargar las opciones para ${votingName}`,
      message: err.message,
    });
  }
});

/**
 * POST /api/vote
 * 
 * Registra el voto de un usuario en la base de datos.
 * Actualiza:
 * - option_id: ID de la opción seleccionada
 * - hasvoted: Marca el usuario como que ya votó
 * 
 * @param {string} cedula - Número de cédula del votante
 * @param {string} votingName - Nombre de la votación
 * @param {number} optionId - ID de la opción seleccionada
 * @returns {Object} Confirmación del registro exitoso o error
 */

app.post("/api/vote", async (req, res) => {
  const { cedula, votingName, optionId } = req.body;

  // Validar que todos los datos requeridos estén presentes
  if (!cedula || !votingName || optionId === undefined) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  try {
    const dataTable = `Vote_${votingName}_Data`;

    // Actualizar el registro del usuario con su voto
    const result = await sql`
      UPDATE ${sql(dataTable)}
      SET "option_id" = ${optionId}, "hasvoted" = true
      WHERE "ced" = ${cedula}
      RETURNING *
    `;

    // Verificar si el usuario fue encontrado y actualizado
    if (result.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado en esta votación" });
    }

    res.json({ success: true, message: "Voto registrado correctamente" });
  } catch (err) {
    console.error("Error registrando voto:", err.message);
    res.status(500).json({ error: "Error registrando el voto" });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 http://localhost:${PORT}`);
});