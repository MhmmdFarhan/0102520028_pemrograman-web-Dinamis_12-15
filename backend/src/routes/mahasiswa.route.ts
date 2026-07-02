import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";

import {
  createMahasiswa,
  getAllMahasiswa,
  getMahasiswaById,
  updateMahasiswa,
  deleteMahasiswa,
} from "../controllers/mahasiswa.controller";

import { uploadFotoMahasiswa } from "../middlewares/upload.middleware";

const router = Router();

// READ + SEARCH + FILTER + PAGINATION
router.get("/", authMiddleware, getAllMahasiswa);

// DETAIL
router.get("/:id", authMiddleware, getMahasiswaById);

// CREATE
router.post(
  "/",
  authMiddleware,
  uploadFotoMahasiswa.single("foto"),
  createMahasiswa
);

// UPDATE
router.put(
  "/:id",
  authMiddleware,
  uploadFotoMahasiswa.single("foto"),
  updateMahasiswa
);

// DELETE
router.delete("/:id", authMiddleware, deleteMahasiswa);

export default router;