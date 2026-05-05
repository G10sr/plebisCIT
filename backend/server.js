import express from "express";
import cors from "cors";
import postgres from "postgres";
import "dotenv/config";

const sql = postgres(process.env.DATABASE_URL);
const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/votings/:cedula", async (req, res) => {
  const { cedula } = req.params;

  try {
    // 1. Traer configs visibles
    const votingsConfig = await sql`
      SELECT * FROM "Votings_Config"
      WHERE "Oculto" = false
    `;

    const votings = [];

    for (const voting of votingsConfig) {
      const configId = voting.Config_ID || voting.config_id;
      const name = voting.Name || voting.name;
      const admin =
        voting.usrAdmin ||
        voting.usradmin ||
        voting.Admin ||
        voting.admin ||
        null;

      const dataTable = `Vote_${name}_Data`;
      const optionsTable = `Vote_${name}_Options`;

      let userData;

      // 🔥 VALIDAR SI USUARIO EXISTE EN ESA VOTACIÓN
      try {
        userData = await sql`
          SELECT hasvoted FROM ${sql(dataTable)}
          WHERE "ced" = ${cedula}
        `;

        if (userData.length === 0) {
          continue; // 🚨 CLAVE: ignora votación
        }
      } catch (err) {
        console.warn(`Tabla no válida: ${dataTable}`);
        continue;
      }

      const hasVoted = !!userData[0].hasvoted;

      // Opciones
      let options = [];
      try {
        const optionsData = await sql`
          SELECT "Name" FROM ${sql(optionsTable)}
          ORDER BY "ID" ASC
        `;
        options = optionsData.map(o => o.Name || o.name);
      } catch {
        options = ["Opción A", "Opción B"];
      }

      votings.push({
        Config_ID: configId,
        Name: name,
        usrAdmin: admin,
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

/* =============================================
   ENDPOINT: OBTENER OPCIONES DE UNA VOTACIÓN
   ============================================= */
app.get("/api/voting-options/:votingName", async (req, res) => {
  const { votingName } = req.params;

  try {
    const optionsTable = `Vote_${votingName}_Options`;

    const optionsData = await sql`
      SELECT * FROM ${sql(optionsTable)}
      ORDER BY "ID" ASC
    `;

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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 http://localhost:${PORT}`);
});