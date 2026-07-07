"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const handleResetPassword = async () => {
  if (!password || !confirmPassword) {
    alert("Password dan Konfirmasi Password wajib diisi.");
    return;
  }

  if (password.length < 6) {
    alert("Password minimal 6 karakter.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Konfirmasi password tidak sama.");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:3001/api/auth/reset-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    alert("Password berhasil direset. Silakan login.");

    router.push("/login");

  } catch (error) {
    console.error(error);

    alert("Terjadi kesalahan server.");
  }
};

  if (!token) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <h2>Token reset password tidak ditemukan.</h2>
    </div>
  );
}

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div
        style={{
          width: "400px",
          background: "#fff",
          padding: "24px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Reset Password
        </h2>



        <div style={{ marginBottom: "16px" }}>
          <label>Password Baru</label>
          <input
            type="password"
            placeholder="Masukkan password baru"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Konfirmasi Password</label>
          <input
            type="password"
            placeholder="Ulangi password baru"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
            }}
          />
        </div>

        <button
        onClick={handleResetPassword}
        style={{
            width: "100%",
            padding: "10px",
            cursor: "pointer",
        }}
        >
        Reset Password
        </button>
      </div>
    </div>
  );
}