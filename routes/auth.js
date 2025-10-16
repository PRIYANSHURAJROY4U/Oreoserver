dotenv.config();

import dotenv from "dotenv";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import User from "../models/User.js";

const router = express.Router();
const SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const COOKIE_SECURE = process.env.COOKIE_SECURE === "true";

function signToken(user) {
  return jwt.sign({ username: user.username, role: user.role }, SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

// Register (optional) - call once to create admin
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password || !validator.isAlphanumeric(username)) {
    return res.status(400).json({ message: "Invalid input" });
  }
  const existing = await User.findOne({ username });
  if (existing) return res.status(400).json({ message: "User exists" });

  const passwordHash = await bcrypt.hash(password, 10);
  const u = await User.create({ username, passwordHash, role: "admin" });
  res.json({ ok: true, username: u.username });
});

// TEMP REGISTER ROUTE — REMOVE AFTER FIRST ADMIN CREATION
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Prevent duplicate usernames
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashed,
      role: "admin",
    });

    res.json({
      message: "Admin account created",
      user: { username: user.username, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// export default router;

// Login -> sets HttpOnly cookie
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Missing" });

  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken(user);

  // set HttpOnly cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: COOKIE_SECURE, // true in prod (HTTPS)
    sameSite: "lax",
    maxAge: 1000 * 60 * 60, // match JWT expiry
  });

  res.json({ ok: true, username: user.username, role: user.role });
});

// logout - clear cookie
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ ok: true });
});

// whoami
router.get("/me", async (req, res) => {
  const token =
    req.cookies?.token || (req.headers.authorization || "").split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });
  try {
    const payload = jwt.verify(token, SECRET);
    res.json({ user: payload });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

export default router;
