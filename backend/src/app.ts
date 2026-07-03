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



const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.json({
    message: "Alvira Backend API is running",
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/files", fileRoutes)
app.use("/api/documents", documentRoutes);
app.use("/api/tools/code", codeRoutes);


app.use(errorMiddleware);

export default app;
