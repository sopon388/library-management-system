import React from "react";
import { NavLink } from "react-router-dom";
import { BookOpen, LayoutDashboard, Users, ArrowLeftRight, Bookmark, Bell, BarChart3, UserRound, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();
  const items = [
    ["Dashboard", "/", LayoutDashboard, ["admin", "librarian"]],
    ["Books", "/books", BookOpen, ["admin", "librarian", "member"]],
    ["Circulation", "/circulation", ArrowLeftRight, ["admin", "librarian"]],
    ["Members", "/members", Users, ["admin", "librarian"]],
    ["Reservations", "/reservations", Bookmark, ["admin", "librarian", "member"]],
    ["Notifications", "/notifications", Bell, ["admin", "librarian", "member"]],
    ["Reports", "/reports", BarChart3, ["admin", "librarian"]],
    ["Profile", "/profile", UserRound, ["admin", "librarian", "member"]]
  ];
  return <aside className={`sidebar ${open ? "open" : ""}`}>
    <div className="brand"><span className="brand-mark"><BookOpen size={21}/></span><span>LibraCore</span><button className="mobile-close" onClick={onClose}><X/></button></div>
    <div className="workspace"><span className="dot"></span> Main Library</div>
    <nav>{items.filter(x => x[3].includes(user?.role)).map(([label, to, Icon]) =>
      <NavLink key={to} to={to} onClick={onClose} className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
        <Icon size={19}/><span>{label}</span>
      </NavLink>
    )}</nav>
    <div className="sidebar-footer"><div className="mini-avatar">{user?.name?.[0]}</div><div><strong>{user?.name}</strong><small>{user?.role}</small></div></div>
  </aside>;
}
