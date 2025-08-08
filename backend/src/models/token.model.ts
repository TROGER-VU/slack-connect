import mongoose, { Schema, Document } from "mongoose";

export interface IUserToken extends Document {
  team_id: string;
  real_name?: string;
  user_id: string;
  access_token: string;
  refresh_token?: string;
  token_expiry?: number;
}

const TokenSchema: Schema = new Schema({
  team_id: { type: String, required: true },
  real_name: { type: String },
  user_id: { type: String, required: true },
  access_token: { type: String, required: true },
  refresh_token: { type: String },
  token_expiry: { type: Number },
});

export default mongoose.model<IUserToken>("UserToken", TokenSchema);
