import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import dbConnect from "./database/dbConnect.js";

import healtRoute from "../src/routes/healthCheck.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
// app.use(mongoSanitize());
app.use(hpp());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
});

app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// API Routes
app.use("/health", healtRoute);

// 404 handler
app.use((_, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

app.use((err, _, res, next) => {
  console.log(err);
  res.status(err.status || 500).json({
    status: "Error",
    message: err.message || "Internal Server Error",
    ...PORT(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

const startServer = async () => {
  try {
    const res = await dbConnect();
    app.listen(PORT, () => {
      console.log(`Server is running on PORT : ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection faild");
    process.exit(1);
  }
};

startServer();
