import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import poemRoutes from "./routes/poems.js";
import reviewRoutes from "./routes/reviews.js";
import subscriberRoutes from "./routes/subscribers.js";

const {
  MONGO_URI = "mongodb+srv://priyanshurajroy02659:Msdroy11@cluster0.ze2lknu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  PORT = 5000,
  CORS_ORIGIN = "http://localhost:3000",
} = process.env;

await mongoose.connect(MONGO_URI, {
  // mongoose options
});

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// rate limiter
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
});
app.use(limiter);

// CORS with credentials (important since we use HttpOnly cookie)
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
//above code is subjective to chnge as it may not be needed in future

app.use("/api/auth", authRoutes);
app.use("/api/poems", poemRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/subscribers", subscriberRoutes);

app.get("/", (req, res) => res.json({ message: "OreoVerse API is running!" }));

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// app.listen(PORT, () => {
//   console.log(`Backend started on port ${PORT}`);
// });

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}`);
  console.log(
    `📧 Email Service: ${
      process.env.EMAIL_USER ? "Configured ✓" : "Not Configured ✗"
    }`
  );
  console.log(`\n Available Routes:`);
  console.log(`  POST /api/subscribers/subscribe (PUBLIC)`);
  console.log(`  POST /api/subscribers/unsubscribe (PUBLIC)`);
  console.log(`  GET  /api/subscribers (PROTECTED)`);
  console.log(`  GET  /api/poems/published (PUBLIC)`);
  console.log(`  POST /api/poems (PROTECTED)\n`);
});

// new code without following some rest principle
