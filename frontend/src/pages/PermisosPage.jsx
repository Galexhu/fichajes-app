import { useState, useEffect } from "react";
import { getPermisos, solicitarPermiso, cancelarPermiso } from "../services/fichajes.js";
import { Plus, X, Umbrella, Heart, Briefcase, Baby, Gift, Flower2 } from "lucide-react";

const TIPOS = [
  { value: "vacaciones",         label: "Vacaciones",            icon: Umbrella },
  { value: "permiso_retribuido", label: "Permiso retribuido",    icon: Briefcase },
  { value: "baja_medica",        label: "Baja médica",           icon: Heart },
  { value: "lactancia",          label: "Lactancia",             icon: Baby },
  { value: "matrimonio",         label: "Matrimonio",            icon: Gift },
  { value: "fallecimiento",      label: "Fallecimiento familiar",icon: Flower2 },
  { value: "otro",               label: "Otro",                  icon: Briefcase },
];

const ESTADO_STYLE = {
  pendiente: "bg-amber-100 text-amber-700",
  aprobado:  "bg-emerald-100 text-emerald-700",
  rechazado: "bg-rose-100 text-rose-600",
  cancelado: "bg-gray-100 text-gray-500",
};

const FILTER_TABS = ["todos", "vacaciones", "permiso_retribuido", "baja_medica"];

export default function PermisosPage() {
  const [permisos, setPermisos]     = useState([]);
  const [loading, setLoading]       = useState(false);
  const [showForm, setShowForm]     = useState(false);
  const [filter, setFilter]         = useState("todos");
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState(null);
  const [form, setForm]             = useState({
    tipo: "vacaciones",
    fecha_inicio: "",
    fecha_fin: "",
    motivo: "",
  });

  const cargar = () => {
    setLoading(true);
    const params = filter !== "todos" ? { tipo: filter } : {};
    getPermisos(params)
      .then(({ data }) => setPermisos(data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { cargar(); }, [filter]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const { data } = await solicitarPermiso(form);
      setPermisos(p => [data.data, ...p]);
      setShowForm(false);
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "Error al enviar la solicitud");
    } finally {
      setSaving(false);
    }
  }

  async function handleCancelar(id) {
    if (!confirm("¿Cancelar esta solicitud?")) return;
    try {
      const { data } = await cancelarPermiso(id);
      setPermisos(p => p.map(x => x.id === id ? data.data : x));
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  }

  function resetForm() {
    setForm({ tipo: "vacaciones", fecha_inicio: "", fecha_fin: "", motivo: "" });
    setError(null);
  }

  return (
    <div className="glass rounded-2xl w-full max-w-lg mx-4 px-6 py-8 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display font-bold text-lg text-brand-900">Mis permisos</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 bg-brand-600 text-white text-sm font-medium
            px-4 py-2 rounded-full hover:bg-brand-700 transition-colors shadow"
        >
          <Plus size={15} /> Solicitar
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {FILTER_TABS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors
              ${filter === f
                ? "bg-brand-600 text-white shadow"
                : "bg-white/40 text-brand-800 hover:bg-white/60"}`}
          >
            {f === "todos" ? "Todos" : TIPOS.find(t => t.value === f)?.label || f}
          </button>
        ))}
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between mb-5">
              <h3 className="font-display font-bold text-brand-900">Nueva solicitud</h3>
              <button onClick={() => { setShowForm(false); resetForm(); }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Tipo */}
              <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                Tipo de permiso
                <select
                  value={form.tipo}
                  onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                >
                  {TIPOS.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </label>

              {/* Fechas */}
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                  Fecha inicio
                  <input
                    type="date"
                    required
                    value={form.fecha_inicio}
                    onChange={e => setForm(f => ({ ...f, fecha_inicio: e.target.value }))}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                  Fecha fin
                  <input
                    type="date"
                    required
                    value={form.fecha_fin}
                    min={form.fecha_inicio}
                    onChange={e => setForm(f => ({ ...f, fecha_fin: e.target.value }))}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                </label>
              </div>

              {/* Motivo */}
              <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                Motivo <span className="font-normal text-gray-400">(opcional)</span>
                <textarea
                  rows={3}
                  value={form.motivo}
                  onChange={e => setForm(f => ({ ...f, motivo: e.target.value }))}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none"
                  placeholder="Añade información adicional si lo deseas…"
                />
              </label>

              {error && <p className="text-rose-600 text-sm">{error}</p>}

              <div className="flex justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); resetForm(); }}
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
                  {saving ? "Enviando…" : "Solicitar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading && <p className="text-center text-brand-600 py-8">Cargando…</p>}

      {!loading && permisos.length === 0 && (
        <p className="text-center text-gray-500 text-sm py-8">Sin solicitudes</p>
      )}

      <div className="flex flex-col gap-3">
        {permisos.map(p => {
          const TipoIcon = TIPOS.find(t => t.value === p.tipo)?.icon || Briefcase;
          return (
            <div key={p.id} className="bg-white/40 rounded-xl p-4">
              <div className="flex justify-between items-start gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-0.5 p-2 bg-brand-100 rounded-lg">
                    <TipoIcon size={15} className="text-brand-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-brand-900">
                      {TIPOS.find(t => t.value === p.tipo)?.label || p.tipo}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {p.fecha_inicio} → {p.fecha_fin}
                      {p.dias_habiles != null && (
                        <span className="ml-2 text-brand-600 font-medium">
                          ({p.dias_habiles} día{p.dias_habiles !== 1 ? "s" : ""} hábil{p.dias_habiles !== 1 ? "es" : ""})
                        </span>
                      )}
                    </p>
                    {p.motivo && (
                      <p className="text-xs text-gray-500 mt-1 truncate">{p.motivo}</p>
                    )}
                    {p.comentario_admin && (
                      <p className="text-xs text-brand-700 mt-1 italic">
                        Respuesta: {p.comentario_admin}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${ESTADO_STYLE[p.estado] || "bg-gray-100 text-gray-600"}`}>
                    {p.estado}
                  </span>
                  {p.estado === "pendiente" && (
                    <button
                      onClick={() => handleCancelar(p.id)}
                      className="text-xs text-gray-400 hover:text-rose-500 transition-colors"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
