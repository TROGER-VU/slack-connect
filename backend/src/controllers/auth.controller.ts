import { Request, Response } from "express";
import axios from "axios";
import { SLACK_OAUTH_CONFIG } from "../config/slack";
import UserToken from "../models/token.model"; // mongoose model

export const redirectToSlack = (_req: Request, res: Response) => {
  const slackOAuthUrl = `https://slack.com/oauth/v2/authorize?client_id=${SLACK_OAUTH_CONFIG.client_id}&user_scope=${SLACK_OAUTH_CONFIG.user_scope}&redirect_uri=${SLACK_OAUTH_CONFIG.redirect_uri}`;
  res.redirect(slackOAuthUrl);
};


export const handleSlackCallback = async (req: Request, res: Response) => {
  const code = req.query.code as string;
  if (!code) return res.status(400).json({ error: "Missing code" });

  try {
    const response = await axios.post("https://slack.com/api/oauth.v2.access",
      new URLSearchParams({
        client_id: SLACK_OAUTH_CONFIG.client_id,
        client_secret: SLACK_OAUTH_CONFIG.client_secret,
        code,
        redirect_uri: SLACK_OAUTH_CONFIG.redirect_uri,
        grant_type: "authorization_code",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const data = response.data;

    if (!data.ok || !data.authed_user?.access_token) {
      return res.status(500).json({ error: "OAuth failed", details: data });
    }

    const user_id = data.authed_user.id;
    const team_id = data.team?.id ?? "unknown";

    await UserToken.findOneAndUpdate(
      { team_id, user_id },
      {
        access_token: data.authed_user.access_token,
        refresh_token: data.authed_user.refresh_token ?? null, // use authed_user here
        token_expiry: data.expires_in ? Date.now() + data.expires_in * 1000 : null,
      },
      { upsert: true, new: true }
    );

    return res.send(`
      <h1>✅ Slack User Connected</h1>
      <p>You may close this window and return to the app.</p>
    `);
  } catch (error) {
    console.error("OAuth error:", error);
    return res.status(500).json({ error: "OAuth callback failed" });
  }
};
