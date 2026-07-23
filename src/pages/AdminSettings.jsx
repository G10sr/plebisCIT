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
 */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../assets/css/AdminSettings.css";
import GlobalLoader from "../components/GlobalLoader";

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
function TextInput({ placeholder, value, onChange, disabled = false }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      style={{
        ...inputStyle,
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? "not-allowed" : "text",
        borderColor: focused && !disabled ? "var(--accent)" : "var(--border)",
        boxShadow: focused && !disabled ? "0 0 0 3px var(--accent-light)" : "var(--shadow)",
      }}
      onFocus={() => !disabled && setFocused(true)}
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
function DateInput({ value, onChange, type = "date" }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <input
        type={type}
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
function OptionCard({ index, option, onChange, onRemove, nombreOriginal }) {
  const update = (key) => (e) => onChange(index, { ...option, [key]: e.target.value });
  const handleFiles = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    const newImages = files.map(f => ({ file: f, preview: URL.createObjectURL(f), isNew: true }));
    // Limitar a 5 imágenes máximo
    const combined = [...(option.imagenes || []), ...newImages].slice(0, 5);
    onChange(index, { ...option, imagenes: combined });
  };

  const handleDelete = async () => {
    if (!option.id) {
      onRemove(index);
      return;
    }

    const confirmDelete = window.confirm("¿Eliminar esta opción?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `/api/voting/${encodeURIComponent(nombreOriginal)}/option/${option.id}`,
        { method: "DELETE" }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error(data);
        throw new Error(data.error || "Error eliminando opción");
      }

      onRemove(index);
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar la opción");
    }
  };

  const removeImage = (imgIndex) => {
    const updated = (option.imagenes || []).filter((_, i) => i !== imgIndex);
    onChange(index, { ...option, imagenes: updated });
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
          onClick={handleDelete}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--muted)",
            fontSize: 18,
            lineHeight: 1,
            padding: "2px 6px",
            borderRadius: 6,
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
          <div style={{ fontSize: 12, color: "var(--muted)", textAlign: "right", lineHeight: 1.5, maxWidth: 180 }}>
            <div>Estas imágenes se mostrarán al momento de votar en un carrusel. Se pueden subir hasta 5 imágenes.</div>
            {option.imagenes?.length > 0 && (
              <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
                {option.imagenes.map((img, i) => (
                  <div key={img.preview || img || i} style={{ position: "relative" }}>
                    <img
                      src={img.preview || img}
                      alt="preview"
                      style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 6 }}
                    />
                    <button
                      onClick={() => removeImage(i)}
                      style={{
                        position: "absolute",
                        top: -5,
                        right: -5,
                        background: "#e74c3c",
                        color: "#fff",
                        border: "none",
                        borderRadius: "50%",
                        width: 20,
                        height: 20,
                        fontSize: 12,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
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



// ─── Componente principal ────────────────────────────────────────────────────
export default function NuevaVotacion() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adminUUID, setAdminUUID] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const isNewVoting = !id || id === "new";
  const [loading, setLoading] = useState(!isNewVoting);
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
  const [nombreOriginal, setNombreOriginal] = useState("");
  const [csvSections, setCsvSections] = useState([]);

useEffect(() => {
  const loadSections = async () => {

    try {

      const res = await fetch("/api/csv-sections");
      const data = await res.json();
      setCsvSections(data.sections || []);
    } catch (err) {
      console.error(err);
    }
  };
  loadSections();

}, []);


  // ─── Cargar datos si es edición ───────────────────────────────────────
  useEffect(() => {
    const storedUuid = localStorage.getItem("adminUUID");
    if (!storedUuid) {
      navigate("/admin", { replace: true });
      return;
    }
    setAdminUUID(storedUuid);
  }, [navigate]);

  useEffect(() => {
    if (!isNewVoting && id) {
      loadVotingData(id);
    }
  }, [id, isNewVoting]);

  const formatDateTimeForInput = (value) => {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    const timezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
  };

  const loadVotingData = async (votingName) => {
    try {
      const res = await fetch(`/api/voting/${votingName}`);
      if (!res.ok) {
        console.error("Error cargando votación");
        setLoading(false);
        return;
      }

      const data = await res.json();

      setNombre(data.Name);
      setNombreOriginal(data.Name);
      setInicio(formatDateTimeForInput(data.Start_time));
      setFinal(formatDateTimeForInput(data.End_time));
      setOculto(data.Oculto ?? false);
      setVigente(data.Vigente ?? true);

      if (data.options && data.options.length > 0) {
        setOptions(data.options.map(opt => ({
          nombre: opt.name ?? opt.Name ?? opt.nombre ?? "",
          descripcion: opt.description ?? opt.Des ?? opt.descripcion ?? "",
          imagenes: opt.images ?? opt.imagenes ?? [],
          color: opt.color ?? opt.Color ?? "#6c5ce7",
          id: opt.id ?? opt.ID ?? null
        })));
      }

      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Error cargando la votación");
      setLoading(false);
    }
  };

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

  const parseCsvFile = async (file, defaultGroup = "") => {
    const text = await file.text();

    const lines = text
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(Boolean);

    if (!lines.length) return [];

    const headerLine = lines[0];

    // detectar separador real
    let delimiter = ",";
    if (headerLine.includes(";")) delimiter = ";";
    else if (headerLine.includes("\t")) delimiter = "\t";

    const headers = headerLine
      .split(delimiter)
      .map(h => h.trim().toLowerCase());

    return lines.slice(1).map(line => {
      const values = line.split(delimiter).map(v => v.trim());

      const row = {};

      headers.forEach((h, i) => {
        row[h] = values[i];
      });

      return {
        ced: row.ced || row.cedula || row.id || "",
        nombre: row.nombre || row.name || "",
        grado: row.grado || row.grade || defaultGroup || "",
      };
    }).filter(r => r.ced && r.nombre);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!adminUUID) {
      alert("Credencial de administrador inválida. Vuelve a iniciar sesión.");
      navigate("/admin", { replace: true });
      return;
    }

    setIsSubmitting(true);
    try {
      // Validar campos obligatorios
      if (!nombre.trim()) {
        alert("El nombre de la votación es obligatorio");
        return;
      }

      if (!inicio || !final) {
        alert("Las fechas de inicio y fin son obligatorias");
        return;
      }

      if (options.some(opt => !opt.nombre.trim() || !opt.descripcion.trim())) {
        alert("Todas las opciones deben tener nombre y descripción");
        return;
      }

      // Preparar opciones con imágenes comprimidas
      const optionsToSend = await Promise.all(options.map(async (opt) => {
        const imagenes = await Promise.all((opt.imagenes || []).map(async (img) => {
          // Si es un string (URL), devolverlo tal cual
          if (typeof img === 'string') return img;
          // Si es un objeto con preview (archivo nuevo)
          if (img.preview && img.file) {
            return new Promise((resolve) => {
              compressImage(img.file, (compressedBase64) => {
                resolve(compressedBase64);
              });
            });
          }
          return null;
        }));

        return {
          id: opt.id || null,
          nombre: opt.nombre,
          descripcion: opt.descripcion,
          color: opt.color,
          imagenes: imagenes.filter(Boolean)
        };
      }));

      const payload = {
        nombre,
        inicio,
        final,
        oculto,
        vigente,
        grupos,
        options: optionsToSend,
        adminUUID: adminUUID
      };

      const url = isNewVoting
        ? "/api/voting/create"
        : `/api/voting/update/${nombreOriginal}`;

      const res = await fetch(url, {
        method: isNewVoting ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        alert("Error: " + (data.error || "No se pudo guardar la votación"));
        return;
      }

      const nombreParaImportar = nombre;



      alert(isNewVoting ? "✓ Votación creada exitosamente" : "✓ Votación actualizada exitosamente");

      if (isNewVoting) {
        // Limpiar formulario
        setNombre("");
        setInicio("");
        setFinal("");
        setNombreOriginal("");
        setOptions([{ nombre: "", descripcion: "", imagenes: [], color: "#6c5ce7" }]);
      }
      window.location.href = "/menuvotingAdmin";
      setIsSubmitting(false);

    } catch (err) {
      console.error(err);
      alert("Error inesperado: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Función para comprimir imágenes ──────────────────────────────────
  const compressImage = (file, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Redimensionar si la imagen es muy grande
        const MAX_SIZE = 800;
        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Comprimir a JPEG con calidad 0.7
        canvas.toBlob((blob) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            callback(reader.result);
          };
        }, 'image/jpeg', 0.7);
      };
    };
  };

  const handleDeleteVoting = async () => {
    if (isSubmitting) return;

    const confirmar = window.confirm(`¿Seguro que deseas ELIMINAR la votación "${nombreOriginal}"? Esta acción NO se puede deshacer y eliminará todas las tablas relacionadas.`);
    if (!confirmar) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/voting/${nombreOriginal}`, {
        method: "DELETE"
      });

      const data = await res.json();

      if (!res.ok) {
        alert("Error: " + (data.error || "No se pudo eliminar la votación"));
        return;
      }

      alert("✓ Votación eliminada completamente");
      window.location.href = "/menuvotingAdmin";
    } catch (err) {
      console.error(err);
      alert("Error inesperado al eliminar: " + err.message);
    }
  };


  return (
    <>
      <GlobalLoader
        show={isSubmitting}
        text={
          isNewVoting
            ? "Creando votación..."
            : "Guardando cambios..."
        }
      />

      <div className="admin-settings-page">

        {/* Mostrar loader mientras carga */}
        {loading && (
          <GlobalLoader show text="Cargando opciones..." />
        )}

        {!loading && (
          <>
            {/* Título */}
            <h1 className="admin-settings-title">
              {isNewVoting ? "Nueva Votación" : `Editar: ${nombreOriginal}`}
            </h1>

            {/* Nombre de la votación */}
            <Field label="Nombre de la votación" required>
              <TextInput
                placeholder="...."
                value={nombre}
                onChange={(e) => {
                  if (!isNewVoting) return;

                  const value = e.target.value;

                  // Permitir letras, números y espacios
                  const cleaned = value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚ\s]/g, "");

                  setNombre(cleaned);
                }}
                disabled={!isNewVoting}
              />
              {!isNewVoting && (
                <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>
                  * El nombre no se puede cambiar en votaciones existentes
                </p>
              )}
            </Field>

            {/* Fechas */}
            <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
              <div style={{ flex: 1 }}>
                <Field label="Inicio">
                  <DateInput type="datetime-local" value={inicio} onChange={(e) => setInicio(e.target.value)} />
                </Field>
              </div>
              <div style={{ flex: 1 }}>
                <Field label="Final">
                  <DateInput type="datetime-local" value={final} onChange={(e) => setFinal(e.target.value)} />
                </Field>
              </div>
            </div>

            {/* Personas a votar */}
            <div style={{ marginBottom: 40, display: "flex", flexDirection: "column", gap: 22 }}>
              <h3>
                Personas a votar
              </h3>
              {
                csvSections.length === 0 ? (
                  <p>
                    No hay secciones disponibles.
                  </p>
                ) : (
                  csvSections.map(section => (
                    <CustomCheckbox
                      key={section}
                      label={section}
                      checked={grupos[section] || false}
                      onChange={() => toggleGrupo(section)}
                    />
                  ))
                )
              }
            </div>


            <hr style={{ border: "none", borderTop: "1.5px solid var(--border)", margin: "36px 0" }} />

            {/* Visibilidad */}
            <div style={{ marginBottom: 40 }}>
              <div className="admin-settings-section-title">Visibilidad</div>

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
              <div className="admin-settings-section-title">Opciones</div>

              {options.map((opt, i) => (
                <OptionCard
                  key={opt.id || i}
                  index={i}
                  option={opt}
                  onChange={updateOption}
                  onRemove={removeOption}
                  nombreOriginal={nombreOriginal}
                />
              ))}

              <button
                onClick={addOption}
                className="admin-settings-add-option-button"
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
              disabled={isSubmitting}
              className="admin-settings-submit-button"
            >
              {isNewVoting ? "Crear Votación" : "Guardar Cambios"}
            </button>

            {/* Botón eliminar - solo para votaciones existentes */}
            {!isNewVoting && (
              <button
                onClick={handleDeleteVoting}
                disabled={isSubmitting}
                className="admin-settings-delete-button"
              >
                🗑️ Eliminar Votación
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
}
