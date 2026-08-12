import React from "react";
import { useEffect, useState } from "react";
import { Bookmark, Check, XCircle } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Reservations(){
 const {user}=useAuth();const [items,setItems]=useState([]),[books,setBooks]=useState([]),[error,setError]=useState("");
 const load=()=>api.get("/reservations").then(r=>setItems(r.data)).catch(e=>setError(e.response?.data?.message||"Unable to load reservations"));
 useEffect(()=>{load();api.get("/books").then(r=>setBooks(r.data))},[]);
 async function reserve(id){try{await api.post("/reservations",{bookId:id});load()}catch(e){setError(e.response?.data?.message||"Reservation failed")}}
 async function update(id,status){try{await api.patch(`/reservations/${id}`,{status});load()}catch(e){setError(e.response?.data?.message||"Update failed")}}
 return <><div className="page-head"><div><span className="eyebrow">RESERVATIONS</span><h1>Book reservations</h1><p>Reserve unavailable books or process member requests.</p></div></div>{error&&<div className="alert error">{error}</div>}{user.role==="member"&&<div className="book-grid compact">{books.filter(b=>b.availableCopies===0).map(b=><div className="mini-book" key={b._id}><div className="mini-icon"><Bookmark/></div><div><strong>{b.title}</strong><span>{b.author}</span></div><button className="secondary-btn" onClick={()=>reserve(b._id)}>Reserve</button></div>)}</div>}<div className="panel table-wrap"><table><thead><tr><th>Book</th><th>Member</th><th>Reserved</th><th>Status</th><th>Action</th></tr></thead><tbody>{items.map(x=><tr key={x._id}><td><strong>{x.book?.title}</strong></td><td>{x.member?.name||user.name}</td><td>{new Date(x.reservedAt).toLocaleDateString()}</td><td><span className="role-pill">{x.status}</span></td><td>{user.role!=="member"&&x.status==="pending"&&<span className="inline-actions"><button className="secondary-btn" onClick={()=>update(x._id,"approved")}><Check size={15}/></button><button className="danger-btn" onClick={()=>update(x._id,"cancelled")}><XCircle size={15}/></button></span>}</td></tr>)}</tbody></table></div></>;
}
