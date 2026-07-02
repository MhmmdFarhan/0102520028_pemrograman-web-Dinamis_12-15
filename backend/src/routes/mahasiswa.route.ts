import { Router } from "express";

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
router.get("/", getAllMahasiswa);

// DETAIL
router.get("/:id", getMahasiswaById);

// CREATE
router.post(
  "/",
  uploadFotoMahasiswa.single("foto"),
  createMahasiswa
);

// UPDATE
router.put(
  "/:id",
  uploadFotoMahasiswa.single("foto"),
  updateMahasiswa
);

// DELETE
router.delete("/:id", deleteMahasiswa);

export default router;