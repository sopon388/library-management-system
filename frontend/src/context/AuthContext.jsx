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

    // NEW:
    // Registration now requires email verification.
    // Token will be created after OTP verification.
    return data;
  }

  // NEW FEATURE:
  // Verify email using the 6-digit OTP
  async function verifyEmail(email, code) {
    const { data } = await api.post(
      "/auth/verify-email",
      {
        email,
        code,
      }
    );

    // Save token after successful verification
    localStorage.setItem(
      "library_token",
      data.token
    );

    setUser(data.user);

    return data;
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
        verifyEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () =>
  useContext(AuthContext);