import React from "react";
export default function StatCard({ icon: Icon, label, value, meta, tone = "" }) {
  return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={21}/></div><div className="stat-copy"><span>{label}</span><strong>{value}</strong><small>{meta}</small></div></div>;
}
