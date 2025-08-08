import cron from "node-cron";
import ScheduledMessage from "../models/scheduledMessage.model";
import { postSlackMessage } from "./slack.service";
import { getValidAccessToken } from "./token.service";

export const startMessageScheduler = () => {
  cron.schedule("*/10 * * * * *", async () => {
    console.log("🔁 Checking for messages to send...");

    const now = new Date();

    try {
      const messages = await ScheduledMessage.find({
        send_time: { $lte: now },
        sent: false,
      });

      for (const msg of messages) {
        try {
          const access_token = await getValidAccessToken(msg.team_id, msg.user_id);
          await postSlackMessage(access_token, msg.channel_id, msg.text);
          
          msg.sent = true;
          await msg.save();
          console.log(`✅ Sent message: ${msg._id}`);
        } catch (err) {
          console.error(`❌ Failed to send message ${msg._id}:`, err);
        }
      }
    } catch (err) {
      console.error("❌ Error fetching scheduled messages:", err);
    }
  });
};
