import api from "./api.js";

// ── Fichajes ──────────────────────────────────────────────
export const fichar = (payload = {}) => api.post("/fichajes/fichar", payload);
export const getFichajesHoy = () => api.get("/fichajes/hoy");
export const getHistorial = (mes, anio) =>
  api.get("/fichajes/historial", { params: { mes, anio } });

// ── Incidencias ───────────────────────────────────────────
export const getIncidencias = () => api.get("/incidencias/");
export const crearIncidencia = (payload) => api.post("/incidencias/", payload);
export const getIncidencia = (id) => api.get(`/incidencias/${id}`);

// ── Permisos ──────────────────────────────────────────────
export const getPermisos = (params = {}) => api.get("/permisos/", { params });
export const solicitarPermiso = (payload) => api.post("/permisos/", payload);
export const cancelarPermiso = (id) => api.delete(`/permisos/${id}`);

// ── Informes ──────────────────────────────────────────────
export const getInformeMensual = (mes, anio) =>
  api.get("/informes/mensual", { params: { mes, anio } });

// ── Auth ──────────────────────────────────────────────────
export const getMe = () => api.get("/auth/me");
