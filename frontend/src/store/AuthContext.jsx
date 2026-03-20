import { createContext, useContext, useReducer, useEffect } from "react";
import api from "../services/api.js";

const AuthContext = createContext(null);

const initialState = {
  token: localStorage.getItem("access_token") || null,
  user: JSON.parse(localStorage.getItem("user") || "null"),
  loading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, loading: true, error: null };
    case "LOGIN_SUCCESS":
      return { ...state, loading: false, token: action.token, user: action.user };
    case "LOGIN_ERROR":
      return { ...state, loading: false, error: action.error };
    case "LOGOUT":
      return { ...initialState, token: null, user: null };
    case "SET_USER":
      return { ...state, user: action.user };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Persist token
  useEffect(() => {
    if (state.token) {
      localStorage.setItem("access_token", state.token);
      api.defaults.headers.common["Authorization"] = `Bearer ${state.token}`;
    } else {
      localStorage.removeItem("access_token");
      delete api.defaults.headers.common["Authorization"];
    }
  }, [state.token]);

  useEffect(() => {
    if (state.user) {
      localStorage.setItem("user", JSON.stringify(state.user));
    } else {
      localStorage.removeItem("user");
    }
  }, [state.user]);

  async function login(email, password) {
    dispatch({ type: "LOGIN_START" });
    try {
      const { data } = await api.post("/auth/login", { email, password });
      dispatch({ type: "LOGIN_SUCCESS", token: data.data.access_token, user: data.data.user });
      localStorage.setItem("refresh_token", data.data.refresh_token);
      return { ok: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Error de conexión";
      dispatch({ type: "LOGIN_ERROR", error: msg });
      return { ok: false, error: msg };
    }
  }

  function logout() {
    localStorage.removeItem("refresh_token");
    dispatch({ type: "LOGOUT" });
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
