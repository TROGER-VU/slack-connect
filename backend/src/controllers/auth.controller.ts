import { Request, Response } from "express";
import axios from "axios";
import { SLACK_OAUTH_CONFIG } from "../config/slack";
import UserToken from "../models/token.model";

export const redirectToSlack = (_req: Request, res: Response) => {
  const slackOAuthUrl = `https://slack.com/oauth/v2/authorize?client_id=${SLACK_OAUTH_CONFIG.client_id}&user_scope=${SLACK_OAUTH_CONFIG.user_scope}&redirect_uri=${SLACK_OAUTH_CONFIG.redirect_uri}`;
  res.redirect(slackOAuthUrl);
};

export const handleSlackCallback = async (req: Request, res: Response) => {
  const code = req.query.code as string;
  if (!code) return res.status(400).json({ error: "Missing code" });

  try {
    const response = await axios.post(
      "https://slack.com/api/oauth.v2.access",
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
    const access_token = data.authed_user.access_token;

    // ✅ Save token in DB
    await UserToken.findOneAndUpdate(
      { team_id, user_id },
      {
        access_token,
        refresh_token: data.authed_user.refresh_token ?? null,
        token_expiry: data.authed_user.expires_in
          ? Date.now() + data.authed_user.expires_in * 1000
          : null,
      },
      { upsert: true, new: true }
    );

    // ✅ Fetch channels using access token
    const channelsResponse = await axios.get("https://slack.com/api/conversations.list", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const channelData = channelsResponse.data;

    if (!channelData.ok) {
      return res.status(500).json({ error: "Failed to fetch channels", details: channelData.error });
    }

    const channels = (channelData.channels || []).map((ch: any) => ({
      id: ch.id,
      name: ch.name,
    }));

    const encodedChannels = encodeURIComponent(JSON.stringify(channels));

    // ✅ Redirect with team_id, user_id, and channel list
    return res.redirect(
      `${process.env.FRONTEND_URL}/message?team_id=${team_id}&user_id=${user_id}&channels=${encodedChannels}`
    );
  } catch (error) {
    console.error("OAuth error:", error);
    return res.status(500).json({ error: "OAuth callback failed" });
  }
};
