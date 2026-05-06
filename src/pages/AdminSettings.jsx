/**
 * PÁGINA: CONFIGURACIÓN DE VOTACIÓN
 * 
 * Panel detallado para editar y configurar una votación específica.
 * Acceso exclusivo para administradores.
 * 
 * Funcionalidades:
 * - Editar nombre y descripción de la votación
 * - Configurar fechas de inicio y fin
 * - Administrar opciones de votación
 * - Activar/desactivar vigencia de la votación
 * - Aplicar estilos personalizados con CSS inyectado
 * 
 * NOTA: Contiene estilos globales inyectados como <style> en el DOM
 * para mantener una estética coherente en todo el panel administrativo
 */

import { useState } from "react";
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #f7f6f3;
  --surface: #ffffff;
  --border: #e2dfd8;
  --text: #1a1916;
  --muted: #7a776e;
  --accent: #6c5ce7;
  --accent-light: #ede9fc;
  --shadow: 0 1px 3px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04);
}

body {
  font-family: 'DM Sans', sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  background-image:
    radial-gradient(circle at 80% 10%, rgba(108,92,231,0.06) 0%, transparent 50%),
    radial-gradient(circle at 20% 80%, rgba(225,112,85,0.05) 0%, transparent 40%);
}

/* ── Checkbox animado ───────────────────────────────────────────────────────── */
.custom-checkbox {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  font-size: 14px;
  color: var(--text);
  transition: color 0.3s;
}
.custom-checkbox input[type="checkbox"] {
  display: none;
}
.custom-checkbox .checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #b0aca3;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  flex-shrink: 0;
  transform-style: preserve-3d;
  transition: background-color 1.3s, border-color 1.3s, color 1.3s, transform 0.3s;
}
.custom-checkbox .checkmark::before {
  content: "\\2713";
  font-size: 13px;
  color: transparent;
  transition: color 0.3s, transform 0.3s;
}
.custom-checkbox input[type="checkbox"]:checked + .checkmark {
  background-color: var(--accent);
  border-color: var(--accent);
  transform: scale(1.1) rotateZ(360deg) rotateY(360deg);
}
.custom-checkbox input[type="checkbox"]:checked + .checkmark::before {
  color: #fff;
}
.custom-checkbox:hover {
  color: var(--muted);
}
.custom-checkbox:hover .checkmark {
  border-color: var(--accent);
  background-color: var(--accent-light);
  transform: scale(1.05);
}
.custom-checkbox input[type="checkbox"]:focus + .checkmark {
  box-shadow: 0 0 3px 2px rgba(108, 92, 231, 0.25);
  outline: none;
}
`;

// ─── Subcomponentes ──────────────────────────────────────────────────────────

/** Campo de texto simple */
function Field({ label, required, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      {label && (
        <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--muted)", marginBottom: 7, letterSpacing: "0.02em" }}>
          {label} {required && <span style={{ color: "var(--accent)" }}>*</span>}
        </label>
      )}
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  border: "1.5px solid var(--border)",
  borderRadius: 8,
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 14,
  color: "var(--text)",
  background: "var(--surface)",
  outline: "none",
  boxShadow: "var(--shadow)",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const textareaStyle = {
  ...inputStyle,
  resize: "vertical",
  minHeight: 80,
};

/** Input con foco controlado */
function TextInput({ placeholder, value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        ...inputStyle,
        borderColor: focused ? "var(--accent)" : "var(--border)",
        boxShadow: focused ? "0 0 0 3px var(--accent-light)" : "var(--shadow)",
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

/** Textarea con foco controlado */
function TextArea({ placeholder, value, onChange, minHeight = 80 }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        ...textareaStyle,
        minHeight,
        borderColor: focused ? "var(--accent)" : "var(--border)",
        boxShadow: focused ? "0 0 0 3px var(--accent-light)" : "var(--shadow)",
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

/** Date picker estilizado */
function DateInput({ value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <input
        type="date"
        value={value}
        onChange={onChange}
        style={{
          ...inputStyle,
          paddingRight: 36,
          appearance: "none",
          cursor: "pointer",
          borderColor: focused ? "var(--accent)" : "var(--border)",
          boxShadow: focused ? "0 0 0 3px var(--accent-light)" : "var(--shadow)",
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <svg
        width={16} height={16} fill="none" stroke="var(--muted)" strokeWidth={1.7}
        viewBox="0 0 24 24"
        style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
      >
        <rect x="3" y="4" width="18" height="18" rx="3" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    </div>
  );
}

/** Checkbox personalizado con animación CSS */
function CustomCheckbox({ label, checked, onChange }) {
  const id = `chk-${label.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <label className="custom-checkbox" htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="checkmark" />
      <span>{label}</span>
    </label>
  );
}

/** Toggle switch */
function Toggle({ checked, onChange }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: 42, height: 24,
        background: checked ? "var(--text)" : "#ccc",
        borderRadius: 99,
        cursor: "pointer",
        position: "relative",
        flexShrink: 0,
        transition: "background 0.2s",
      }}
    >
      <span
        style={{
          position: "absolute",
          width: 18, height: 18,
          background: "#fff",
          borderRadius: "50%",
          top: 3, left: checked ? 21 : 3,
          transition: "left 0.2s",
          boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
        }}
      />
    </div>
  );
}

/** Tarjeta de una opción de candidato */
function OptionCard({ index, option, onChange, onRemove }) {
  const update = (key) => (e) => onChange(index, { ...option, [key]: e.target.value });
  const handleFiles = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    onChange(index, { ...option, imagenes: files });
    ``
  };

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1.5px solid var(--border)",
        borderRadius: 14,
        padding: 24,
        marginBottom: 16,
        boxShadow: "var(--shadow)",
        position: "relative",
        animation: "fadeUp 0.25s ease",
      }}
    >
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`}</style>

      {/* Botón eliminar */}
      {index > 0 && (
        <button
          onClick={() => onRemove(index)}
          style={{
            position: "absolute", top: 16, right: 16,
            background: "none", border: "none", cursor: "pointer",
            color: "var(--muted)", fontSize: 18, lineHeight: 1,
            padding: "2px 6px", borderRadius: 6,
            transition: "color 0.15s",
          }}
          title="Eliminar opción"
        >
          ×
        </button>
      )}

      <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 18 }}>
        Opción {index + 1}
      </div>

      {/* Fila superior: Nombre */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 14 }}>
        <Field label="Nombre" required>
          <TextInput placeholder="Value" value={option.nombre} onChange={update("nombre")} />
        </Field>
      </div>

      {/* Fila inferior: Descripción / Valores / Imagen */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 14, alignItems: "start" }}>
        <Field label="Descripción" required>
          <TextArea placeholder="Value" value={option.descripcion} onChange={update("descripcion")} />
        </Field>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, paddingTop: 22 }}>
          <label style={btnSecondaryStyle}>
            Sube Imágenes
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFiles}
              style={{ display: "none" }}
            />
          </label>
          <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "right", lineHeight: 1.5, maxWidth: 180 }}>
            Estas imágenes se mostrarán al momento de votar en un carrusel. Se pueden subir hasta 5 imágenes.
            {option.imagenes?.length > 0 && (
              <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
                {option.imagenes.map((file, i) => (
                  <img
                    key={i}
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 6 }}
                  />
                ))}
              </div>
            )}
          </p>
        </div>
      </div>
      <Field label="Color de la opción">
        <input
          type="color"
          value={option.color}
          onChange={(e) => onChange(index, { ...option, color: e.target.value })}
          style={{
            width: 60,
            height: 40,
            border: "none",
            background: "none",
            cursor: "pointer",
          }}
        />
      </Field>
    </div>
  );
}

const btnSecondaryStyle = {
  padding: "9px 16px",
  border: "1.5px solid var(--border)",
  borderRadius: 8,
  background: "var(--surface)",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 13,
  fontWeight: 500,
  color: "var(--text)",
  cursor: "pointer",
  boxShadow: "var(--shadow)",
  whiteSpace: "nowrap",
};

// ─── Grupos de personas a votar ──────────────────────────────────────────────
const GRUPOS = [
  ["Externos", "11°"],
  ["Profesores", "12°"],
  ["7°", "Todo el complejo educativo"],
  ["8°", "Solo estudiantes"],
  ["9°", "Cualquier persona"],
  ["10°", null],
];

// ─── Componente principal ────────────────────────────────────────────────────
export default function NuevaVotacion() {
  const [csvFiles, setCsvFiles] = useState([]);
  const [nombre, setNombre] = useState("");
  const [inicio, setInicio] = useState("");
  const [final, setFinal] = useState("");
  const [grupos, setGrupos] = useState({});
  const [oculto, setOculto] = useState(true);
  const [vigente, setVigente] = useState(true);
  const [options, setOptions] = useState([
    { nombre: "", descripcion: "", imagenes: [], color: "#6c5ce7" },
  ]);
  const [votacionTerminada, setVotacionTerminada] = useState(false);
  const TAG_OPTIONS = [
    "7°",
    "8°",
    "9°",
    "10°",
    "11°",
    "12°",
    "Profesores",
    "Todos",
    "No definido",
  ];

  const updateOptionColor = (index, color) =>
    setOptions((prev) =>
      prev.map((o, i) =>
        i === index ? { ...o, color } : o
      )
    );

  const toggleGrupo = (label) => setGrupos((prev) => ({ ...prev, [label]: !prev[label] }));

  const updateOption = (index, updated) =>
    setOptions((prev) => prev.map((o, i) => (i === index ? updated : o)));

  const addOption = () =>
    setOptions((prev) => [
      ...prev,
      { nombre: "", descripcion: "", imagenes: [], color: "#6c5ce7" },
    ]);

  const removeOption = (index) =>
    setOptions((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = () => {
    const formData = new FormData();

    formData.append("nombre", nombre);
    formData.append("inicio", inicio);
    formData.append("final", final);
    formData.append("oculto", oculto);
    formData.append("vigente", vigente);
    formData.append("grupos", JSON.stringify(grupos));

    if (csvFile) {
      formData.append("csv", csvFile);
    }

    options.forEach((opt, i) => {
      formData.append(`options[${i}][nombre]`, opt.nombre);
      formData.append(`options[${i}][descripcion]`, opt.descripcion);

      opt.imagenes?.forEach((img) => {
        formData.append(`options[${i}][imagenes]`, img);
      });
    });

    console.log("FORMDATA:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    alert("Listo (ver consola)");
  };

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 32px 80px" }}>

        {/* Título */}
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 600, paddingBottom: 20, borderBottom: "1.5px solid var(--border)", marginBottom: 36, letterSpacing: "-0.3px" }}>
          Nueva Votación
        </h1>

        {/* Nombre de la votación */}
        <Field label="Nombre de la votación">
          <TextInput placeholder="...." value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </Field>

        {/* Fechas */}
        <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            <Field label="Inicio">
              <DateInput value={inicio} onChange={(e) => setInicio(e.target.value)} />
            </Field>
          </div>
          <div style={{ flex: 1 }}>
            <Field label="Final">
              <DateInput value={final} onChange={(e) => setFinal(e.target.value)} />
            </Field>
          </div>
        </div>

        {/* Personas a votar */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 15, fontWeight: 600 }}>Personas a votar</span>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>Esto depende de como lleguen los datos*******</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 40px", marginBottom: 16 }}>
            {GRUPOS.map(([izq, der]) => (
              <>
                {izq && <CustomCheckbox key={izq} label={izq} checked={!!grupos[izq]} onChange={() => toggleGrupo(izq)} />}
                {der && <CustomCheckbox key={der} label={der} checked={!!grupos[der]} onChange={() => toggleGrupo(der)} />}
                {!der && <div />}
              </>
            ))}
          </div>

          {/* CSV */}
          {/* CSV */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 8 }}>
            <div style={{ textAlign: "right", maxWidth: 260 }}>

              <label style={btnSecondaryStyle}>
                Insertar Datos por CSV
                <input
                  type="file"
                  accept=".csv"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    const newFiles = files.map((f) => ({ file: f, tag: "" }));

                    setCsvFiles((prev) => [...prev, ...newFiles]);

                    // 🔥 reset para permitir volver a seleccionar el mismo archivo
                    e.target.value = null;
                  }}
                  style={{ display: "none" }}
                />
              </label>

              {/* Lista de archivos */}
              {csvFiles.length > 0 && (
                <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
                  {csvFiles.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                        padding: "8px 10px",
                        boxShadow: "var(--shadow)",
                        textAlign: "left",
                        position: "relative",
                      }}
                    >
                      {/* eliminar */}
                      <button
                        onClick={() => {
                          setCsvFiles((prev) => prev.filter((_, idx) => idx !== i));
                        }}
                        style={{
                          position: "absolute",
                          top: 6,
                          right: 8,
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                          fontSize: 14,
                          color: "var(--muted)",
                        }}
                      >
                        ×
                      </button>

                      {/* nombre archivo */}
                      <div style={{ fontSize: 12, marginBottom: 6 }}>
                        {item.file.name}
                      </div>

                      {/* tag */}
                      <select
                        value={item.tag}
                        onChange={(e) => {
                          const updated = [...csvFiles];
                          updated[i].tag = e.target.value;
                          setCsvFiles(updated);
                        }}
                        style={{
                          width: "100%",
                          padding: "6px 8px",
                          borderRadius: 6,
                          border: "1px solid var(--border)",
                          fontSize: 12,
                          outline: "none",
                          background: "var(--surface)",
                          color: item.tag ? "var(--text)" : "var(--muted)",
                        }}
                      >
                        <option value="">Seleccionar grupo...</option>
                        {TAG_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}

              <p style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 8, lineHeight: 1.5 }}>
                Importar los datos de las personas<br />
                legibles para esta votación.<br />
                (Esto les permitirá acceder y votar<br />
                cuando las votaciones se publiquen)
              </p>

            </div>
          </div>
        </div>

        <hr style={{ border: "none", borderTop: "1.5px solid var(--border)", margin: "36px 0" }} />

        {/* Visibilidad */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Visibilidad</div>

          {[
            { key: "oculto", val: oculto, set: setOculto, title: "Oculto", desc: "No se muestra a nadie que entre a la plataforma, solo tú lo podrás ver y modificar." },
            { key: "vigente", val: vigente, set: setVigente, title: "Vigente", desc: "A las personas se les mostrará la votación activa si esta vigente, de caso contrario lo podrán ver más no votar." },
          ].map(({ key, val, set, title, desc }) => (
            <div key={key} style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 22 }}>
              <Toggle checked={val} onChange={set} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{title}</div>
                <p style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.55, maxWidth: 260 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <hr style={{ border: "none", borderTop: "1.5px solid var(--border)", margin: "36px 0" }} />

        {/* Opciones */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Opciones</div>

          {options.map((opt, i) => (
            <OptionCard key={i} index={i} option={opt} onChange={updateOption} onRemove={removeOption} />
          ))}

          <button
            onClick={addOption}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "10px 20px",
              border: "1.5px solid var(--accent)",
              borderRadius: 99,
              background: "transparent",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13.5, fontWeight: 500,
              color: "var(--accent)",
              cursor: "pointer",
              transition: "background 0.2s, color 0.2s",
              marginTop: 8,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--accent)"; }}
          >
            <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Agrega Otra Opción +
          </button>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          style={{
            display: "block",
            marginLeft: "auto",
            marginTop: 32,
            padding: "12px 36px",
            border: "none",
            borderRadius: 99,
            background: "var(--accent)",
            color: "#fff",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14.5, fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 4px 18px rgba(108,92,231,0.25)",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(108,92,231,0.35)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 18px rgba(108,92,231,0.25)"; }}
        >
          Crear Votación
        </button>
        <button
          onClick={() => {
            const confirmar = window.confirm("¿Seguro que quieres terminar la votación?");
            if (confirmar) {
              setVotacionTerminada(true);

              // opcional: aquí podrías mandar a backend
              console.log("Votación terminada");

              alert("Votación finalizada");
            }
          }}
          style={{
            display: "block",
            marginLeft: "auto",
            marginTop: 12,
            padding: "12px 36px",
            border: "1.5px solid #e74c3c",
            borderRadius: 99,
            background: "transparent",
            color: "#e74c3c",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14.5,
            fontWeight: 600,
            cursor: "pointer",
            transition: "transform 0.15s, background 0.2s, color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#e74c3c";
            e.currentTarget.style.color = "#fff";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#e74c3c";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Terminar votación
        </button>
      </div>
    </>
  );
}
