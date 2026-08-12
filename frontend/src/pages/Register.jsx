import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth(); const navigate = useNavigate();
  const [form,setForm]=useState({name:"",email:"",password:"",phone:"",address:""}); const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
  const change=e=>setForm({...form,[e.target.name]:e.target.value});
  async function submit(e){e.preventDefault();setError("");setBusy(true);try{await register(form);navigate("/books")}catch(err){setError(err.response?.data?.message||"Registration failed")}finally{setBusy(false)}}
  return <div className="auth-page"><div className="auth-brand"><span className="brand-mark"><BookOpen/></span><strong>LibraCore</strong></div><div className="auth-card wide"><div className="auth-heading"><span className="eyebrow">MEMBER REGISTRATION</span><h1>Create your account</h1><p>Register as a library member in a few steps.</p></div>{error&&<div className="alert error">{error}</div>}<form className="form-grid" onSubmit={submit}>{[["name","Full name"],["email","Email"],["phone","Phone"],["address","Address"]].map(([name,label])=><label key={name}>{label}<input name={name} type={name==="email"?"email":"text"} required={["name","email"].includes(name)} value={form[name]} onChange={change} /></label>)}<label className="span-2">Password<input name="password" type="password" minLength="6" required value={form.password} onChange={change}/></label><button className="primary-btn full span-2" disabled={busy}>{busy?"Creating...":"Create member account"}</button></form><p className="auth-foot">Already registered? <Link to="/login">Sign in</Link></p></div></div>;
}
