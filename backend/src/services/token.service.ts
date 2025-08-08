import axios from "axios";
import UserToken from "../models/token.model";
import { SLACK_OAUTH_CONFIG } from "../config/slack";

export const getValidAccessToken = async (team_id: string, user_id: string): Promise<string> => {
  const userToken = await UserToken.findOne({ team_id, user_id });

  if (!userToken) {
    throw new Error("No user token found");
  }

  // If token is still valid
  if (userToken.token_expiry && userToken.token_expiry > Date.now()) {
    return userToken.access_token;
  }

  // Refresh if expired
  if (!userToken.refresh_token) {
    throw new Error("Refresh token missing");
  }

  const params = new URLSearchParams({
    client_id: SLACK_OAUTH_CONFIG.client_id,
    client_secret: SLACK_OAUTH_CONFIG.client_secret,
    grant_type: "refresh_token",
    refresh_token: userToken.refresh_token,
  });

  const res = await axios.post("https://slack.com/api/oauth.v2.access", params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  const data = res.data;

  if (!data.ok) {
    throw new Error(`Failed to refresh token: ${data.error}`);
  }

  userToken.access_token = data.access_token;
  userToken.refresh_token = data.refresh_token ?? userToken.refresh_token;
  userToken.token_expiry = Date.now() + (data.expires_in * 1000 || 12 * 60 * 60 * 1000); 

  await userToken.save();
  return userToken.access_token;
};
