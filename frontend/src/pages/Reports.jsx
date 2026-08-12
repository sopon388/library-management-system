import React, { useEffect, useState } from "react";
import {
  BarChart3,
  BookOpen,
  Users,
  AlertTriangle,
} from "lucide-react";
import api from "../services/api";

export default function Reports() {
  const [s, setS] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadReports = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/dashboard/stats");

        if (mounted) {
          setS(response.data);
        }
      } catch (err) {
        console.error("Failed to load reports:", err);

        if (mounted) {
          setError(
            err.response?.data?.message ||
              "Unable to load report data."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadReports();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="screen-loader">
        Loading reports...
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-head">
        <div>
          <span className="eyebrow">ANALYTICS</span>
          <h1>Reports</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!s) {
    return (
      <div className="empty-state">
        <BarChart3 size={36} />
        <h3>No report data available</h3>
        <p>
          There is currently no data available to generate reports.
        </p>
      </div>
    );
  }

  const cards = [
    {
      label: "Collection size",
      value: s.books ?? 0,
      icon: BookOpen,
    },
    {
      label: "Active members",
      value: s.members ?? 0,
      icon: Users,
    },
    {
      label: "Overdue loans",
      value: s.overdue ?? 0,
      icon: AlertTriangle,
    },
    {
      label: "Pending reservations",
      value: s.reservations ?? 0,
      icon: BarChart3,
    },
  ];

  return (
    <>
      <div className="page-head">
        <div>
          <span className="eyebrow">ANALYTICS</span>

          <h1>Reports</h1>

          <p>
            A concise operational snapshot for library management.
          </p>
        </div>

        <button
          className="secondary-btn"
          onClick={() => window.print()}
        >
          Print report
        </button>
      </div>

      <div className="report-grid">
        {cards.map(({ label, value, icon: Icon }) => (
          <div className="report-card" key={label}>
            <Icon />

            <span>{label}</span>

            <strong>{value}</strong>
          </div>
        ))}
      </div>

      <div className="panel">
        <div className="panel-head">
          <div>
            <h2>Operational summary</h2>

            <p>
              Use these metrics to prioritize daily library work.
            </p>
          </div>
        </div>

        <div className="summary-list">
          <div>
            <span>Available copies</span>

            <strong>
              {s.availableBooks ?? 0} / {s.books ?? 0}
            </strong>
          </div>

          <div>
            <span>Active loans</span>

            <strong>{s.issued ?? 0}</strong>
          </div>

          <div>
            <span>Recorded fines</span>

            <strong>
              ₹{s.fines ?? 0}
            </strong>
          </div>
        </div>
      </div>
    </>
  );
}