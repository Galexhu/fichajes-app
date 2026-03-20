import { useAuth } from "../store/AuthContext.jsx";
import { User, Mail, Shield, CheckCircle } from "lucide-react";

export default function PerfilPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="glass rounded-2xl w-full max-w-sm mx-4 px-8 py-10 shadow-2xl flex flex-col items-center gap-6">
      {/* Avatar */}
      <div className="w-20 h-20 rounded-full bg-brand-600 flex items-center justify-center shadow-lg">
        <span className="font-display font-bold text-white text-3xl">
          {user.nombre?.[0]?.toUpperCase() || "U"}
        </span>
      </div>

      {/* Name */}
      <div className="text-center">
        <h2 className="font-display font-bold text-xl text-brand-900">{user.nombre_completo}</h2>
        <span className="inline-block mt-1 bg-brand-100 text-brand-700 text-xs font-semibold px-3 py-1 rounded-full capitalize">
          {user.rol}
        </span>
      </div>

      {/* Details */}
      <div className="w-full flex flex-col gap-3">
        <InfoRow icon={Mail}   label="Email"  value={user.email} />
        <InfoRow icon={User}   label="Nombre" value={user.nombre} />
        <InfoRow icon={Shield} label="Rol"    value={user.rol} />
        <InfoRow
          icon={CheckCircle}
          label="Estado"
          value={user.activo ? "Activo" : "Inactivo"}
          valueClass={user.activo ? "text-emerald-600" : "text-rose-500"}
        />
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, valueClass = "text-brand-900" }) {
  return (
    <div className="flex items-center gap-3 bg-white/40 rounded-xl px-4 py-3">
      <Icon size={16} className="text-brand-500 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className={`text-sm font-semibold truncate ${valueClass}`}>{value}</p>
      </div>
    </div>
  );
}
