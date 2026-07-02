import multer from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express"; // Impor tipe data Request dari Express

const uploadPath = path.join(process.cwd(), "uploads", "mahasiswa");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  // Tambahkan tipe data pada parameter agar TypeScript tidak error
  destination(req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    cb(null, uploadPath);
  },

  filename(req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    // lowercase ekstensinya untuk menghindari masalah case-sensitive (.WEBP vs .webp)
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = Date.now() + ext;

    cb(null, uniqueName);
  },
});

export const uploadFotoMahasiswa = multer({
  storage,
});