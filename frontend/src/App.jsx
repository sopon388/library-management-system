import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";

import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Members from "./pages/Members";
import Circulation from "./pages/Circulation";
import Reservations from "./pages/Reservations";
import Notifications from "./pages/Notifications";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Routes>

      {/* Public Routes */}
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* NEW: Email verification must be public */}
      <Route
        path="/verify-email"
        element={<VerifyEmail />}
      />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>

          <Route
            index
            element={<Dashboard />}
          />

          <Route
            path="books"
            element={<Books />}
          />

          <Route
            path="circulation"
            element={
              <ProtectedRoute
                roles={["admin", "librarian"]}
              />
            }
          >
            <Route
              index
              element={<Circulation />}
            />
          </Route>

          <Route
            path="members"
            element={
              <ProtectedRoute
                roles={["admin", "librarian"]}
              />
            }
          >
            <Route
              index
              element={<Members />}
            />
          </Route>

          <Route
            path="reservations"
            element={<Reservations />}
          />

          <Route
            path="notifications"
            element={<Notifications />}
          />

          <Route
            path="reports"
            element={
              <ProtectedRoute
                roles={["admin", "librarian"]}
              />
            }
          >
            <Route
              index
              element={<Reports />}
            />
          </Route>

          <Route
            path="profile"
            element={<Profile />}
          />

        </Route>
      </Route>

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}