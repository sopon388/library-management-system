
import React, { useEffect, useState } from "react";
import { Bell, CheckCircle2 } from "lucide-react";
import api from "../services/api";

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadNotifications() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/notifications");
      setItems(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load notifications"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  async function markAsRead(id) {
    try {
      await api.patch(`/notifications/${id}/read`);
      await loadNotifications();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to mark notification as read"
      );
    }
  }

  if (loading) {
    return (
      <div className="screen-loader">
        Loading notifications...
      </div>
    );
  }

  return (
    <>
      <div className="page-head">
        <div>
          <span className="eyebrow">INBOX</span>

          <h1>Notifications</h1>

          <p>
            Important library alerts and account updates.
          </p>
        </div>
      </div>

      {error && (
        <div className="alert error">
          {error}
        </div>
      )}

      <div className="notification-list">
        {items.map((notification) => (
          <div
            className={`notification ${
              notification.read ? "read" : ""
            }`}
            key={notification._id}
          >
            <div className="notif-icon">
              <Bell size={18} />
            </div>

            <div>
              <strong>{notification.title}</strong>

              <p>{notification.message}</p>

              <small>
                {new Date(
                  notification.createdAt
                ).toLocaleString()}
              </small>
            </div>

            {!notification.read && (
              <button
                className="icon-btn"
                onClick={() =>
                  markAsRead(notification._id)
                }
                title="Mark as read"
              >
                <CheckCircle2 size={18} />
              </button>
            )}
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="empty-state">
          <Bell size={32} />

          <h3>You're all caught up</h3>

          <p>
            No notifications right now.
          </p>
        </div>
      )}
    </>
  );
}