import React from "react";
import { useEffect, useState } from "react";
import { BookOpen, Users, ArrowLeftRight, AlertTriangle, IndianRupee, Bookmark, TrendingUp } from "lucide-react";
import api from "../services/api";
import StatCard from "../components/StatCard";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth(); const [s,setS]=useState(null); const [error,setError]=useState("");
  useEffect(()=>{api.get("/dashboard/stats").then(r=>setS(r.data)).catch(e=>setError(e.response?.data?.message||"Could not load dashboard"))},[]);
  if(error)return <div className="empty-state"><AlertTriangle/><h3>{error}</h3></div>;
  if(!s)return <div className="screen-loader">Loading dashboard...</div>;
  return <><div className="page-head"><div><span className="eyebrow">OVERVIEW</span><h1>Good morning, {user?.name?.split(" ")[0]}.</h1><p>Here’s what’s happening across your library today.</p></div><div className="date-chip">Library operations</div></div>
  <div className="stats-grid"><StatCard icon={BookOpen} label="Total books" value={s.books} meta={`${s.availableBooks} copies available`} tone="blue"/><StatCard icon={Users} label="Active members" value={s.members} meta="Registered members" tone="purple"/><StatCard icon={ArrowLeftRight} label="Currently issued" value={s.issued} meta="Active loans" tone="green"/><StatCard icon={AlertTriangle} label="Overdue" value={s.overdue} meta="Needs attention" tone="orange"/><StatCard icon={IndianRupee} label="Collected fines" value={`₹${s.fines}`} meta="Recorded fines" tone="rose"/><StatCard icon={Bookmark} label="Reservations" value={s.reservations} meta="Pending requests" tone="cyan"/></div>
  <div className="content-grid"><section className="panel"><div className="panel-head"><div><h2>Library health</h2><p>Current collection availability</p></div><TrendingUp size={20}/></div><div className="health"><div><strong>{s.books ? Math.round(s.availableBooks/s.books*100):0}%</strong><span>Available copies</span></div><div className="progress"><span style={{width:`${s.books ? Math.round(s.availableBooks/s.books*100):0}%`}}/></div></div></section><section className="panel"><div className="panel-head"><div><h2>Quick actions</h2><p>Common librarian tasks</p></div></div><div className="quick-actions"><a href="/books">Manage books</a><a href="/circulation">Issue / return</a><a href="/members">Manage members</a><a href="/reports">View reports</a></div></section></div></>;
}
