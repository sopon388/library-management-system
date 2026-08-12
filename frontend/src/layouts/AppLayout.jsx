import React from "react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  return <div className="app-shell"><Sidebar open={open} onClose={() => setOpen(false)}/><div className="main-area"><Topbar onMenu={() => setOpen(true)}/><main className="page-content"><Outlet/></main></div>{open && <div className="overlay" onClick={() => setOpen(false)}/>}</div>;
}
