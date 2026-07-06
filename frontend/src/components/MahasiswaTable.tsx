"use client";

import { Mahasiswa } from "@/lib/api";
import { getUser } from "@/lib/auth";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL;

type Props = {
  mahasiswa: Mahasiswa[];
  onEdit: (item: Mahasiswa) => void;
  onDelete: (id: number) => Promise<void>;
};

export default function MahasiswaTable({
  mahasiswa,
  onEdit,
  onDelete,
}: Props) {

  const user = getUser();
  const role = user?.role;

  const canEdit =
    role === "admin" || role === "operator";

  const canDelete =
    role === "admin";
  if (mahasiswa.length === 0) {
    return <p>Belum ada data mahasiswa.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Foto</th>
          <th>NIM</th>
          <th>Nama</th>
          <th>Prodi</th>
          <th>Angkatan</th>
          <th>Aksi</th>
        </tr>
      </thead>

      <tbody>
        {mahasiswa.map((item) => (
          <tr key={item.id}>
            <td>
              <img
                src={
                  item.foto
                    ? `${BACKEND_URL}/uploads/mahasiswa/${item.foto}`
                    : "/avatar-placeholder.png"
                }
                alt={item.nama}
                width={48}
                height={48}
                style={{
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            </td>

            <td>{item.nim}</td>
            <td>{item.nama}</td>
            <td>{item.nama_prodi}</td>
            <td>{item.angkatan}</td>

            <td>
              {canEdit && (
                <button
                  onClick={() => onEdit(item)}
                >
                  Edit
                </button>
              )}

              {canDelete && (
                <button
                  onClick={() => onDelete(item.id)}
                  style={{ marginLeft: 8 }}
                >
                  Hapus
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}