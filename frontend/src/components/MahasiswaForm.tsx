"use client";

import { FormEvent, useEffect, useState } from "react";
import { Mahasiswa, MahasiswaInput } from "@/lib/api";

type Props = {
  selectedMahasiswa: Mahasiswa | null;
  onSubmit: (fromData: FormData) => Promise<void>;
  onCancelEdit: () => void;
};

const initialForm: MahasiswaInput = {
  nim: "",
  nama: "",
  prodi_id: 0,
  angkatan: new Date().getFullYear(),
};

export default function MahasiswaForm({
  selectedMahasiswa,
  onSubmit,
  onCancelEdit,
}: Props) {
  const [form, setForm] =
    useState<MahasiswaInput>(initialForm);

  const [loading, setLoading] = useState(false);
  const [foto, setFoto] = useState<File | null>(null);

  useEffect(() => {
    if (selectedMahasiswa) {
      setForm({
        nim: selectedMahasiswa.nim,
        nama: selectedMahasiswa.nama,
        prodi_id: selectedMahasiswa.prodi_id,
        angkatan: selectedMahasiswa.angkatan,
      });
    } else {
      setForm(initialForm);
    }
  }, [selectedMahasiswa]);

const handleSubmit = async (
  event: FormEvent<HTMLFormElement>
) => {
  event.preventDefault();
  setLoading(true);

  try {
    const formData = new FormData();

    formData.append("nim", form.nim);
    formData.append("nama", form.nama);
    formData.append(
      "prodi_id",
      String(form.prodi_id)
    );
    formData.append(
      "angkatan",
      String(form.angkatan)
    );

    if (foto) {
      formData.append("foto", foto);
    }

    await onSubmit(formData);

    setForm(initialForm);
    setFoto(null);
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2>
        {selectedMahasiswa
          ? "Edit Mahasiswa"
          : "Tambah Mahasiswa"}
      </h2>

      <div className="grid">
        <div className="form-group">
          <label htmlFor="nim">NIM</label>

          <input
            id="nim"
            value={form.nim}
            onChange={(e) =>
              setForm({
                ...form,
                nim: e.target.value,
              })
            }
            placeholder="Contoh: 2201001"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="nama">Nama</label>

          <input
            id="nama"
            value={form.nama}
            onChange={(e) =>
              setForm({
                ...form,
                nama: e.target.value,
              })
            }
            placeholder="Nama mahasiswa"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="prodi_id">
            Prodi ID
          </label>

          <input
            id="prodi_id"
            type="number"
            value={form.prodi_id}
            onChange={(e) =>
              setForm({
                ...form,
                prodi_id: Number(
                  e.target.value
                ),
              })
            }
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="angkatan">
            Angkatan
          </label>

          <input
            id="angkatan"
            type="number"
            value={form.angkatan}
            onChange={(e) =>
              setForm({
                ...form,
                angkatan: Number(
                  e.target.value
                ),
              })
            }
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="foto">Foto</label>

        <input
          id="foto"
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setFoto(e.target.files[0]);
            }
          }}
        />
      </div>

      <div className="actions">
        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
        >
          {loading
            ? "Menyimpan..."
            : selectedMahasiswa
            ? "Update"
            : "Simpan"}
        </button>

        {selectedMahasiswa && (
          <button
            type="button"
            className="btn-secondary"
            onClick={onCancelEdit}
          >
            Batal Edit
          </button>
        )}
      </div>
    </form>
  );
}