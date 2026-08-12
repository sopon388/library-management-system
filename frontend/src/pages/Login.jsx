import React from "react";
import { useState } from "react";
import {
  BookOpen,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to sign in"
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <span className="brand-mark">
          <BookOpen />
        </span>

        <strong>LibraCore</strong>
      </div>

      <div className="auth-card">
        <div className="auth-heading">
          <span className="eyebrow">
            LIBRARY PORTAL
          </span>

          <h1>Welcome back</h1>

          <p>
            Sign in to manage your library account.
          </p>
        </div>

        {error && (
          <div className="alert error">
            {error}
          </div>
        )}

        <form onSubmit={submit}>
          <label>
            Email

            <input
              type="email"
              required
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              placeholder="you@example.com"
            />

            <Mail />
          </label>

          <label>
            Password

            <div className="input-icon">
              <input
                type={show ? "text" : "password"}
                required
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                placeholder="••••••••"
              />

              <button
                type="button"
                onClick={() => setShow(!show)}
              >
                {show ? <EyeOff /> : <Eye />}
              </button>

              <LockKeyhole />
            </div>
          </label>

          <button
            className="primary-btn full"
            disabled={busy}
          >
            {busy
              ? "Signing in..."
              : "Sign in"}
          </button>
        </form>

        <p className="auth-foot">
          New member?{" "}
          <Link to="/register">
            Create an account
          </Link>
        </p>
      </div>

      <div className="auth-note">
        Secure access • Role-based permissions •
        Professional library management
      </div>
    </div>
  );
}