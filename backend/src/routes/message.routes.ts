import express from "express";
import { 
    sendMessage, 
    scheduleMessage,
    getScheduledMessages,
    deleteScheduledMessage 
} from "../controllers/message.controller";

const router = express.Router();

router.post("/send", sendMessage);
router.post("/schedule", scheduleMessage);
router.get("/scheduled", getScheduledMessages);
router.delete("/:id", deleteScheduledMessage);


export default router;
