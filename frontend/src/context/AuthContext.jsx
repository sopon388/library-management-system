import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("library_token");

    if (!token) {
      return setLoading(false);
    }

    api
      .get("/auth/me")
      .then((r) => setUser(r.data))
      .catch(() => localStorage.removeItem("library_token"))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const { data } = await api.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem(
      "library_token",
      data.token
    );

    setUser(data.user);
  }

  async function register(payload) {
    const { data } = await api.post(
      "/auth/register",
      payload
    );

    localStorage.setItem(
      "library_token",
      data.token
    );

    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("library_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () =>
  useContext(AuthContext);