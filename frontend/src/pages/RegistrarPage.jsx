import { useClock } from "../hooks/useClock.js";
import { useFichajes } from "../hooks/useFichajes.js";
import { Clock } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const TIPO_LABEL = {
  entrada: "Entrada",
  salida:  "Salida",
  pausa:   "Pausa",
  vuelta:  "Vuelta",
};

const TIPO_COLOR = {
  entrada: "text-emerald-600",
  salida:  "text-rose-500",
  pausa:   "text-amber-500",
  vuelta:  "text-sky-500",
};

export default function RegistrarPage() {
  const { hh, mm, fecha, now } = useClock();
  const { fichasHoy, loading, error, success, proximoTipo, registrarFichaje } =
    useFichajes();

  const fechaLarga = format(now, "EEEE d 'de' MMMM yyyy", { locale: es });

  return (
    <div className="glass rounded-2xl w-full max-w-sm mx-4 flex flex-col items-center gap-6 px-8 py-10 shadow-2xl">
      {/* Title */}
      <h1
        className="font-display text-xl font-bold tracking-wide"
        style={{ color: "#2d1e5a" }}
      >
        Registra tu jornada
      </h1>

      {/* Clock */}
      <div
        className="font-display text-6xl font-bold tracking-widest select-none"
        style={{ color: "#2d1e5a", letterSpacing: "0.12em" }}
      >
        {hh}<span className="opacity-50 animate-pulse">:</span>{mm}
      </div>

      {/* Fichar button */}
      <button
        onClick={registrarFichaje}
        disabled={loading}
        className="btn-fichar flex items-center gap-2.5 px-7 py-3 rounded-full font-semibold text-sm
          bg-white/70 text-brand-800 border border-white/60 shadow-lg
          hover:bg-white/90 active:scale-95 transition-all duration-150 disabled:opacity-50"
      >
        <Clock size={17} className="text-brand-600" />
        {loading ? "Registrando…" : "Fichar"}
      </button>

      {/* Feedback */}
      {success && (
        <p className="text-emerald-700 text-sm font-medium bg-emerald-50/80 rounded-lg px-4 py-2">
          ✓ {success}
        </p>
      )}
      {error && (
        <p className="text-rose-600 text-sm font-medium bg-rose-50/80 rounded-lg px-4 py-2">
          {error}
        </p>
      )}

      {/* Date */}
      <p className="text-sm font-medium capitalize" style={{ color: "#3a2860" }}>
        Tu jornada de hoy {fecha}
      </p>

      {/* Today's punches */}
      {fichasHoy.length > 0 && (
        <div className="w-full border-t border-white/30 pt-4 flex flex-col gap-2">
          {fichasHoy.map((f) => {
            const hora = new Date(f.timestamp);
            const hhmm = `${String(hora.getHours()).padStart(2, "0")}:${String(hora.getMinutes()).padStart(2, "0")}`;
            return (
              <div key={f.id} className="flex justify-between items-center text-sm">
                <span className={`font-semibold ${TIPO_COLOR[f.tipo] || "text-gray-700"}`}>
                  {TIPO_LABEL[f.tipo] || f.tipo}
                </span>
                <span className="text-gray-600 font-mono">{hhmm}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Next action hint */}
      <p className="text-xs text-white/60">
        Próximo fichaje:{" "}
        <span className="font-semibold text-white/80">
          {TIPO_LABEL[proximoTipo()] || "Entrada"}
        </span>
      </p>
    </div>
  );
}
