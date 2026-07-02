"use client";
 
import { useState } from "react";
import { saveAuth } from "@/lib/auth";
 
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
 
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
 
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
 
    const result = await response.json();
 
    if (!response.ok) {
      setError(result.message || "Login gagal");
      return;
    }
 
    saveAuth(result.token, result.user);
    window.location.href = "/mahasiswa";
  };
 
  return (
    <form onSubmit={handleLogin}>
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
}
