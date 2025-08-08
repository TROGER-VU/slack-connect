import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { Trash2, Loader2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Define a type for the scheduled message object
type ScheduledMessage = {
  _id: string;
  channel_id: string;
  channel_name?: string;
  text: string;
  send_time: string;
};

const SchedulePage = () => {
  const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const team_id = searchParams.get("team_id");
  const user_id = searchParams.get("user_id");

  const fetchScheduledMessages = async () => {
    if (!team_id || !user_id) {
      console.error("❌ Missing team_id or user_id in URL.");
      setScheduledMessages([]);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/message/scheduled?team_id=${team_id}&user_id=${user_id}`
      );
      setScheduledMessages(res.data.messages);
    } catch (err) {
      console.error("❌ Failed to fetch scheduled messages.", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (messageId: string) => {
    setDeletingId(messageId);
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_BASE_URL}/message/${messageId}`);
      fetchScheduledMessages(); // Refresh list
    } catch (err) {
      console.error("❌ Failed to delete scheduled message.", err);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchScheduledMessages();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [team_id, user_id]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center font-sans">
      <div className="max-w-xl w-full mx-auto p-8 shadow-lg rounded-3xl bg-gray-800 border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-extrabold text-white">Scheduled Messages</h1>
          <div></div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-purple-500 w-8 h-8" />
            <span className="ml-4 text-xl">Loading messages...</span>
          </div>
        ) : scheduledMessages.length > 0 ? (
          <ul className="space-y-4">
            {scheduledMessages.map((msg) => (
              <li
                key={msg._id}
                className="flex items-center justify-between p-4 bg-gray-700 rounded-lg shadow-md"
              >
                <div className="flex-1">
                  <p className="text-gray-300 text-sm">
                    Scheduled for: {new Date(msg.send_time).toLocaleString()}
                  </p>
                  <p className="font-bold text-lg">{msg.text}</p>
                  <p className="text-purple-400">{msg.channel_name ? `#${msg.channel_name}` : msg.channel_id}</p>
                </div>
                <button
                  onClick={() => handleDelete(msg._id)}
                  disabled={deletingId === msg._id}
                  className="p-2 rounded-full text-red-400 hover:bg-red-500 hover:text-white transition-colors duration-200"
                >
                  {deletingId === msg._id ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p className="text-xl">No scheduled messages found.</p>
            <p className="text-md mt-2">Start scheduling messages from the composer!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulePage;
