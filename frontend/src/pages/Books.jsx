import React from "react";
import { useEffect, useMemo, useState } from "react";
import { BookOpen, Plus, Search, Filter, Pencil, Archive, X, AlertTriangle } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const blank={title:"",author:"",isbn:"",category:"",publisher:"",year:"",totalCopies:1,availableCopies:1,location:"",description:""};

export default function Books(){
 const {user}=useAuth(); const [books,setBooks]=useState([]); const [q,setQ]=useState(""); const [category,setCategory]=useState(""); const [modal,setModal]=useState(false); const [edit,setEdit]=useState(null); const [form,setForm]=useState(blank); const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
 const load=()=>api.get("/books",{params:{search:q,category}}).then(r=>setBooks(r.data)).catch(e=>setError(e.response?.data?.message||"Could not load books"));
 useEffect(()=>{load()},[q,category]);
 const categories=useMemo(()=>[...new Set(books.map(b=>b.category).filter(Boolean))],[books]);
 function openNew(){setEdit(null);setForm(blank);setModal(true)}
 function openEdit(b){setEdit(b);setForm({...b});setModal(true)}
 async function save(e){e.preventDefault();setBusy(true);try{if(edit)await api.put(`/books/${edit._id}`,form);else await api.post("/books",form);setModal(false);load()}catch(e){setError(e.response?.data?.message||"Save failed")}finally{setBusy(false)}}
 async function archive(id){if(!confirm("Archive this book?"))return;try{await api.delete(`/books/${id}`);load()}catch(e){setError(e.response?.data?.message||"Action failed")}}
 return <><div className="page-head"><div><span className="eyebrow">COLLECTION</span><h1>Books</h1><p>Search, organize and manage your library collection.</p></div>{user?.role!=="member"&&<button className="primary-btn" onClick={openNew}><Plus size={18}/> Add book</button>}</div>
 {error&&<div className="alert error">{error}<button onClick={()=>setError("")}><X/></button></div>}
 <div className="toolbar"><div className="search-box"><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by title, author or ISBN"/></div><div className="select-box"><Filter size={17}/><select value={category} onChange={e=>setCategory(e.target.value)}><option value="">All categories</option>{categories.map(c=><option key={c}>{c}</option>)}</select></div></div>
 <div className="book-grid">{books.map(b=><article className="book-card" key={b._id}><div className="book-cover"><BookOpen size={32}/><span>{b.category}</span></div><div className="book-body"><div className="book-top"><span className={b.availableCopies?"status available":"status unavailable"}>{b.availableCopies?`${b.availableCopies} available`:"Unavailable"}</span><span className="location">{b.location||"—"}</span></div><h3>{b.title}</h3><p>by {b.author}</p><small>ISBN {b.isbn||"Not assigned"} • {b.year||"—"}</small><div className="book-actions">{user?.role==="member"?<button className="secondary-btn">View details</button>:<><button className="secondary-btn" onClick={()=>openEdit(b)}><Pencil size={15}/> Edit</button>{user?.role==="admin"&&<button className="danger-btn" onClick={()=>archive(b._id)}><Archive size={15}/></button>}</>}</div></div></article>)}</div>
 {books.length===0&&<div className="empty-state"><BookOpen/><h3>No books found</h3><p>Try a different search or add your first book.</p></div>}
 {modal&&<div className="modal-backdrop"><div className="modal"><div className="modal-head"><div><h2>{edit?"Edit book":"Add a new book"}</h2><p>Maintain accurate collection metadata.</p></div><button className="icon-btn" onClick={()=>setModal(false)}><X/></button></div><form className="form-grid" onSubmit={save}>{[["title","Title"],["author","Author"],["isbn","ISBN"],["category","Category"],["publisher","Publisher"],["year","Year"],["totalCopies","Total copies"],["location","Shelf / location"]].map(([k,l])=><label key={k}>{l}<input required={["title","author","category"].includes(k)} type={["year","totalCopies"].includes(k)?"number":"text"} value={form[k]??""} onChange={e=>setForm({...form,[k]:e.target.value})}/></label>)}<label className="span-2">Description<textarea rows="4" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></label><div className="modal-actions span-2"><button type="button" className="secondary-btn" onClick={()=>setModal(false)}>Cancel</button><button className="primary-btn" disabled={busy}>{busy?"Saving...":edit?"Save changes":"Create book"}</button></div></form></div></div>}
 </>;
}
