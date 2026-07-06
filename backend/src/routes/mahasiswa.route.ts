import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { allowRoles } from "../middlewares/role.middleware";

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
router.get(
  "/",
  authMiddleware,
  allowRoles("admin", "operator", "viewer"),
  getAllMahasiswa
);

// DETAIL
router.get("/:id", authMiddleware, getMahasiswaById);

// CREATE
router.post(
  "/",
  authMiddleware,
  allowRoles("admin", "operator"),
  uploadFotoMahasiswa.single("foto"),
  createMahasiswa
);

// UPDATE
router.put(
  "/:id",
  authMiddleware,
  allowRoles("admin", "operator"),
  uploadFotoMahasiswa.single("foto"),
  updateMahasiswa
);

// DELETE
router.delete(
  "/:id",
  authMiddleware,
  allowRoles("admin"),
  deleteMahasiswa
);

export default router;