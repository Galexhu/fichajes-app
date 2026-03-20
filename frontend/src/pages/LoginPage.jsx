import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext.jsx";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import SkyBackground from "../components/layout/SkyBackground.jsx";

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPass, setShowPass]   = useState(false);
  const [error, setError]         = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const result = await login(email, password);
    if (result.ok) {
      navigate("/registrar", { replace: true });
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <SkyBackground />

      <div className="relative z-10 glass rounded-2xl w-full max-w-sm mx-4 px-8 py-10 shadow-2xl flex flex-col items-center gap-6">
        {/* Logo / Title */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-2xl bg-brand-600 shadow-lg flex items-center justify-center">
            <Lock size={26} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-2xl text-brand-900">Fichajes</h1>
          <p className="text-sm text-gray-500">Accede a tu cuenta corporativa</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          {/* Email */}
          <label className="flex flex-col gap-1.5 text-sm font-medium text-brand-900">
            Correo electrónico
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="nombre@empresa.com"
                className="w-full pl-9 pr-4 py-2.5 bg-white/70 border border-white/60 rounded-xl
                  text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2
                  focus:ring-brand-400 transition"
              />
            </div>
          </label>

          {/* Password */}
          <label className="flex flex-col gap-1.5 text-sm font-medium text-brand-900">
            Contraseña
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPass ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 bg-white/70 border border-white/60 rounded-xl
                  text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2
                  focus:ring-brand-400 transition"
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          {/* Error */}
          {error && (
            <p className="text-sm text-rose-600 bg-rose-50/80 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold
              py-3 rounded-xl shadow-lg transition-all duration-150 active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Accediendo…" : "Entrar"}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center">
          Acceso exclusivo para empleados.<br />
          Contacta con RRHH si no puedes acceder.
        </p>
      </div>
    </div>
  );
}
