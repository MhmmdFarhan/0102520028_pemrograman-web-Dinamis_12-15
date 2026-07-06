import { Request, Response } from "express";
import cors from "cors";
import app from "./app";
import path from "path";

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});

// Endpoint 1
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    service: "Express CRUD API",
  });
});

// Endpoint 2
app.get("/profile", (req: Request, res: Response) => {
  res.json({
    nama: "Muhamad Farhan",
    umur: 24,
    pekerjaan: "Mahasiswa",
  });
});

// Endpoint 3
app.get("/about", (req: Request, res: Response) => {
  res.json({
    aplikasi: "Latihan Express TypeScript",
    versi: "1.0.0",
    deskripsi: "API sederhana untuk tugas pertemuan 1",
  });
});

console.log("Current Directory:", process.cwd());
console.log("Upload Path:", path.join(process.cwd(), "uploads", "mahasiswa"));

app.listen(3001, () => {
  console.log("Server running on port 3001");
});