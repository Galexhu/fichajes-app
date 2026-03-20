import { useState, useEffect } from "react";
import { getHistorial } from "../services/fichajes.js";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MESES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];

const TIPO_COLOR = {
  entrada: "bg-emerald-100 text-emerald-700",
  salida:  "bg-rose-100 text-rose-600",
  pausa:   "bg-amber-100 text-amber-700",
  vuelta:  "bg-sky-100 text-sky-700",
};

export default function HistorialPage() {
  const hoy = new Date();
  const [mes, setMes] = useState(hoy.getMonth() + 1);
  const [anio, setAnio] = useState(hoy.getFullYear());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getHistorial(mes, anio)
      .then(({ data: r }) => setData(r.data))
      .finally(() => setLoading(false));
  }, [mes, anio]);

  function prev() {
    if (mes === 1) { setMes(12); setAnio(a => a - 1); }
    else setMes(m => m - 1);
  }
  function next() {
    if (mes === 12) { setMes(1); setAnio(a => a + 1); }
    else setMes(m => m + 1);
  }

  const jornadas = data?.jornadas || {};
  const dias = Object.keys(jornadas).sort();

  return (
    <div className="glass rounded-2xl w-full max-w-lg mx-4 px-6 py-8 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={prev} className="p-1 text-brand-700 hover:text-brand-900">
          <ChevronLeft size={20} />
        </button>
        <h2 className="font-display font-bold text-lg text-brand-900">
          {MESES[mes - 1]} {anio}
        </h2>
        <button onClick={next} className="p-1 text-brand-700 hover:text-brand-900">
          <ChevronRight size={20} />
        </button>
      </div>

      {loading && <p className="text-center text-brand-600 py-8">Cargando…</p>}

      {!loading && dias.length === 0 && (
        <p className="text-center text-gray-500 py-8 text-sm">
          Sin registros para este mes
        </p>
      )}

      <div className="flex flex-col gap-4">
        {dias.map((dia) => {
          const fichas = jornadas[dia];
          const [, , d] = dia.split("-");
          return (
            <div key={dia} className="bg-white/40 rounded-xl p-4">
              <p className="text-xs font-semibold text-brand-700 mb-2 uppercase tracking-wide">
                {new Date(dia + "T00:00:00").toLocaleDateString("es-ES", {
                  weekday: "long", day: "numeric", month: "long",
                })}
              </p>
              <div className="flex flex-wrap gap-2">
                {fichas.map((f) => {
                  const h = new Date(f.timestamp);
                  const t = `${String(h.getHours()).padStart(2,"0")}:${String(h.getMinutes()).padStart(2,"0")}`;
                  return (
                    <span
                      key={f.id}
                      className={`text-xs font-medium px-3 py-1 rounded-full ${TIPO_COLOR[f.tipo] || "bg-gray-100 text-gray-600"}`}
                    >
                      {f.tipo} {t}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
