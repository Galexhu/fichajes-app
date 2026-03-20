import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import { useAuth } from "../../store/AuthContext.jsx";
import Sidebar from "./Sidebar.jsx";
import SkyBackground from "./SkyBackground.jsx";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <SkyBackground />

      {/* Topbar */}
      <header className="relative z-20 flex items-center justify-between px-5 py-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
        >
          <Menu size={22} />
          <span className="text-sm font-medium">Registrar</span>
        </button>

        <span className="text-sm text-white/80 font-medium">
          {user ? `Hola, ${user.nombre_completo}` : ""}
        </span>
      </header>

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Page content */}
      <main className="relative z-10 flex items-start justify-center pt-4 pb-20 min-h-[calc(100vh-60px)]">
        <Outlet />
      </main>
    </div>
  );
}
