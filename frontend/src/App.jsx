import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./store/AuthContext.jsx";
import Layout from "./components/layout/Layout.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegistrarPage from "./pages/RegistrarPage.jsx";
import HistorialPage from "./pages/HistorialPage.jsx";
import IncidenciasPage from "./pages/IncidenciasPage.jsx";
import InformePage from "./pages/InformePage.jsx";
import CalendarioPage from "./pages/CalendarioPage.jsx";
import PermisosPage from "./pages/PermisosPage.jsx";
import PerfilPage from "./pages/PerfilPage.jsx";

function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/registrar" replace />} />
        <Route path="registrar"    element={<RegistrarPage />} />
        <Route path="historial"    element={<HistorialPage />} />
        <Route path="incidencias"  element={<IncidenciasPage />} />
        <Route path="informe"      element={<InformePage />} />
        <Route path="calendario"   element={<CalendarioPage />} />
        <Route path="permisos"     element={<PermisosPage />} />
        <Route path="perfil"       element={<PerfilPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
