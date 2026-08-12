import React from "react";
import { Bell, Menu, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Topbar({ onMenu }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return <header className="topbar">
    <button className="menu-btn" onClick={onMenu}><Menu/></button>
    <div className="global-search"><Search size={18}/><input placeholder="Search books, members, ISBN..." onKeyDown={e => e.key === "Enter" && navigate(`/books?search=${encodeURIComponent(e.currentTarget.value)}`)}/></div>
    <div className="top-actions">
      <button className="icon-btn" onClick={() => navigate("/notifications")}><Bell size={19}/></button>
      <div className="top-user"><div className="avatar">{user?.name?.[0]}</div><div className="top-user-info"><strong>{user?.name}</strong><span>{user?.role}</span></div></div>
      <button className="logout" onClick={logout}>Logout</button>
    </div>
  </header>;
}
