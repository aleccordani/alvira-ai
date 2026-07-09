import { Router } from "express";

import { conversationController } from "../../../container/conversation.container.js";

const router = Router();

router.post("/", conversationController.create);
router.get("/", conversationController.findAll);
router.get("/:id", conversationController.findOne);
router.patch("/:id", conversationController.update);
router.delete("/:id", conversationController.delete);

export default router;
