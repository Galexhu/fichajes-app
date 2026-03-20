import { useState, useEffect } from "react";
import { getInformeMensual } from "../services/fichajes.js";
import { ChevronLeft, ChevronRight, Clock, CalendarDays, TrendingUp } from "lucide-react";

const MESES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];

export default function InformePage() {
  const hoy = new Date();
  const [mes, setMes] = useState(hoy.getMonth() + 1);
  const [anio, setAnio] = useState(hoy.getFullYear());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getInformeMensual(mes, anio)
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

  const horasObj = Math.floor((data?.total_horas || 0));
  const minObj = Math.round(((data?.total_horas || 0) - horasObj) * 60);

  return (
    <div className="glass rounded-2xl w-full max-w-lg mx-4 px-6 py-8 shadow-2xl">
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

      {!loading && data && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <SummaryCard icon={Clock} label="Horas totales" value={`${horasObj}h ${minObj}m`} />
            <SummaryCard icon={CalendarDays} label="Días trabajados" value={data.dias_trabajados} />
            <SummaryCard
              icon={TrendingUp}
              label="Media diaria"
              value={data.dias_trabajados
                ? `${(data.total_horas / data.dias_trabajados).toFixed(1)}h`
                : "—"}
            />
          </div>

          {/* Daily detail */}
          <div className="flex flex-col gap-2">
            {(data.detalle || []).map((d) => {
              const pct = Math.min(100, (d.horas / 8) * 100);
              return (
                <div key={d.fecha} className="bg-white/40 rounded-xl p-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-brand-900">
                      {new Date(d.fecha + "T00:00:00").toLocaleDateString("es-ES", {
                        weekday: "short", day: "numeric",
                      })}
                    </span>
                    <span className="font-mono text-brand-700">{d.horas.toFixed(1)}h</span>
                  </div>
                  <div className="h-1.5 bg-white/50 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-brand-500 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white/40 rounded-xl p-3 flex flex-col items-center gap-1 text-center">
      <Icon size={18} className="text-brand-500" />
      <p className="font-display font-bold text-brand-900 text-lg leading-none">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}
