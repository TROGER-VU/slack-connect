// src/pages/SendPage.tsx
import { useState } from "react";
import axios from "axios";

const SendPage = () => {
  const [text, setText] = useState("");
  const [channelId, setChannelId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/message/send`,
        {
          team_id: localStorage.getItem("team_id") || "T06EF9YEQAK", // placeholder
          user_id: localStorage.getItem("user_id") || "U06EP79DCHL", // placeholder
          channel_id: channelId,
          text,
        }
      );

      alert("Message sent successfully!");
      setText("");
      setChannelId("");
    } catch (err) {
      console.error(err);
      alert("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-16 p-6 shadow-lg rounded-lg bg-white">
      <h1 className="text-2xl font-bold mb-4">Send Message to Slack Channel</h1>
      <input
        className="w-full p-2 border rounded mb-4"
        placeholder="Channel ID (e.g. C01ABCXYZ)"
        value={channelId}
        onChange={(e) => setChannelId(e.target.value)}
      />
      <textarea
        className="w-full p-2 border rounded mb-4"
        rows={4}
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={handleSend}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Sending..." : "Send Message"}
      </button>
    </div>
  );
};

export default SendPage;
