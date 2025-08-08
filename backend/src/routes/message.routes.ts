import express from "express";
import {
  sendMessage,
  scheduleMessage,
  getScheduledMessages,
  deleteScheduledMessage,
} from "../controllers/message.controller";
import { authenticateUser } from "../middlewares/auth.middleware";

const router = express.Router();

// ✅ Protect these routes
router.post("/send", authenticateUser, sendMessage);
router.post("/schedule", authenticateUser, scheduleMessage);
router.get("/scheduled", authenticateUser, getScheduledMessages);
router.delete("/:id", authenticateUser, deleteScheduledMessage);

export default router;
