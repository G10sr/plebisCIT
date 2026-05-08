import express from "express";
import cors from "cors";
import postgres from "postgres";
import "dotenv/config";

const sql = postgres(process.env.DATABASE_URL);
const app = express();

app.use(cors());
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));

/* ─────────────────────────────────────────────
   UTIL
───────────────────────────────────────────── */

function formatTableName(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_]/g, "");
}

/* ─────────────────────────────────────────────
   LOGIN ADMIN
───────────────────────────────────────────── */

app.post("/api/admin-login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Correo y contraseña requeridos" });
  }

  try {
    const admin = await sql`
      SELECT "ID", "name_admin", "correo", "password"
      FROM "adminAccount"
      WHERE "correo" = ${email}
    `;

    if (!admin.length) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const user = admin[0];

    if (user.password !== password) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    res.json({
      success: true,
      admin: {
        id: user.ID,
        name: user.name_admin,
        email: user.correo,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
});

/* ─────────────────────────────────────────────
   LISTA VOTACIONES (USER)
───────────────────────────────────────────── */

app.get("/api/votings/:cedula", async (req, res) => {
  const { cedula } = req.params;

  try {
    const votingsConfig = await sql`
      SELECT * FROM "Votings_Config"
      WHERE "Oculto" = false
    `;

    const result = [];

    for (const voting of votingsConfig) {
      const name = voting.Name;
      const adminUUID =
        voting.usrAdmin ||
        voting.usradmin ||
        null;
      let adminName = "No disponible";

      if (adminUUID) {
        try {
          const adminData = await sql`
            SELECT "name_admin"
            FROM "adminAccount"
            WHERE "ID" = ${adminUUID}
          `;

          if (adminData.length > 0) {
            adminName = adminData[0].name_admin;
          }
        } catch (err) {
          console.warn("Error obteniendo admin:", err);
        }
      }
      const dataTable = `Vote_${formatTableName(name)}_Data`;
      const optionsTable = `Vote_${formatTableName(name)}_Options`;

      let userData;

      try {
        userData = await sql`
          SELECT hasvoted FROM ${sql(dataTable)}
          WHERE ced = ${cedula}
        `;

        if (!userData.length) continue;
      } catch {
        continue;
      }

      let options = [];

      try {
        const opt = await sql`
          SELECT "Name" FROM ${sql(optionsTable)}
          ORDER BY "ID"
        `;
        options = opt.map(o => ({
          id: o.ID,
          name: o.Name
        }));
      } catch {
        options = [];
      }

      result.push({
        Config_ID: voting.Config_ID,
        Name: name,
        options,
        adminName,
        hasVoted: !!userData[0].hasvoted,
        Start_time: voting.Start_time,
        End_time: voting.End_time,
        Vigente: voting.Vigente
      });
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
});

/* ─────────────────────────────────────────────
   OPCIONES VOTACIÓN
───────────────────────────────────────────── */

app.get("/api/voting-options/:name", async (req, res) => {
  const { name } = req.params;

  try {
    const table = `Vote_${formatTableName(name)}_Options`;

    const data = await sql`
      SELECT * FROM ${sql(table)}
      ORDER BY "ID"
    `;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error cargando opciones" });
  }
});

app.get("/api/admin-votings/:adminUUID", async (req, res) => {
  try {
    const { adminUUID } = req.params;

    if (!adminUUID) {
      return res.status(400).json({ error: "UUID de administrador requerido" });
    }

    const votings = await sql`
      SELECT "Config_ID", "Name"
      FROM "Votings_Config"
      WHERE "usrAdmin" = ${adminUUID}::uuid
      ORDER BY "Name"
    `;

    res.json(votings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error cargando votaciones de administrador" });
  }
});

/* ─────────────────────────────────────────────
   REGISTRAR VOTO
───────────────────────────────────────────── */

app.post("/api/vote", async (req, res) => {
  const { cedula, votingName, optionId } = req.body;

  if (!cedula || !votingName || !optionId) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  try {
    const table = `Vote_${formatTableName(votingName)}_Data`;

    const result = await sql`
      UPDATE ${sql(table)}
      SET option_id = ${optionId}, hasvoted = true
      WHERE ced = ${cedula}
      RETURNING *
    `;

    if (!result.length) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Error votando" });
  }
});

/* ─────────────────────────────────────────────
   CREAR VOTACIÓN
───────────────────────────────────────────── */

function normalizeOption(opt) {
  console.log("Normalizando opción:", JSON.stringify(opt, null, 2));

  const imagenes = (opt?.imagenes || []).map((img) => {
    if (typeof img === "string") return img;
    if (img && typeof img === "object") return img.preview || img.url || null;
    return null;
  }).filter(Boolean);

  const result = {
    nombre: opt?.nombre ?? "",
    descripcion: opt?.descripcion ?? "",
    color: opt?.color ?? "#6c5ce7",
    imagenes,
  };

  console.log("Opción normalizada:", JSON.stringify(result, null, 2));
  return result;
}

function safeValue(value) {
  return value === undefined ? null : value;
}

app.post("/api/voting/create", async (req, res) => {
  try {
    console.log("=== CREAR VOTACIÓN ===");
    console.log("Payload recibido:", JSON.stringify(req.body, null, 2));

    const {
      nombre,
      inicio,
      final,
      oculto,
      vigente,
      options = [],
      adminUUID
    } = req.body;

    console.log(`Nombre: ${nombre}, Inicio: ${inicio}, Final: ${final}`);
    console.log(`Opciones recibidas: ${options?.length || 0}`);
    console.log(`AdminUUID: ${adminUUID}`);

    if (!nombre || !inicio || !final) {
      return res.status(400).json({ error: "Nombre, inicio y final son obligatorios" });
    }

    const clean = formatTableName(nombre);

    const optionsTable = `Vote_${clean}_Options`;
    const dataTable = `Vote_${clean}_Data`;

    await sql`
      INSERT INTO "Votings_Config"
      ("Name","Start_time","End_time","Oculto","Vigente","usrAdmin")
      VALUES
      (${nombre},${inicio},${final},${oculto},${vigente},${safeValue(adminUUID)})
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS ${sql(optionsTable)} (
        "ID" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "Name" text,
        "Des" text,
        "Img1" text,
        "Img2" text,
        "Img3" text,
        "Img4" text,
        "Img5" text,
        "Color" text
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS ${sql(dataTable)} (
        ced TEXT PRIMARY KEY,
        nombre TEXT,
        grado TEXT,
        hasvoted BOOLEAN DEFAULT false,
        option_id UUID
      )
    `;

    const notDefined = await sql`
      INSERT INTO ${sql(optionsTable)}
      ("Name","Des","Color")
      VALUES ('Not Defined','default','#9e9e9e')
      RETURNING "ID"
    `;

    await sql.unsafe(`
      ALTER TABLE "${dataTable}"
      ALTER COLUMN "option_id"
      SET DEFAULT '${notDefined[0].ID}'::uuid
    `);
    await sql.unsafe(`
      ALTER TABLE "${dataTable}"
      ADD CONSTRAINT "${dataTable}_fk_option"
      FOREIGN KEY ("option_id")
      REFERENCES "${optionsTable}"("ID")
    `);

    const safeOptions = (options || []).map(normalizeOption);

    console.log("Opciones a insertar:", JSON.stringify(safeOptions, null, 2));

    for (const opt of safeOptions) {
      const imgs = opt.imagenes || [];

      await sql`
        INSERT INTO ${sql(optionsTable)}
        ("Name","Des","Img1","Img2","Img3","Img4","Img5","Color")
        VALUES (
          ${opt.nombre},
          ${opt.descripcion},
          ${imgs[0] || null},
          ${imgs[1] || null},
          ${imgs[2] || null},
          ${imgs[3] || null},
          ${imgs[4] || null},
          ${opt.color}
        )
      `;
    }

    console.log("Insertando Voto Nulo...");
    await sql`
      INSERT INTO ${sql(optionsTable)}
      ("Name","Des","Color")
      VALUES ('Voto Nulo','invalid','#808080')
    `;
    console.log("Voto Nulo insertado exitosamente");

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creando votación" });
  }
});

/* ─────────────────────────────────────────────
   UPDATE VOTACIÓN
───────────────────────────────────────────── */

app.put("/api/voting/update/:name", async (req, res) => {
  try {
    const { name } = req.params;

    const {
      nombre,
      inicio,
      final,
      oculto,
      vigente,
      options = [],
      adminUUID
    } = req.body;

    const clean = formatTableName(name);
    const optionsTable = `Vote_${clean}_Options`;

    await sql`
      UPDATE "Votings_Config"
      SET
        "Name" = ${nombre},
        "Start_time" = ${inicio},
        "End_time" = ${final},
        "Oculto" = ${oculto},
        "Vigente" = ${vigente}
      WHERE "Name" = ${name}
    `;

    await sql`
      DELETE FROM ${sql(optionsTable)}
      WHERE "Name" NOT IN ('Not Defined')
    `;

    const safeOptions = (options || []).map(normalizeOption);

    for (const opt of safeOptions) {
      const imgs = opt.imagenes || [];

      await sql`
        INSERT INTO ${sql(optionsTable)}
        ("Name","Des","Img1","Img2","Img3","Img4","Img5","Color")
        VALUES (
          ${opt.nombre},
          ${opt.descripcion},
          ${imgs[0] || null},
          ${imgs[1] || null},
          ${imgs[2] || null},
          ${imgs[3] || null},
          ${imgs[4] || null},
          ${opt.color}
        )
      `;
    }

    // Re-insertar Voto Nulo después de actualizar opciones
    await sql`
      INSERT INTO ${sql(optionsTable)}
      ("Name","Des","Color")
      VALUES ('Voto Nulo','invalid','#808080')
    `;

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error actualizando votación" });
  }
});

/* ─────────────────────────────────────────────
   IMPORT CSV
───────────────────────────────────────────── */

app.post("/api/voting/:name/import-csv", async (req, res) => {
  try {
    const { name } = req.params;
    const { data } = req.body;

    const table = `Vote_${formatTableName(name)}_Data`;

    for (const row of data) {
      await sql`
        INSERT INTO ${sql(table)}
        (ced,nombre,grado,hasvoted)
        VALUES
        (${row.ced},${row.nombre},${row.grado},false)
        ON CONFLICT (ced) DO NOTHING
      `;
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Error CSV" });
  }
});

/* ─────────────────────────────────────────────
   ELIMINAR VOTACIÓN
───────────────────────────────────────────── */

app.delete("/api/voting/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const clean = formatTableName(name);

    const optionsTable = `Vote_${clean}_Options`;
    const dataTable = `Vote_${clean}_Data`;

    // Eliminar las tablas de datos y opciones
    await sql`DROP TABLE IF EXISTS "${dataTable}" CASCADE`;
    await sql`DROP TABLE IF EXISTS "${optionsTable}" CASCADE`;

    // Eliminar la configuración de la votación
    await sql`
      DELETE FROM "Votings_Config"
      WHERE "Name" = ${name}
    `;

    res.json({ success: true, message: "Votación eliminada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error eliminando votación" });
  }
});

/* ─────────────────────────────────────────────
   OBTENER VOTACIÓN PARA EDITAR
───────────────────────────────────────────── */

app.get("/api/voting/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const clean = formatTableName(name);

    const optionsTable = `Vote_${clean}_Options`;

    // Obtener configuración
    const voting = await sql`
      SELECT * FROM "Votings_Config"
      WHERE "Name" = ${name}
    `;

    if (!voting.length) {
      return res.status(404).json({ error: "Votación no encontrada" });
    }

    // Obtener opciones
    const options = await sql`
      SELECT "ID", "Name", "Des", "Img1", "Img2", "Img3", "Img4", "Img5", "Color"
      FROM ${sql(optionsTable)}
      WHERE "Name" NOT IN ('Not Defined', 'Voto Nulo')
      ORDER BY "ID"
    `;

    res.json({
      ...voting[0],
      options: options.map(opt => ({
        nombre: opt.Name,
        descripcion: opt.Des,
        imagenes: [opt.Img1, opt.Img2, opt.Img3, opt.Img4, opt.Img5].filter(Boolean),
        color: opt.Color,
        id: opt.ID
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo votación" });
  }
});

/* ───────────────────────────────────────────── */

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("🚀 " + PORT));