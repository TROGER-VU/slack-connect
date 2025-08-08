import cron from "node-cron";
import ScheduledMessage from "../models/scheduledMessage.model";
import UserToken from "../models/token.model";
import { postSlackMessage } from "./slack.service";
import { getValidAccessToken } from "./token.service";


export const startMessageScheduler = () => {
  cron.schedule("*/10 * * * * *", async () => {
    console.log("🔁 Checking for messages to send...");

    const now = new Date();

    const messages = await ScheduledMessage.find({
      send_time: { $lte: now },
      sent: false,
    });

    for (const msg of messages) {
      let access_token: string;
      try {
        access_token = await getValidAccessToken(msg.team_id, msg.user_id);
      } catch (err) {
        console.error(`⚠️ Failed to retrieve valid token for message ${msg._id}:`, err);
        continue;
      }


      try {
        await postSlackMessage(access_token, msg.channel_id, msg.text);
        msg.sent = true;
        await msg.save();
        console.log(`Sent message: ${msg._id}`);
      } catch (err) {
        console.error("Failed to send scheduled message:", err);
      }
    }
  });
};
