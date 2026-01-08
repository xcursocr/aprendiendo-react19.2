import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { createAuthApi } from "../../api/authApi";
import { apiClient } from "../../api/client";
import { tokenStore } from "../../api/tokenStore";

const AuthContext = createContext(null);

const authApi = createAuthApi({ http: apiClient });

const initialState = {
  user: null,
  token: tokenStore.get(),
  loading: true,
};

function authReducer(state, action) {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.user, loading: false };
    case "LOGIN":
      return {
        ...state,
        user: action.user,
        token: action.token,
        loading: false,
      };
    case "LOGOUT":
      return { ...state, user: null, token: null, loading: false };
    case "SET_LOADING":
      return { ...state, loading: action.loading };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Cargar perfil al inicio si hay token
  useEffect(() => {
    if (!state.token) {
      dispatch({ type: "SET_LOADING", loading: false });
      return;
    }

    authApi
      .getProfile()
      .then((res) => dispatch({ type: "SET_USER", user: res.data }))
      .catch(() => {
        tokenStore.clear();
        dispatch({ type: "LOGOUT" });
      });
  }, [state.token]);

  const login = useCallback(async (credentials) => {
    const res = await authApi.login(credentials);
    const { token, user } = res.data;
    tokenStore.set(token);
    dispatch({ type: "LOGIN", user, token });
  }, []);

  const register = useCallback(async (userData) => {
    const res = await authApi.register(userData);
    const { token, user } = res.data;
    tokenStore.set(token);
    dispatch({ type: "LOGIN", user, token });
  }, []);

  const logout = useCallback(() => {
    tokenStore.clear();
    dispatch({ type: "LOGOUT" });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}
