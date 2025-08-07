import axios from "axios";

export const postSlackMessage = async (token: string, channel: string, text: string) => {
  const response = await axios.post(
    "https://slack.com/api/chat.postMessage",
    {
      channel,
      text,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.data.ok) {
    throw new Error(`Slack error: ${response.data.error}`);
  }

  return response.data;
};
