import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/AuthContext.jsx";
import {
  Clock,
  History,
  AlertCircle,
  BarChart2,
  Calendar,
  Umbrella,
  User,
  BookOpen,
  LogOut,
  X,
  ChevronLeft,
} from "lucide-react";

const NAV = [
  { to: "/registrar",   label: "Registrar",        icon: Clock },
  { to: "/historial",   label: "Mi historial",      icon: History },
  { to: "/incidencias", label: "Mis incidencias",   icon: AlertCircle, badge: true },
  { to: "/informe",     label: "Mi informe",        icon: BarChart2 },
  { to: "/calendario",  label: "Mi calendario",     icon: Calendar },
  { to: "/permisos",    label: "Mis permisos",      icon: Umbrella },
  { to: "/perfil",      label: "Mi perfil",         icon: User },
  { to: "#manual",      label: "Manual de uso",     icon: BookOpen },
];

export default function Sidebar({ open, onClose, incidenciasPendientes = 0 }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed left-0 top-0 z-40 h-full w-60 bg-white/95 backdrop-blur-md shadow-2xl
          transform transition-transform duration-220 ease-out
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:text-brand-900"
          >
            <ChevronLeft size={16} />
            Menú
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="mt-2 px-2 flex flex-col gap-0.5">
          {NAV.map(({ to, label, icon: Icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              onClick={to !== "#manual" ? onClose : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive
                  ? "bg-brand-50 text-brand-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`
              }
            >
              <Icon size={18} />
              <span className="flex-1">{label}</span>
              {badge && incidenciasPendientes > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {incidenciasPendientes > 9 ? "9+" : incidenciasPendientes}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Divider + Logout */}
        <div className="absolute bottom-6 left-0 right-0 px-4">
          <hr className="border-gray-100 mb-3" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium
              text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            Salir
          </button>
        </div>
      </aside>
    </>
  );
}
