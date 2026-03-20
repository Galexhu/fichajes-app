import { useState, useEffect } from "react";
import { getHistorial } from "../services/fichajes.js";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MESES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];
const DIAS_SEMANA = ["L","M","X","J","V","S","D"];

function getDiasDelMes(anio, mes) {
  const primero = new Date(anio, mes - 1, 1);
  const ultimo  = new Date(anio, mes, 0);
  // lunes=0 … domingo=6
  const offset  = (primero.getDay() + 6) % 7;
  const total   = ultimo.getDate();
  return { offset, total };
}

function estadoDia(fichas) {
  if (!fichas || fichas.length === 0) return null;
  const tipos = fichas.map(f => f.tipo);
  if (tipos.includes("entrada") && tipos.includes("salida")) return "completo";
  if (tipos.includes("entrada")) return "incompleto";
  return "solo_salida";
}

const DIA_STYLE = {
  completo:    "bg-emerald-400/80 text-white",
  incompleto:  "bg-amber-400/80 text-white",
  solo_salida: "bg-rose-400/80 text-white",
};

export default function CalendarioPage() {
  const hoy = new Date();
  const [mes, setMes]   = useState(hoy.getMonth() + 1);
  const [anio, setAnio] = useState(hoy.getFullYear());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

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

  const { offset, total } = getDiasDelMes(anio, mes);
  const jornadas = data?.jornadas || {};

  const celdas = [];
  // Empty cells before first day
  for (let i = 0; i < offset; i++) celdas.push(null);
  for (let d = 1; d <= total; d++) celdas.push(d);

  function isoFecha(d) {
    return `${anio}-${String(mes).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  }

  const esHoy = (d) =>
    d === hoy.getDate() && mes === hoy.getMonth() + 1 && anio === hoy.getFullYear();

  const fichasSelected = selected ? jornadas[isoFecha(selected)] || [] : [];

  return (
    <div className="glass rounded-2xl w-full max-w-md mx-4 px-6 py-8 shadow-2xl">
      {/* Nav */}
      <div className="flex items-center justify-between mb-5">
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

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-1">
        {DIAS_SEMANA.map(d => (
          <div key={d} className="text-center text-xs font-semibold text-brand-700 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      {loading
        ? <p className="text-center text-brand-600 py-8">Cargando…</p>
        : (
          <div className="grid grid-cols-7 gap-1">
            {celdas.map((d, i) => {
              if (!d) return <div key={`e-${i}`} />;
              const iso    = isoFecha(d);
              const fichas = jornadas[iso];
              const estado = estadoDia(fichas);
              const esFinSemana = ((i) % 7) >= 5;

              return (
                <button
                  key={iso}
                  onClick={() => setSelected(selected === d ? null : d)}
                  className={`
                    aspect-square rounded-lg text-sm font-medium flex items-center justify-center
                    transition-all duration-150 hover:scale-105
                    ${estado ? DIA_STYLE[estado] : esFinSemana ? "bg-white/20 text-gray-400" : "bg-white/30 text-brand-900"}
                    ${esHoy(d) ? "ring-2 ring-brand-600 ring-offset-1 ring-offset-transparent" : ""}
                    ${selected === d ? "scale-105 shadow-md" : ""}
                  `}
                >
                  {d}
                </button>
              );
            })}
          </div>
        )
      }

      {/* Legend */}
      <div className="flex gap-4 mt-4 justify-center">
        <LegendItem color="bg-emerald-400" label="Completo" />
        <LegendItem color="bg-amber-400"   label="Incompleto" />
        <LegendItem color="bg-rose-400"    label="Solo salida" />
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="mt-4 bg-white/40 rounded-xl p-4">
          <p className="text-sm font-semibold text-brand-900 mb-2">
            {new Date(isoFecha(selected) + "T00:00:00").toLocaleDateString("es-ES", {
              weekday: "long", day: "numeric", month: "long",
            })}
          </p>
          {fichasSelected.length === 0
            ? <p className="text-xs text-gray-500">Sin registros</p>
            : (
              <div className="flex flex-wrap gap-2">
                {fichasSelected.map(f => {
                  const h = new Date(f.timestamp);
                  const t = `${String(h.getHours()).padStart(2,"0")}:${String(h.getMinutes()).padStart(2,"0")}`;
                  return (
                    <span key={f.id} className="text-xs bg-white/70 rounded-full px-3 py-1 font-medium text-brand-800">
                      {f.tipo} {t}
                    </span>
                  );
                })}
              </div>
            )
          }
        </div>
      )}
    </div>
  );
}

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-3 h-3 rounded-sm ${color}`} />
      <span className="text-xs text-white/80">{label}</span>
    </div>
  );
}
