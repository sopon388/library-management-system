import React from "react";
import { useAuth } from "../context/AuthContext";
import { UserRound, ShieldCheck } from "lucide-react";

export default function Profile(){
 const {user}=useAuth();
 return <><div className="page-head"><div><span className="eyebrow">ACCOUNT</span><h1>My profile</h1><p>Account identity and access information.</p></div></div><div className="profile-card panel"><div className="profile-avatar">{user?.name?.[0]}</div><div><h2>{user?.name}</h2><p>{user?.email}</p><span className="role-pill"><ShieldCheck size={14}/>{user?.role}</span></div></div><div className="panel profile-details"><div><span>Full name</span><strong>{user?.name}</strong></div><div><span>Email</span><strong>{user?.email}</strong></div><div><span>Role</span><strong>{user?.role}</strong></div><div><span>Account status</span><strong>Active</strong></div></div></>;
}
