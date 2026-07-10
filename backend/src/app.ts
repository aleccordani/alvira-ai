import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/presentation/auth.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
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
import { authMiddleware } from "./middlewares/auth.middleware.js";
import analyticsRoutes from "./modules/analytics/presentation/analytics.routes.js";
// import betterAuthRoutes from "./modules/auth/presentation/better-auth.routes.js";
import { betterAuthHandler } from "./modules/auth/presentation/better-auth.routes.js";
import { betterAuthMiddleware } from "./middlewares/better-auth.middleware.js";
import adminRoutes from "./modules/admin/presentation/admin.routes.js";
import billingRoutes from "./modules/billing/presentation/billing.routes.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  }),
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Alvira Backend API is running",
  });
});

app.all("/api/auth/*splat", betterAuthHandler);
// Legacy auth lama, sementara tetap dipakai untuk frontend lama
app.use("/api/auth-legacy", authRoutes);

app.use("/api/conversations", betterAuthMiddleware, conversationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/tools/code", codeRoutes);
app.use("/api/workspaces", betterAuthMiddleware, workspaceRoutes);
app.use("/api/workspaces", betterAuthMiddleware, workspaceFileRoutes);
app.use("/api", betterAuthMiddleware, workspaceAiRoutes);
app.use("/api/ai-tools", aiToolsRoutes);
app.use("/api/dashboard", betterAuthMiddleware, dashboardRouter);
app.use("/api/analytics", betterAuthMiddleware, analyticsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/image", imageRoutes);
app.use("/api/billing", billingRoutes);

app.use(errorMiddleware);

export default app;
