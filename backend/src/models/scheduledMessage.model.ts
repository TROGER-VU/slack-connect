import mongoose, { Schema, Document } from "mongoose";

export interface IScheduledMessage extends Document {
  team_id: string;
  user_id: string;
  channel_id: string;
  text: string;
  send_time: Date;
  sent: boolean;
}

const ScheduledMessageSchema: Schema = new Schema({
  team_id: { type: String, required: true },
  user_id: { type: String, required: true },
  channel_id: { type: String, required: true },
  text: { type: String, required: true },
  send_time: { type: Date, required: true },
  sent: { type: Boolean, default: false },
});

export default mongoose.model<IScheduledMessage>("ScheduledMessage", ScheduledMessageSchema);
