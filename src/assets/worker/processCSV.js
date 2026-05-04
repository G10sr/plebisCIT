const fs = require("fs");

const inputFile = "input.csv";
const outputFile = "output.json";
const GRADO = "7mo";

const raw = fs.readFileSync(inputFile, "utf8");

const lines = raw.split("\n").filter(l => l.trim());

const header = lines[0];

// Datos
const dataLines = lines.slice(1);

const result = dataLines.map(line => {
  const [ced, tipo, nombre, apellido1, apellido2] = line.split(";");

  const nombreCompleto = `${nombre} ${apellido1} ${apellido2}`.trim();

  return {
    ced: ced.trim(),
    nombre: nombreCompleto,
    grado: GRADO
  };
});

fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));

console.log(`Listo! ${result.length} registros procesados -> ${outputFile}`);