import express from "express";
import cors from "cors";
import postgres from "postgres";
import multer from "multer";
import fs from "fs";
import path from "path";
import "dotenv/config";

const sql = postgres(process.env.DATABASE_URL);
const app = express();

app.use(cors());
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));

const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const fileName = `${base}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    cb(null, fileName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() !== ".csv") {
      return cb(new Error("Solo se permiten archivos CSV"));
    }
    cb(null, true);
  }
});

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

app.post("/subir", (req, res) => {
  upload.single("archivo_csv")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || "Error subiendo el archivo" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No se recibió ningún archivo." });
    }

    res.json({
      success: true,
      file: req.file.filename,
      path: req.file.path,
      size: req.file.size
    });
  });
});

app.get("/subir", (req, res) => {
  try {
    const files = fs.readdirSync(uploadDir)
      .filter((name) => name.toLowerCase().endsWith(".csv"))
      .map((name) => ({
        name,
        size: fs.statSync(path.join(uploadDir, name)).size,
        createdAt: fs.statSync(path.join(uploadDir, name)).ctime.toISOString()
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    res.json({ files });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Error listando archivos" });
  }
});

app.delete("/subir/:filename", (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(uploadDir, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Archivo no encontrado" });
    }

    fs.unlinkSync(filePath);

    res.json({ success: true, deleted: filename });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Error eliminando archivo" });
  }
});

app.get("/api/csv-sections", async (req, res) => {
  try {

    const files = fs.readdirSync(uploadDir)
      .filter(file => file.toLowerCase().endsWith(".csv"));


    const sections = new Set();


    for (const file of files) {

      const filePath = path.join(uploadDir, file);

      const content = fs.readFileSync(filePath, "utf8");


      const lines = content
        .split(/\r?\n/)
        .filter(Boolean);


      if (!lines.length) continue;


      let delimiter = ",";

      if (lines[0].includes(";")) delimiter = ";";
      else if (lines[0].includes("\t")) delimiter = "\t";


      const headers = lines[0]
        .split(delimiter)
        .map(h => h.trim());


      const sectionIndex = headers.findIndex(
        h => h.toLowerCase() === "seccion"
      );


      if (sectionIndex === -1) continue;


      lines.slice(1).forEach(line => {

        const values = line.split(delimiter);

        const section = values[sectionIndex]?.trim();


        if (section) {
          sections.add(section);
        }

      });

    }


    res.json({
      sections: Array.from(sections).sort()
    });


  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Error obteniendo secciones CSV"
    });

  }
});

async function getCsvUsers() {
  const files = fs.readdirSync(uploadDir)
    .filter(file => file.toLowerCase().endsWith(".csv"));

<<<<<<< HEAD
  console.log("===== GET CSV USERS =====");
  console.log("CSV encontrados:", files);

  const users = [];

  for (const file of files) {
    console.log("\nProcesando archivo:", file);

=======
  const users = [];

  for (const file of files) {
>>>>>>> c61be17 (feat: Add CSV functionality and implement it with database)
    const filePath = path.join(uploadDir, file);

    const content = fs.readFileSync(filePath, "utf8");

<<<<<<< HEAD
    console.log("Primeros 200 caracteres:");
    console.log(content.substring(0, 200));

=======
    console.log(content.substring(0, 200));
>>>>>>> c61be17 (feat: Add CSV functionality and implement it with database)
    const lines = content
      .split(/\r?\n/)
      .filter(Boolean);

<<<<<<< HEAD
    console.log("Total líneas:", lines.length);

    if (lines.length < 2) {
      console.log("Archivo vacío o sin datos, se omite.");
      continue;
    }
=======
    if (lines.length < 2) continue;
>>>>>>> c61be17 (feat: Add CSV functionality and implement it with database)

    let delimiter = ",";
    if (lines[0].includes(";")) delimiter = ";";
    else if (lines[0].includes("\t")) delimiter = "\t";

<<<<<<< HEAD
    console.log("Delimitador detectado:", JSON.stringify(delimiter));

    const headers = lines[0]
      .split(delimiter)
      .map(h => h.trim().toLowerCase());

    console.log("Headers:", headers);
=======
    const headers = lines[0]
      .split(delimiter)
      .map(h => h.trim().toLowerCase());
    console.log(headers);
>>>>>>> c61be17 (feat: Add CSV functionality and implement it with database)

    const indexes = {
      ced: headers.findIndex(h =>
        h.includes("identific") ||
        h.includes("ced") ||
        h.includes("id")
      ),
      nombre: headers.findIndex(h => h.includes("nombre")),
      primerApellido: headers.findIndex(h => h.includes("primer apellido")),
      segundoApellido: headers.findIndex(h => h.includes("segundo apellido")),
<<<<<<< HEAD
      seccion: headers.findIndex(h => h.includes("seccion")),
    };

    console.log("Índices encontrados:", indexes);

    if (
      indexes.ced === -1 ||
      indexes.nombre === -1 ||
      indexes.seccion === -1
    ) {
      console.log("Faltan columnas obligatorias. Se omite este archivo.");
=======
      seccion: headers.findIndex(h => h.includes("seccion"))
    };
    console.log(indexes);

    if (indexes.ced === -1 || indexes.nombre === -1 || indexes.seccion === -1) {
>>>>>>> c61be17 (feat: Add CSV functionality and implement it with database)
      continue;
    }

    for (const line of lines.slice(1)) {
      const values = line.split(delimiter);

      const nombreCompleto = [
        values[indexes.nombre],
        values[indexes.primerApellido],
        values[indexes.segundoApellido]
      ]
        .map(v => v?.trim())
        .filter(Boolean)
        .join(" ");

      users.push({
        ced: values[indexes.ced]?.trim(),
        nombre: nombreCompleto,
        seccion: values[indexes.seccion]?.trim()
      });
    }
<<<<<<< HEAD

    console.log("Usuarios acumulados:", users.length);
  }

  console.log("TOTAL USUARIOS CSV:", users.length);
  console.log(users.slice(0, 10));

=======
  }

>>>>>>> c61be17 (feat: Add CSV functionality and implement it with database)
  return users;
}

async function syncVotingUsers(dataTable, grupos) {
<<<<<<< HEAD
  console.log("\n==============================");
  console.log("SYNC VOTING USERS");
  console.log("==============================");

  console.log("Tabla:", dataTable);
  console.log("Grupos recibidos:", grupos);

  const users = await getCsvUsers();

  console.log("Usuarios leídos del CSV:", users.length);

  const normalize = value =>
    value?.trim().toLowerCase();

  console.log("Grupos recibidos:", JSON.stringify(grupos, null, 2));

=======
  const users = await getCsvUsers();

  // Normalizar secciones
  const normalize = (value) =>
    value?.trim().toLowerCase();

>>>>>>> c61be17 (feat: Add CSV functionality and implement it with database)
  const enabledSections = Object.keys(grupos)
    .filter(section => grupos[section])
    .map(normalize);

  console.log("Secciones habilitadas:", enabledSections);

<<<<<<< HEAD
=======

  // Obtener grados actuales
>>>>>>> c61be17 (feat: Add CSV functionality and implement it with database)
  const currentSections = await sql`
    SELECT DISTINCT grado
    FROM ${sql(dataTable)}
  `;

<<<<<<< HEAD
  console.log("Grados existentes en BD:", currentSections);

=======
>>>>>>> c61be17 (feat: Add CSV functionality and implement it with database)
  const existingSections = currentSections.map(row =>
    normalize(row.grado)
  );

  console.log("Secciones actuales:", existingSections);

<<<<<<< HEAD
=======

  // Solo borrar lo que ya no existe
>>>>>>> c61be17 (feat: Add CSV functionality and implement it with database)
  const sectionsToDelete = existingSections.filter(
    section => !enabledSections.includes(section)
  );

<<<<<<< HEAD
  console.log("Secciones que se eliminarán:", sectionsToDelete);

  const deletingEverything =
    existingSections.length > 0 &&
    sectionsToDelete.length === existingSections.length;


  if (sectionsToDelete.length > 0) {
    console.log("Eliminando usuarios de:", sectionsToDelete);

    const deleted = await sql`
      DELETE FROM ${sql(dataTable)}
      WHERE LOWER(TRIM(grado)) = ANY(${sectionsToDelete})
      RETURNING ced, grado
    `;

    console.log("Usuarios eliminados:", deleted.length);
  }

  if (!enabledSections.length) {
    console.log("No hay grupos activos.");
    return;
  }

=======

  console.log("Secciones que se borrarán:", sectionsToDelete);


  // Protección contra borrar todo accidentalmente
  if (
    sectionsToDelete.length === existingSections.length &&
    enabledSections.length > 0
  ) {
    console.error(
      "ABORTADO: intento de borrar toda la tabla por diferencia de nombres"
    );
    return;
  }


  if (sectionsToDelete.length > 0) {
    await sql`
      DELETE FROM ${sql(dataTable)}
      WHERE LOWER(TRIM(grado)) = ANY(${sectionsToDelete})
    `;
  }


  // Si no hay grupos activos, ya terminamos
  if (!enabledSections.length) {
    return;
  }


  // Usuarios de grupos activos
>>>>>>> c61be17 (feat: Add CSV functionality and implement it with database)
  const enabledUsers = users.filter(user =>
    enabledSections.includes(normalize(user.seccion))
  );

<<<<<<< HEAD
  console.log("Usuarios que pertenecen a grupos activos:", enabledUsers.length);
  console.log("Primeros usuarios:", enabledUsers.slice(0, 10));

  if (!enabledUsers.length) {
    console.log("No hay usuarios para insertar.");
    return;
  }

=======

  if (!enabledUsers.length) {
    return;
  }


>>>>>>> c61be17 (feat: Add CSV functionality and implement it with database)
  const rows = enabledUsers.map(user => [
    user.ced,
    user.nombre,
    user.seccion.trim()
  ]);

<<<<<<< HEAD
  console.log("Filas a insertar:", rows.length);
  console.log(rows.slice(0, 10));

  const inserted = await sql`
=======

  await sql`
>>>>>>> c61be17 (feat: Add CSV functionality and implement it with database)
    INSERT INTO ${sql(dataTable)}
    (ced, nombre, grado)
    VALUES ${sql(rows)}
    ON CONFLICT (ced) DO NOTHING
<<<<<<< HEAD
    RETURNING ced
  `;

  console.log("Usuarios insertados:", inserted.length);
  console.log("SYNC FINALIZADO");
=======
  `;
>>>>>>> c61be17 (feat: Add CSV functionality and implement it with database)
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
  let userName = "Usuario";
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
      let hasVoted = false;

      try {

        userData = await sql`
  SELECT hasvoted, nombre
  FROM ${sql(dataTable)}
  WHERE ced = ${cedula}
`;

        if (!userData.length) {
          continue;
        }
        userName = userData[0].nombre || "";

        hasVoted = userData[0].hasvoted ?? false;

      } catch {
        continue;
      }

      let options = [];

      try {
        const opt = await sql`
          SELECT "ID", "Name" FROM ${sql(optionsTable)}
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
        hasVoted,
        userName,
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

    res.json(data.map(opt => ({
      id: opt.ID,
      name: opt.Name,
      description: opt.Des,
      images: [opt.Img1, opt.Img2, opt.Img3, opt.Img4, opt.Img5].filter(Boolean),
      color: opt.Color,
    })));
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

  const imagenes = (opt?.imagenes || []).map((img) => {
    if (typeof img === "string") return img;
    if (img && typeof img === "object") return img.preview || img.url || null;
    return null;
  }).filter(Boolean);

  const result = {
    id: opt?.id ?? null,
    nombre: opt?.nombre ?? "",
    descripcion: opt?.descripcion ?? "",
    color: opt?.color ?? "#6c5ce7",
    imagenes,
  };

  return result;
}

function safeValue(value) {
  return value === undefined ? null : value;
}

app.post("/api/voting/create", async (req, res) => {
  try {

    const {
      nombre,
      inicio,
      final,
      oculto,
      vigente,
      grupos = {},
      options = [],
      adminUUID
    } = req.body;

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
        "Name" text UNIQUE,
        "Des" text,
        "Img1" text,
        "Img2" text,
        "Img3" text,
        "Img4" text,
        "Img5" text,
        "Color" text
      )
    `;

    const exists = await sql`
      SELECT 1
      FROM pg_constraint
      WHERE conname = ${optionsTable + "_unique_name"}
    `;

    if (!exists.length) {
      await sql.unsafe(`
        ALTER TABLE "${optionsTable}"
        ADD CONSTRAINT "${optionsTable}_unique_name" UNIQUE ("Name")
      `);
    }
    await sql`
      CREATE TABLE IF NOT EXISTS ${sql(dataTable)} (
        ced TEXT PRIMARY KEY,
        nombre TEXT,
        grado TEXT,
        hasvoted BOOLEAN DEFAULT false,
        option_id UUID,
        fileID bigint
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

    for (const opt of safeOptions) {
      const imgs = opt.imagenes || [];

      if (opt.id) {

        await sql`
      UPDATE ${sql(optionsTable)}
      SET
        "Name" = ${opt.nombre},
        "Des" = ${opt.descripcion},
        "Img1" = ${imgs[0] || null},
        "Img2" = ${imgs[1] || null},
        "Img3" = ${imgs[2] || null},
        "Img4" = ${imgs[3] || null},
        "Img5" = ${imgs[4] || null},
        "Color" = ${opt.color}
      WHERE "ID" = ${opt.id}
    `;

      } else {

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
    }


    const votoNulo = await sql`
  SELECT "ID"
  FROM ${sql(optionsTable)}
  WHERE "Name" = 'Voto Nulo'
`;

    if (!votoNulo.length) {
      await sql`
    INSERT INTO ${sql(optionsTable)}
    ("Name","Des","Color")
    VALUES ('Voto Nulo','invalid','#808080')
    ON CONFLICT ("Name") DO NOTHING
  `;
    }

    await syncVotingUsers(dataTable, grupos);

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
      grupos = {},
      options = [],
      adminUUID
    } = req.body;

    const clean = formatTableName(name);
    const optionsTable = `Vote_${clean}_Options`;
    const dataTable = `Vote_${clean}_Data`;

    await sql`
      UPDATE "Votings_Config"
      SET
        "Start_time" = ${inicio},
        "End_time" = ${final},
        "Oculto" = ${oculto},
        "Vigente" = ${vigente},
        "usrAdmin" = ${safeValue(adminUUID)}
      WHERE "Name" = ${name}
    `;

    const safeOptions = (options || []).map(normalizeOption);

    const exists = await sql`
      SELECT 1
      FROM pg_constraint
      WHERE conname = ${optionsTable + "_unique_name"}
    `;

    if (!exists.length) {
      await sql.unsafe(`
        ALTER TABLE "${optionsTable}"
        ADD CONSTRAINT "${optionsTable}_unique_name" UNIQUE ("Name")
      `);
    }
    for (const opt of safeOptions) {
      const imgs = opt.imagenes || [];

      if (opt.id) {

        await sql`
      UPDATE ${sql(optionsTable)}
      SET
        "Name" = ${opt.nombre},
        "Des" = ${opt.descripcion},
        "Img1" = ${imgs[0] || null},
        "Img2" = ${imgs[1] || null},
        "Img3" = ${imgs[2] || null},
        "Img4" = ${imgs[3] || null},
        "Img5" = ${imgs[4] || null},
        "Color" = ${opt.color}
      WHERE "ID" = ${opt.id}
    `;

      } else {

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
    }

    // Re-insertar Voto Nulo después de actualizar opciones
    const votoNulo = await sql`
  SELECT "ID"
  FROM ${sql(optionsTable)}
  WHERE "Name" = 'Voto Nulo'
`;

    if (!votoNulo.length) {
      await sql`
    INSERT INTO ${sql(optionsTable)}
    ("Name","Des","Color")
    VALUES ('Voto Nulo','invalid','#808080')
    ON CONFLICT ("Name") DO NOTHING
  `;
    }
    await syncVotingUsers(dataTable, grupos);

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error actualizando votación" });
  }
});

/* ─────────────────────────────────────────────
   IMPORT CSV
───────────────────────────────────────────── */


app.delete("/api/voting/:name/option/:id", async (req, res) => {
  try {
    const { name, id } = req.params;

    const optionsTable = `Vote_${formatTableName(name)}_Options`;
    const dataTable = `Vote_${formatTableName(name)}_Data`;

    // 1. 🔥 AQUI va el Not Defined (ANTES de todo)
    let notDefined = await sql`
      SELECT "ID"
      FROM ${sql(optionsTable)}
      WHERE "Name" = 'Not Defined'
    `;

    if (!notDefined.length) {
      notDefined = await sql`
        INSERT INTO ${sql(optionsTable)}
        ("Name","Des","Color")
        VALUES ('Not Defined','default','#9e9e9e')
        RETURNING "ID"
      `;
    }

    const fallbackId = notDefined[0].ID;

    // 2. mover votos a Not Defined
    await sql`
      UPDATE ${sql(dataTable)}
      SET option_id = ${fallbackId}, hasvoted = false
      WHERE option_id = ${id}
    `;

    // 3. ahora sí borrar opción
    await sql`
      DELETE FROM ${sql(optionsTable)}
      WHERE "ID" = ${id}
    `;

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error eliminando opción" });
  }
});

/* ─────────────────────────────────────────────
   ELIMINAR VOTACIÓN
───────────────────────────────────────────── */

app.delete("/api/voting/:name", async (req, res) => {
  try {
    const { name } = req.params;

    if (!name) {
      return res.status(400).json({
        error: "Nombre de votación requerido"
      });
    }

    const clean = formatTableName(name);

    const optionsTable = `Vote_${clean}_Options`;
    const dataTable = `Vote_${clean}_Data`;

    // Primero eliminar tabla DATA
    await sql`
      DROP TABLE IF EXISTS ${sql(dataTable)} CASCADE
    `;

    // Luego OPTIONS
    await sql`
      DROP TABLE IF EXISTS ${sql(optionsTable)} CASCADE
    `;

    // Finalmente eliminar config
    const deletedConfig = await sql`
      DELETE FROM "Votings_Config"
      WHERE "Name" = ${name}
      RETURNING *
    `;

    res.json({
      success: true,
      message: "Votación eliminada correctamente"
    });

  } catch (err) {
    console.error("ERROR ELIMINANDO VOTACIÓN:");
    console.error(err);

    res.status(500).json({
      error: err.message || "Error eliminando votación"
    });
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

    // Obtener grupos activos
    const dataTable = `Vote_${clean}_Data`;

    let grupos = {};

    try {
      const sections = await sql`
    SELECT DISTINCT grado
    FROM ${sql(dataTable)}
  `;

      sections.forEach(row => {
        if (row.grado) {
          grupos[row.grado] = true;
        }
      });

    } catch (err) {
      console.log("No se pudieron cargar grupos:", err.message);
    }


    res.json({
      ...voting[0],

      grupos,

      options: options.map(opt => ({
        id: opt.ID,
        name: opt.Name,
        description: opt.Des,
        images: [opt.Img1, opt.Img2, opt.Img3, opt.Img4, opt.Img5].filter(Boolean),
        color: opt.Color
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo votación" });
  }
});

/* ───────────────────────────────────────────── */

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => { });


/* --------------------------- ESTO LO AÑADÍ (INTENTO 2 (FUNCIONÓ FAHHHHHHHHH)) --------------------------- */

/* ─────────────────────────────────────────────
   OBTENER CONFIG POR ID
───────────────────────────────────────────── */

/* ─────────────────────────────────────────────
   RESULTADOS DE VOTACIÓN
───────────────────────────────────────────── */

app.get("/api/voting-results/:configId", async (req, res) => {

  try {

    const { configId } = req.params;

    // 1. Buscar votación
    const votingConfig = await sql`
      SELECT "Name"
      FROM "Votings_Config"
      WHERE "Config_ID" = ${configId}
    `;

    if (!votingConfig.length) {
      return res.status(404).json({
        error: "Votación no encontrada"
      });
    }

    const votingName = votingConfig[0].Name;

    // 2. Tablas dinámicas
    const cleanName = formatTableName(votingName);

    const optionsTable = `Vote_${cleanName}_Options`;
    const dataTable = `Vote_${cleanName}_Data`;

    // 3. Obtener opciones
    const options = await sql`
      SELECT
        "ID",
        "Name",
        "Des",
        "Color"
      FROM ${sql(optionsTable)}
      ORDER BY "ID"
    `;

    // 4. Contar votos por candidato
    const results = [];

    // Buscar ID de "Not Defined"
    const notDefinedOption = await sql`
  SELECT "ID"
  FROM ${sql(optionsTable)}
  WHERE "Name" = 'Not Defined'
`;

    const notDefinedId = notDefinedOption[0]?.ID || null;

    // Contar personas por candidato
    for (const option of options) {

      let votes;

      // Si el candidato es "Not Defined"
      // también cuenta usuarios sin votar
      if (option.Name === "Not Defined") {

        votes = await sql`
      SELECT COUNT(*) AS total
      FROM ${sql(dataTable)}
      WHERE option_id = ${option.ID}
      OR (
        option_id = ${notDefinedId}
        AND hasvoted = false
      )
    `;

      } else {

        votes = await sql`
      SELECT COUNT(*) AS total
      FROM ${sql(dataTable)}
      WHERE option_id = ${option.ID}
      AND hasvoted = true
    `;

      }

      results.push({
        id: option.ID,

        // Cambiar nombre visual
        name: option.Name === "Not Defined"
          ? "Abstencionismo"
          : option.Name,

        description: option.Des,

        color: option.Color,

        totalVotes: Number(votes[0].total),

        // Saber si es Abstencionismo
        isNegligence: option.Name === "Not Defined"
      });
    }

    // 5. Totales generales
    const totalUsers = await sql`
      SELECT COUNT(*) AS total
      FROM ${sql(dataTable)}
    `;

    const totalVotes = await sql`
      SELECT COUNT(*) AS total
      FROM ${sql(dataTable)}
      WHERE hasvoted = true
    `;

    res.json({
      votingName,
      totalUsers: Number(totalUsers[0].total),
      totalVotes: Number(totalVotes[0].total),
      candidates: results
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Error obteniendo resultados"
    });

  }

});


/* --------------------------- ESTO LO AÑADÍ (OLD = BASURA BODRIO 🤮) --------------------------- */

/* ─────────────────────────────────────────────
   RESULTADOS DE VOTACIÓN
───────────────────────────────────────────── */

/*
app.get("/api/voting-results/:configId", async (req, res) => {
  try {
    const { configId } = req.params;

    // 1. Buscar la votación usando Config_ID
    const votingConfig = await sql`
      SELECT "Name"
      FROM "Votings_Config"
      WHERE "Config_ID" = ${configId}
    `;

    if (!votingConfig.length) {
      return res.status(404).json({
        error: "Votación no encontrada"
      });
    }

    const votingName = votingConfig[0].Name;

    // 2. Crear nombres dinámicos de tablas
    const cleanName = formatTableName(votingName);

    const dataTable = `Vote_${cleanName}_Data`;
    const optionsTable = `Vote_${cleanName}_Options`;

    // 3. Obtener todos los votos + nombre de opción
    const results = await sql`
      SELECT
        d.ced,
        d.nombre,
        d.grado,
        d.hasvoted,
        d.option_id,

        o."Name" AS option_name,
        o."Color" AS option_color

      FROM ${sql(dataTable)} d

      LEFT JOIN ${sql(optionsTable)} o
      ON d.option_id = o."ID"

      ORDER BY d.nombre ASC
    `;

    // 4. Formatear respuesta
    const formatted = results.map(row => ({
      cedula: row.ced,
      nombre: row.nombre,
      grado: row.grado,

      hasVoted: row.hasvoted,

      optionId: row.option_id,

      selectedOption: row.option_name || "Sin opción",

      optionColor: row.option_color || null
    }));

    res.json({
      votingName,
      totalVotes: formatted.filter(v => v.hasVoted).length,
      totalUsers: formatted.length,
      results: formatted
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Error obteniendo resultados"
    });
  }
});
*/