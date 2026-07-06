"use client";

import { useEffect, useState } from "react";
import { getUser } from "@/lib/auth";
import { authFetch, API_URL } from "@/lib/api";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const currentUser = getUser();

    if (!currentUser || currentUser.role !== "admin") {
      alert("Hanya admin yang boleh mengakses halaman ini.");
      window.location.href = "/";
      return;
    }

    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const response = await authFetch(`${API_URL}/users`);

      const result = await response.json();

      setUsers(result.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function resetPassword(id: number) {
    try {
         const response = await authFetch(
        `${API_URL}/users/${id}/reset-password`,
        {
            method: "PATCH",
        }
        );

      const result = await response.json();

      alert(`Password sementara : ${result.temporaryPassword}`);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Daftar User</h1>

      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Email</th>
            <th>Role</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => resetPassword(user.id)}>
                  Reset Password
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}