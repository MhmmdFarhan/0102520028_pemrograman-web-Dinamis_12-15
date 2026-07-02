"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MahasiswaForm from "../../components/MahasiswaForm";
import MahasiswaTable from "../../components/MahasiswaTable";
import {
  createMahasiswa,
  deleteMahasiswa,
  getMahasiswa,
  getProdi,
  Mahasiswa,
  Prodi,
  updateMahasiswa,
} from "../../lib/api";

export default function MahasiswaPage() {
  const [mahasiswa, setMahasiswa] = useState<Mahasiswa[]>([]);
  const [prodi, setProdi] = useState<Prodi[]>([]);
  const [selectedMahasiswa, setSelectedMahasiswa] =
    useState<Mahasiswa | null>(null);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Search, Filter, Pagination
  const [search, setSearch] = useState("");
  const [prodiId, setProdiId] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPage, setTotalPage] = useState(1);

  const loadMahasiswa = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getMahasiswa({
        search,
        prodi_id: prodiId,
        page,
        limit,
      });

      setMahasiswa(result.data);
      if (result.meta) {
        setTotalPage(result.meta.totalPage);
      } else {
        setTotalPage(1);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengambil data mahasiswa"
      );
    } finally {
      setLoading(false);
    }
  };

  const loadProdi = async () => {
    try {
      const data = await getProdi();
      setProdi(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadMahasiswa();
  }, [page]);

  useEffect(() => {
    loadProdi();
  }, []);

  const handleSearch = () => {
    setPage(1);
    loadMahasiswa();
  };

  const handleSubmit = async (
    formData: FormData
  ) => {
    try {
      setMessage("");
      setError("");

      if (selectedMahasiswa) {
        await updateMahasiswa(
          selectedMahasiswa.id,
          formData
        );

        setMessage(
          "Data mahasiswa berhasil diperbarui"
        );
      } else {
        await createMahasiswa(formData);

        setMessage(
          "Data mahasiswa berhasil ditambahkan"
        );
      }

      setSelectedMahasiswa(null);
      await loadMahasiswa();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan data"
      );
    }
  };

  const handleDelete = async (
    id: number
  ) => {
    const confirmed = window.confirm(
      "Yakin ingin menghapus data ini?"
    );

    if (!confirmed) return;

    try {
      setMessage("");
      setError("");

      await deleteMahasiswa(id);

      setMessage(
        "Data mahasiswa berhasil dihapus"
      );

      await loadMahasiswa();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menghapus data"
      );
    }
  };

  return (
    <main className="container">
      <div className="header">
        <div>
          <h1>CRUD Data Mahasiswa</h1>
          <p>
            Frontend Next.js yang terhubung ke
            backend Express.js.
          </p>
        </div>

        <Link href="/">
          <button className="btn-secondary">
            Kembali
          </button>
        </Link>
      </div>

      {message && (
        <div className="message">
          {message}
        </div>
      )}

      {error && (
        <div className="message error">
          {error}
        </div>
      )}

      <MahasiswaForm
        selectedMahasiswa={selectedMahasiswa}
        onSubmit={handleSubmit}
        onCancelEdit={() =>
          setSelectedMahasiswa(null)
        }
      />

      <section
        className="card"
        style={{ marginTop: 20 }}
      >
        <h2>Daftar Mahasiswa</h2>

        <div style={{ marginBottom: 20 }}>
          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Cari NIM atau Nama"
          />

          <select
            value={prodiId}
            onChange={(e) =>
              setProdiId(e.target.value)
            }
            style={{ marginLeft: 10 }}
          >
            <option value="">
              Semua Prodi
            </option>

            {prodi.map((item) => (
              <option
                key={item.id}
                value={item.id}
              >
                {item.nama_prodi}
              </option>
            ))}
          </select>

          <button
            onClick={handleSearch}
            style={{ marginLeft: 10 }}
          >
            Cari
          </button>
        </div>

        {loading ? (
          <p>Memuat data...</p>
        ) : (
          <>
            <MahasiswaTable
              mahasiswa={mahasiswa}
              onEdit={setSelectedMahasiswa}
              onDelete={handleDelete}
            />

            <div style={{ marginTop: 20 }}>
              <button
                disabled={page <= 1}
                onClick={() =>
                  setPage(page - 1)
                }
              >
                Previous
              </button>

              <span
                style={{
                  margin: "0 10px",
                }}
              >
                Halaman {page} dari{" "}
                {totalPage}
              </span>

              <button
                disabled={
                  page >= totalPage
                }
                onClick={() =>
                  setPage(page + 1)
                }
              >
                Next
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}