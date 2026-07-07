import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import db from "../config/database";
import { mailer } from "../config/mail";
 
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
 
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Nama, email, dan password wajib diisi",
      });
    }
 
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password minimal 6 karakter",
      });
    }
 
    const [existing]: any = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
 
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email sudah digunakan" });
    }
 
    const hashedPassword = await bcrypt.hash(password, 10);
 
    await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, "viewer"]
    );
 
    res.status(201).json({ message: "Registrasi berhasil" });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      message: "Terjadi kesalahan server",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
 
    if (!email || !password) {
      return res.status(400).json({
        message: "Email dan password wajib diisi",
      });
    }
 
    const [rows]: any = await db.query(
      "SELECT id, name, email, password, role FROM users WHERE email = ?",
      [email]
    );
 
    if (rows.length === 0) {
      return res.status(401).json({ message: "Email atau password salah" });
    }
 
    const user = rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);
 
    if (!isValidPassword) {
      return res.status(401).json({ message: "Email atau password salah" });
    }
 
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
    return res.status(500).json({
        message: "JWT_SECRET belum dikonfigurasi",
    });
    }

    const expiresIn = process.env.JWT_EXPIRES_IN ?? "2h";

    const token = jwt.sign(
    {
        id: user.id,
        email: user.email,
        role: user.role,
    },
    jwtSecret,
    {
        expiresIn: expiresIn as any,
    }
    );
 
    res.json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
      console.error("LOGIN ERROR:", error); 

      res.status(500).json({
        message: "Terjadi kesalahan server",
      });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email wajib diisi",
      });
    }

    const [rows]: any = await db.query(
      "SELECT id, name, email FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Email tidak ditemukan",
      });
    }

    const user = rows[0];

    // Membuat token acak sepanjang 64 karakter hex
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token sebelum disimpan ke database
    const tokenHash = await bcrypt.hash(resetToken, 10);

    // Token berlaku selama 1 jam
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await db.query(
      `INSERT INTO password_reset_tokens
      (user_id, token_hash, expires_at)
      VALUES (?, ?, ?)`,
      [
        user.id,
        tokenHash,
        expiresAt,
      ]
    );

    const resetLink =
  `${process.env.APP_URL}/reset-password?token=${resetToken}`;


  
  await mailer.sendMail({
  from: process.env.MAIL_USER,
  to: user.email,
  subject: "Reset Password",

  html: `
    <h2>Reset Password</h2>

    <p>Halo ${user.name},</p>

    <p>Klik tombol berikut untuk mengganti password Anda.</p>

    <a href="${resetLink}"
       style="
          display:inline-block;
          padding:10px 20px;
          background:#2563eb;
          color:white;
          text-decoration:none;
          border-radius:5px;">
      Reset Password
    </a>

    <p>Atau buka link berikut:</p>

    <p>${resetLink}</p>

    <p>Link ini berlaku selama <b>1 jam</b>.</p>
  `,
});

return res.status(200).json({
    message: "Link reset password berhasil dikirim ke email.",
});

  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);

    return res.status(500).json({
      message: "Terjadi kesalahan server",
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        message: "Token dan password wajib diisi",
      });
    }

    const [rows]: any = await db.query(
      `SELECT *
       FROM password_reset_tokens
       WHERE used_at IS NULL`
    );

    let resetRecord = null;

    for (const row of rows) {
      const match = await bcrypt.compare(token, row.token_hash);

      if (match) {
        resetRecord = row;
        break;
      }
    }

    if (!resetRecord) {
      return res.status(400).json({
        message: "Token tidak valid",
      });
    }

    if (new Date() > new Date(resetRecord.expires_at)) {
      return res.status(400).json({
         message: "Token sudah kedaluwarsa",
      });
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password user
    await db.query(
      `UPDATE users
      SET password = ?
      WHERE id = ?`,
      [
        hashedPassword,
        resetRecord.user_id,
      ]
    );

    // Tandai token sudah digunakan
    await db.query(
      `UPDATE password_reset_tokens
      SET used_at = NOW()
      WHERE id = ?`,
      [
        resetRecord.id,
      ]
    );

    // Response
    return res.status(200).json({
      message: "Password berhasil direset. Silakan login dengan password baru.",
    });

  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);

    return res.status(500).json({
      message: "Terjadi kesalahan server",
    });
  }
};