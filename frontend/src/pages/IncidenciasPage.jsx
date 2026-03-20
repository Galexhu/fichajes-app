import { useState, useEffect } from "react";
import { getIncidencias, crearIncidencia } from "../services/fichajes.js";
import { Plus, X } from "lucide-react";

const TIPOS = [
  { value: "olvido_entrada",      label: "Olvido de entrada" },
  { value: "olvido_salida",       label: "Olvido de salida" },
  { value: "error_horario",       label: "Error de horario" },
  { value: "ausencia_justificada",label: "Ausencia justificada" },
  { value: "otro",                label: "Otro" },
];

const ESTADO_STYLE = {
  pendiente: "bg-amber-100 text-amber-700",
  aprobada:  "bg-emerald-100 text-emerald-700",
  rechazada: "bg-rose-100 text-rose-600",
};

export default function IncidenciasPage() {
  const [incidencias, setIncidencias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ fecha: "", tipo: "olvido_entrada", descripcion: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getIncidencias()
      .then(({ data }) => setIncidencias(data.data || []))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const { data } = await crearIncidencia(form);
      setIncidencias((prev) => [data.data, ...prev]);
      setShowForm(false);
      setForm({ fecha: "", tipo: "olvido_entrada", descripcion: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear incidencia");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="glass rounded-2xl w-full max-w-lg mx-4 px-6 py-8 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-bold text-lg text-brand-900">
          Mis incidencias
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 bg-brand-600 text-white text-sm font-medium
            px-4 py-2 rounded-full hover:bg-brand-700 transition-colors shadow"
        >
          <Plus size={15} /> Nueva
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
            <div className="flex justify-between mb-5">
              <h3 className="font-display font-bold text-brand-900">Nueva incidencia</h3>
              <button onClick={() => setShowForm(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                Fecha
                <input
                  type="date"
                  required
                  value={form.fecha}
                  onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-brand-500"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                Tipo
                <select
                  value={form.tipo}
                  onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                >
                  {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                Descripción
                <textarea
                  rows={3}
                  value={form.descripcion}
                  onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none"
                  placeholder="Describe lo ocurrido…"
                />
              </label>
              {error && <p className="text-rose-600 text-sm">{error}</p>}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-brand-600 text-white px-5 py-2 rounded-lg text-sm font-medium
                    hover:bg-brand-700 disabled:opacity-50"
                >
                  {saving ? "Guardando…" : "Enviar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading && <p className="text-center text-brand-600 py-8">Cargando…</p>}

      {!loading && incidencias.length === 0 && (
        <p className="text-center text-gray-500 text-sm py-8">Sin incidencias</p>
      )}

      <div className="flex flex-col gap-3">
        {incidencias.map((inc) => (
          <div key={inc.id} className="bg-white/40 rounded-xl p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-brand-900">
                  {TIPOS.find(t => t.value === inc.tipo)?.label || inc.tipo}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{inc.fecha}</p>
                {inc.descripcion && (
                  <p className="text-xs text-gray-600 mt-1">{inc.descripcion}</p>
                )}
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${ESTADO_STYLE[inc.estado] || "bg-gray-100 text-gray-600"}`}>
                {inc.estado}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
