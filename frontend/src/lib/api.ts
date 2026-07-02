import { getToken } from "./auth";

export const API_URL = "http://localhost:3001/api";

console.log("API_URL =", API_URL);

export type Prodi = {
  id: number;
  nama_prodi: string;
};

export type Mahasiswa = {
  id: number;
  nim: string;
  nama: string;
  prodi_id: number;
  nama_prodi: string;
  angkatan: number;
  foto?: string | null;
};

export type MahasiswaInput = {
  nim: string;
  nama: string;
  prodi_id: number;
  angkatan: number;
};

type ApiResponse<T> = {
  message: string;
  data?: T;
};

// ===============================
// Helper fetch dengan JWT
// ===============================
async function authFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getToken();

  const headers = new Headers(options.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(url, {
    ...options,
    headers,
  });
}

async function handleResponse<T>(
  response: Response
): Promise<ApiResponse<T>> {
  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Terjadi kesalahan saat mengakses API"
    );
  }

  return result;
}

// ===============================
// PRODI
// ===============================
export async function getProdi(): Promise<Prodi[]> {
  const response = await authFetch(`${API_URL}/prodi`, {
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result.data;
}

// ===============================
// MAHASISWA
// ===============================
export async function getMahasiswa(params: {
  search?: string;
  prodi_id?: string;
  page?: number;
  limit?: number;
}) {
  const query = new URLSearchParams();

  if (params.search) {
    query.set("search", params.search);
  }

  if (params.prodi_id) {
    query.set("prodi_id", params.prodi_id);
  }

  if (params.page) {
    query.set("page", String(params.page));
  }

  if (params.limit) {
    query.set("limit", String(params.limit));
  }

  const response = await authFetch(
    `${API_URL}/mahasiswa?${query.toString()}`,
    {
      cache: "no-store",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result;
}

export async function createMahasiswa(
  formData: FormData
) {
  const response = await authFetch(`${API_URL}/mahasiswa`, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result;
}

export async function updateMahasiswa(
  id: number,
  formData: FormData
) {
  const response = await authFetch(
    `${API_URL}/mahasiswa/${id}`,
    {
      method: "PUT",
      body: formData,
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result;
}

export async function deleteMahasiswa(
  id: number
): Promise<void> {
  const response = await authFetch(
    `${API_URL}/mahasiswa/${id}`,
    {
      method: "DELETE",
    }
  );

  await handleResponse(response);
}