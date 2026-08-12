import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MailCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();

  const email = location.state?.email || "";

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email address is missing. Please register again.");
      return;
    }

    if (code.length !== 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    setBusy(true);

    try {
      await verifyEmail(email, code);
      navigate("/books");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Verification failed. Please try again."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <span className="brand-mark">
          <MailCheck />
        </span>
        <strong>LibraCore</strong>
      </div>

      <div className="auth-card">
        <div className="auth-heading">
          <span className="eyebrow">EMAIL VERIFICATION</span>

          <h1>Verify your email</h1>

          <p>
            We sent a 6-digit verification code to:
          </p>

          <strong>{email}</strong>
        </div>

        {error && (
          <div className="alert error">
            {error}
          </div>
        )}

        <form onSubmit={submit}>
          <label>
            Verification Code

            <input
              type="text"
              inputMode="numeric"
              maxLength="6"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, ""))
              }
              required
            />
          </label>

          <button
            className="primary-btn full"
            disabled={busy}
          >
            {busy ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <p className="auth-foot">
          Didn't receive the code? Check your spam folder.
        </p>
      </div>
    </div>
  );
}