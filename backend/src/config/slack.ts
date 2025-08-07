export const SLACK_OAUTH_CONFIG = {
  client_id: process.env.SLACK_CLIENT_ID!,
  client_secret: process.env.SLACK_CLIENT_SECRET!,
  redirect_uri: process.env.SLACK_REDIRECT_URI!,
  user_scope: [
    "chat:write",
    "channels:read",
    "groups:read",
    "im:write",
    "mpim:read",
  ].join(","),
};
