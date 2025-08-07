import cron from "node-cron";
import ScheduledMessage from "../models/scheduledMessage.model";
import UserToken from "../models/token.model";
import { postSlackMessage } from "./slack.service";

export const startMessageScheduler = () => {
  cron.schedule("*/10 * * * * *", async () => {
    console.log("🔁 Checking for messages to send...");

    const now = new Date();

    const messages = await ScheduledMessage.find({
      send_time: { $lte: now },
      sent: false,
    });

    for (const msg of messages) {
      const tokenDoc = await UserToken.findOne({ team_id: msg.team_id, user_id: msg.user_id });

      if (!tokenDoc) {
        console.error("⚠️ No token found for message", msg._id);
        continue;
      }

      try {
        await postSlackMessage(tokenDoc.access_token, msg.channel_id, msg.text);
        msg.sent = true;
        await msg.save();
        console.log(`Sent message: ${msg._id}`);
      } catch (err) {
        console.error("Failed to send scheduled message:", err);
      }
    }
  });
};
