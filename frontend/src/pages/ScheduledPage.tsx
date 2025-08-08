import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

type ScheduledMessage = {
  _id: string;
  text: string;
  channel_id: string;
  send_time: string;
};

const ScheduledPage = () => {
  const [messages, setMessages] = useState<ScheduledMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const team_id = localStorage.getItem("team_id") || "T06EF9YEQAK";
  const user_id = localStorage.getItem("user_id") || "U06EP79DCHL";

  const cancelMessage = async (id: string) => {
    const confirm = window.confirm("Are you sure you want to cancel this message?");
    if (!confirm) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_BASE_URL}/message/${id}`);
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
      alert("✅ Message cancelled");
    } catch (err) {
      console.error("Failed to delete message:", err);
      alert("❌ Could not cancel message");
    }
  };
  useEffect(() => {
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/message/scheduled`,
        {
          params: { team_id, user_id },
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        }
      );
      const msgs = res.data?.messages;
      if (Array.isArray(msgs)) {
        setMessages(msgs);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error("Failed to fetch scheduled messages:", err);
      alert("❌ Could not load scheduled messages");
    } finally {
      setLoading(false);
    }
  };

  fetchMessages();
}, []);


  return (
    <div className="max-w-3xl mx-auto mt-12 p-6">
      <h1 className="text-3xl font-bold mb-6">📋 Scheduled Messages</h1>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : messages.length === 0 ? (
        <p className="text-gray-600">No scheduled messages found.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className="p-4 border rounded shadow-sm bg-white flex justify-between items-start"
            >
              <div>
                <p className="text-sm text-gray-500 mb-1">Channel: {msg.channel_id}</p>
                <p className="text-lg mb-2">{msg.text}</p>
                <p className="text-sm text-gray-600">
                  Scheduled for: {dayjs(msg.send_time).format("YYYY-MM-DD HH:mm")}
                </p>
              </div>
              <button
                onClick={() => cancelMessage(msg._id)}
                className="ml-4 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScheduledPage;
