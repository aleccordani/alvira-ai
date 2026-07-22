import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";

import authRoutes from "./modules/auth/presentation/auth.routes.js";
import conversationRoutes from "./modules/conversation/presentation/conversation.routes.js";
import messageRoutes from "./modules/message/presentation/message.routes.js";
import chatRoutes from "./modules/chat/presentation/chat.routes.js";
import fileRoutes from "./modules/file/presentation/file.routes.js";
import documentRoutes from "./modules/pdf/presentation/document.routes.js";
import codeRoutes from "./modules/tools/code/presentation/code.routes.js";
import workspaceRoutes from "./modules/workspace/presentation/workspace.routes.js";
import workspaceFileRoutes from "./modules/workspace-file/presentation/workspace-file.routes.js";
import workspaceAiRoutes from "./modules/workspace-ai/presentation/workspace-ai.routes.js";
import aiToolsRoutes from "./modules/ai-tools/presentation/ai-tools.route.js";
import dashboardRouter from "./modules/dashboard/presentation/dashboard.route.js";
import imageRoutes from "./modules/image-generation/presentation/image.routes.js";
import analyticsRoutes from "./modules/analytics/presentation/analytics.routes.js";
import adminRoutes from "./modules/admin/presentation/admin.routes.js";
import billingRoutes from "./modules/billing/presentation/billing.routes.js";
import paymentRoutes from "./modules/payment/presentation/payment.routes.js";

import { errorMiddleware } from "./middlewares/error.middleware.js";
import { betterAuthHandler } from "./modules/auth/presentation/better-auth.routes.js";
import { betterAuthMiddleware } from "./middlewares/better-auth.middleware.js";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter((origin): origin is string => Boolean(origin));

app.set("trust proxy", 1);

app.use(
  cors({
    origin(origin, callback) {
      // Mengizinkan request server-to-server tanpa Origin,
      // termasuk webhook Midtrans dan health checker.
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin is not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  }),
);

app.use(compression());

/**
 * Better Auth harus dipasang sebelum express.json().
 * Better Auth menangani request body-nya sendiri.
 */
app.all("/api/auth/*splat", betterAuthHandler);

/**
 * Parser JSON untuk route aplikasi lainnya.
 */
app.use(
  express.json({
    limit: "10mb",
  }),
);

/**
 * Rate limit umum untuk API.
 * Nilainya nanti bisa disesuaikan berdasarkan traffic production.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 500,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many requests. Please try again later.",
  },
});

app.use("/api", apiLimiter);

/**
 * Health check untuk deployment platform.
 */
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "alvira-backend",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (_req, res) => {
  res.status(200).json({
    message: "Alvira Backend API is running",
  });
});

/**
 * Legacy authentication.
 * Hapus setelah dipastikan tidak ada frontend lama yang menggunakannya.
 */
app.use("/api/auth-legacy", authRoutes);

/**
 * Protected application routes.
 */
app.use("/api/conversations", betterAuthMiddleware, conversationRoutes);

app.use("/api/messages", betterAuthMiddleware, messageRoutes);

app.use("/api/chat", betterAuthMiddleware, chatRoutes);

app.use("/api/files", betterAuthMiddleware, fileRoutes);

app.use("/api/documents", betterAuthMiddleware, documentRoutes);

app.use("/api/tools/code", betterAuthMiddleware, codeRoutes);

app.use("/api/workspaces", betterAuthMiddleware, workspaceRoutes);

app.use("/api/workspaces", betterAuthMiddleware, workspaceFileRoutes);

app.use("/api", betterAuthMiddleware, workspaceAiRoutes);

app.use("/api/ai-tools", betterAuthMiddleware, aiToolsRoutes);

app.use("/api/dashboard", betterAuthMiddleware, dashboardRouter);

app.use("/api/analytics", betterAuthMiddleware, analyticsRoutes);

app.use("/api/image", betterAuthMiddleware, imageRoutes);

app.use("/api/billing", betterAuthMiddleware, billingRoutes);

/**
 * Payment routes tidak diberi middleware global karena webhook Midtrans
 * harus bisa dipanggil oleh server Midtrans.
 *
 * Endpoint checkout milik user wajib melakukan autentikasi
 * di dalam paymentRoutes/controller.
 */
app.use("/api/payment", paymentRoutes);

/**
 * Admin route wajib memiliki:
 * 1. autentikasi Better Auth
 * 2. pemeriksaan role ADMIN
 *
 * Middleware role admin tetap harus dipastikan ada di adminRoutes.
 */
app.use("/api/admin", betterAuthMiddleware, adminRoutes);

app.use(errorMiddleware);

export default app;
