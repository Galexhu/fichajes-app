import { useState, useEffect, useCallback } from "react";
import { fichar, getFichajesHoy } from "../services/fichajes.js";

export function useFichajes() {
  const [fichasHoy, setFichasHoy] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const cargarHoy = useCallback(async () => {
    try {
      const { data } = await getFichajesHoy();
      setFichasHoy(data.data || []);
    } catch {
      // silencioso
    }
  }, []);

  useEffect(() => {
    cargarHoy();
  }, [cargarHoy]);

  // Determinar próximo tipo de fichaje
  const proximoTipo = () => {
    const mapa = { 0: "entrada", 1: "salida", 2: "vuelta", 3: "salida" };
    return mapa[(fichasHoy.length % 4)] || "entrada";
  };

  const registrarFichaje = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const { data } = await fichar();
      setSuccess(`Fichaje de ${data.data.tipo} registrado`);
      await cargarHoy();
    } catch (err) {
      setError(err.response?.data?.message || "Error al fichar");
    } finally {
      setLoading(false);
    }
  };

  return {
    fichasHoy,
    loading,
    error,
    success,
    proximoTipo,
    registrarFichaje,
    cargarHoy,
  };
}
