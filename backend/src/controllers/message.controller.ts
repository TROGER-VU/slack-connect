import { Request, Response } from "express";
import UserToken from "../models/token.model";
import { postSlackMessage } from "../services/slack.service";
import ScheduledMessage from "../models/scheduledMessage.model";
import { Types } from "mongoose";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { getValidAccessToken } from "../services/token.service";


export const sendMessage = async (req: AuthenticatedRequest, res: Response) => {
  const { channel_id, text } = req.body;
  const { team_id, user_id } = req.user!;

  if (!team_id || !user_id || !channel_id || !text) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  let access_token: string;
  try {
    access_token = await getValidAccessToken(team_id, user_id);
  } catch (err) {
    console.error("Failed to get valid token:", err);
    return res.status(401).json({ error: "Slack not connected or token invalid" });
  }

  try {
    const result = await postSlackMessage(access_token, channel_id, text);
    return res.status(200).json({ message: "Message sent", slack_response: result });
  } catch (err) {
    console.error("Error sending Slack message:", err);
    return res.status(500).json({ error: "Failed to send message" });
  }
};

export const scheduleMessage = async (req: AuthenticatedRequest, res: Response) => {
  const { channel_id, text, send_time } = req.body;
  const { team_id, user_id } = req.user!;

  if (!team_id || !user_id || !channel_id || !text || !send_time) {
    console.log("❌ Missing required fields");
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    console.log("📥 Incoming schedule data:", {
      team_id,
      user_id,
      channel_id,
      text,
      send_time,
    });

    const parsedDate = new Date(send_time);
    console.log("📅 Parsed date:", parsedDate);

    const message = new ScheduledMessage({
      team_id,
      user_id,
      channel_id,
      text,
      send_time: parsedDate,
    });

    const result = await message.save();

    console.log("✅ Saved scheduled message:", result);

    return res.status(201).json({ message: "Scheduled successfully", id: result._id });
  } catch (err: any) {
    console.error("❌ Error scheduling message:", err.message);
    return res.status(500).json({ error: err.message });
  }
};

// GET /message/scheduled?team_id=...&user_id=...
export const getScheduledMessages = async (req: AuthenticatedRequest, res: Response) => {
  const { team_id, user_id } = req.user!;

  if (!team_id || !user_id) {
    return res.status(400).json({ error: "Missing team_id or user_id" });
  }

  try {
    const messages = await ScheduledMessage.find({
      team_id,
      user_id,
      sent: false,
    }).sort({ send_time: 1 });

    return res.status(200).json({ messages });
  } catch (err) {
    console.error("Error fetching scheduled messages:", err);
    return res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// DELETE /message/:id
export const deleteScheduledMessage = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid message ID" });
  }

  try {
    const deleted = await ScheduledMessage.findOneAndDelete({
      _id: id,
      sent: false,
    });

    if (!deleted) {
      return res.status(404).json({ error: "Message not found or already sent" });
    }

    return res.status(200).json({ message: "Scheduled message cancelled" });
  } catch (err) {
    console.error("Error deleting message:", err);
    return res.status(500).json({ error: "Failed to cancel message" });
  }
};
